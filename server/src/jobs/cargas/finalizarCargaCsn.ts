import { CargaRepository } from "./../../repositories/CargaRepository";
import moment from "moment";
import cron from "node-cron";
import { IDadosUpdate, IInfoCarga, ILastLocations } from "./interfaceCargasJob";
import database, { mssqlCoordenadas } from "../../database";
import { notifyAll } from "../../socketsRoutes";
import DateUtils from "../../Utils/date";

class ServiceFinishCargasCsn {
  dataAtual = new Date(
    // moment().subtract(1, "hour").format("YYYY-MM-DD HH:mm:ss")
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  cargaRepository = new CargaRepository();

  public async getCargasInicioTrajeto(): Promise<IInfoCarga[]> {
    return await database("con_cargas")
      .select(["con_cargas.id", "VEICULO.VEI_REFERENCIA"])
      .join("VEICULO", "VEICULO.VEI_PLACA", "con_cargas.placa_veiculo")
      .where("ativo", 1)
      .where("e_lote", 0)
      .andWhere("carga_csn", 1)
      .whereNotNull("VEICULO.VEI_REFERENCIA")
      .where("fk_situacao", 3)
      .orWhere("fk_situacao", 7)
      .orWhere("fk_situacao", 8);
  }

  public async lastPositionVeicle(
    veiReferencia: string
  ): Promise<ILastLocations | undefined> {
    if (veiReferencia) {
      const dataAtualMenos1Minuto = moment()
        .subtract(1, "minutes")
        .format("YYYY-MM-DDTHH:mm:ss");

      const queryBuild = await mssqlCoordenadas.raw(
        `select top 1 LAT, LON
      from REPORTES where DISIMEI = '${veiReferencia}' and (dtinc < '${dataAtualMenos1Minuto}') order by dtinc desc`
      );
      // const queryBuild = await mssqlCoordenadas.raw(
      //   `select top 1 LAT, LON
      // from REPORTES where DISIMEI = '1643027' and (dtinc < '${dataAtualMenos1Minuto}') order by dtinc desc`
      // );

      return queryBuild[0];
    }
  }

  public calculateDistancia(
    latAtual: number,
    lonAtual: number,
    latDestino: number,
    lonDestino: number
  ): number {
    // diferença de distancia latitudes e longitudes

    const dLat = ((latDestino - latAtual) * Math.PI) / 180.0;

    const dLon = ((lonDestino - lonAtual) * Math.PI) / 180.0;

    // conversao para radianos

    latAtual = (latAtual * Math.PI) / 180.0;

    latDestino = (latDestino * Math.PI) / 180.0;

    // desenvolvendo a formula

    const a =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.pow(Math.sin(dLon / 2), 2) *
        Math.cos(latAtual) *
        Math.cos(latDestino);

    const rad = 6371; // km da terra

    const c = 2 * Math.asin(Math.sqrt(a));

    return rad * c;
  }

  public montagemObjetoSaveIntermediario(
    statusServico: string,
    timeServiceLocation?: string
  ) {
    if (statusServico === "ENTREGA") {
      return [
        { ENTREGA_EFETIVA: this.dataAtual },
        { SAIDA_EFETIVA_ENTREGA: this.dataAtual },
        { TEMP_SERV_LOCAL_ENTREGA: timeServiceLocation },
      ];
    } else {
      return [
        { COLETA_EFETIVA: this.dataAtual },
        { SAIDA_EFETIVA_COLETA: this.dataAtual },
        { TEMP_SERV_LOCAL_COLETA: timeServiceLocation },
      ];
    }
  }

  public montagemObjetoSave(
    client: string,
    statusServico: string,
    entradaSaida?: string,
    timeServiceLocation?: string
  ) {
    switch (client?.trim()) {
      case "POSTO - 30": {
        const bodyPosto: any[] = [
          { COLETA_EFETIVA_POSTO30: this.dataAtual },
          { SAIDA_EFETIVA_COLETA: this.dataAtual },
          { TEMP_SERV_LOCAL_COLETA: timeServiceLocation },
        ];
        if (entradaSaida === "Saida") bodyPosto.push({ fk_situacao: 7 });
        return bodyPosto;
      }
      case "MUNDO - CSN": {
        const bodyMundo: any[] = [
          { COLETA_EFETIVA_MUNDO: this.dataAtual },
          { SAIDA_EFETIVA_COLETA: this.dataAtual },
          { TEMP_SERV_LOCAL_COLETA: timeServiceLocation },
        ];
        if (entradaSaida === "Saida") bodyMundo.push({ fk_situacao: 8 });
        return bodyMundo;
      }
      case "PEACAO - CSN": {
        return [
          { COLETA_EFETIVA_PEACAO: this.dataAtual },
          { SAIDA_EFETIVA_COLETA: this.dataAtual },
          { TEMP_SERV_LOCAL_COLETA: timeServiceLocation },
        ];
      }
      default:
        if (statusServico === "ENTREGA") {
          return [
            { ENTREGA_EFETIVA: this.dataAtual },
            { SAIDA_EFETIVA_ENTREGA: this.dataAtual },
            { TEMP_SERV_LOCAL_ENTREGA: timeServiceLocation },
          ];
        } else {
          return [
            { COLETA_EFETIVA: this.dataAtual },
            { SAIDA_EFETIVA_COLETA: this.dataAtual },
            { TEMP_SERV_LOCAL_COLETA: timeServiceLocation },
          ];
        }
    }
  }

  public async validateLoadToFinalization(infoCargas: IInfoCarga[]) {
    const arrayCargaUpdate: IDadosUpdate[] = [];
    // buscar dados do ponto de parada de acordo com id da carga
    for (const infoCarga of infoCargas) {
      const dadosPontoParada = await database("con_pontos_parada")
        .select([
          "con_pontos_parada.*",
          "con_rotas_csn.DESCRICAO",
          "con_rotas_csn.LATITUDE AS LATITUDE_ROTA",
          "con_rotas_csn.LONGITUDE AS LONGITUDE_ROTA",
          "con_rotas_csn.RAIO",
        ])
        .where("con_pontos_parada.ID_CON_CARGAS", infoCarga.id)
        .leftJoin(
          "con_rotas_csn",
          "con_rotas_csn.ID",
          "con_pontos_parada.ID_ROTAS_CSN"
        )
        .orderBy("con_pontos_parada.ID", "asc");

      const posicaoAtual = await this.lastPositionVeicle(
        String(infoCarga.VEI_REFERENCIA)
      );

      if (posicaoAtual) {
        let carregamentoMundoLiberado = false;
        let carregamentoPeacaoLiberado = false;
        let carregamentoIntermediarioLiberado = false;

        for (const item of dadosPontoParada) {
          const {
            LATITUDE_ROTA,
            LONGITUDE_ROTA,
            LATITUDE,
            LONGITUDE,
            ID,
            ID_CON_CARGAS,
            RAIO,
            STATUS_SERVICO,
            DESCRICAO,
            COLETA_EFETIVA,
            ENTREGA_EFETIVA,
            COLETA_EFETIVA_PEACAO,
            COLETA_EFETIVA_MUNDO,
            COLETA_EFETIVA_POSTO30,
            SAIDA_EFETIVA_COLETA,
            SAIDA_EFETIVA_ENTREGA,
            ENTREGA_FINAL,
          } = item;

          let latitudeDestino: number;
          let longitudeDestino: number;

          // identificando qual é a latitude e longitude a ser

          if (STATUS_SERVICO === "ENTREGA") {
            latitudeDestino = LATITUDE.replace(",", ".");
            longitudeDestino = LONGITUDE.replace(",", ".");
          } else {
            latitudeDestino = LATITUDE_ROTA.replace(",", ".");
            longitudeDestino = LONGITUDE_ROTA.replace(",", ".");
          }

          const validandoBaixa = async (
            entradaOrSaida: string,
            horasEntrada?: Date | null,
            tipoPassagem?: string
          ) => {
            //validando posição para dar baixa efetiva
            const { LAT, LON } = posicaoAtual;

            const latAtual = LAT.replace(",", ".");
            const lonAtual = LON.replace(",", ".");

            const calculoDistancia = this.calculateDistancia(
              Number(latAtual),
              Number(lonAtual),
              Number(latitudeDestino),
              Number(longitudeDestino)
            );

            const raioEmMetros = RAIO ? Number(RAIO) : 1;
            console.log(
              "distancia veiculo =>",
              calculoDistancia.toFixed(3),
              "Raio da empresa ->",
              raioEmMetros,
              "ID_ponto_parada:",
              ID
            );

            DESCRICAO;
            if (
              Number(calculoDistancia.toFixed(3)) < raioEmMetros &&
              //Number(calculoDistancia.toFixed(3)) < 1106.7 &&
              entradaOrSaida === "Entrada"
            ) {
              let tipoEfetivoSave;
              if (tipoPassagem === "intermediario") {
                tipoEfetivoSave =
                  this.montagemObjetoSaveIntermediario(STATUS_SERVICO);
              } else {
                tipoEfetivoSave = this.montagemObjetoSave(
                  DESCRICAO,
                  STATUS_SERVICO,
                  entradaOrSaida
                );
              }

              arrayCargaUpdate.push({
                ...tipoEfetivoSave[0],
                ID,
                ID_CON_CARGAS,
                STATUS_SERVICO,
                //ENTREGA_FINAL,
              });
            } else if (
              Number(calculoDistancia.toFixed(3)) > raioEmMetros &&
              //Number(calculoDistancia.toFixed(3)) > 0.4 &&
              entradaOrSaida === "Saida"
            ) {
              //Somando tempo de carregamento ou entrega na empresa
              const startTime = moment(horasEntrada);
              // const endTime = moment().subtract(1, "hour");
              const endTime = moment();
              const horasPermanenciaLocal = moment
                .utc(
                  moment(endTime, "HH:mm:ss").diff(
                    moment(startTime, "HH:mm:ss")
                  )
                )
                .format("HH:mm:ss");

              //seleciona o tipo de coluna que será dado a baixa
              let tipoEfetivoSave;

              if (tipoPassagem === "intermediario") {
                tipoEfetivoSave = this.montagemObjetoSaveIntermediario(
                  STATUS_SERVICO,
                  horasPermanenciaLocal
                );
              } else {
                tipoEfetivoSave = this.montagemObjetoSave(
                  DESCRICAO,
                  STATUS_SERVICO,
                  entradaOrSaida,
                  horasPermanenciaLocal
                );
              }

              arrayCargaUpdate.push({
                ...tipoEfetivoSave[1],
                ...tipoEfetivoSave[2],
                ...tipoEfetivoSave[3],
                ID,
                ID_CON_CARGAS,
                STATUS_SERVICO,
                ENTREGA_FINAL,
              });
            }
          };
          //If que separa cada ponto de passagem de acordo com as regras
          const tipeServicoSaida = "Saida";
          const tipeServicoEntrada = "Entrada";
          const tipoPassagem = "intermediario";

          if (
            DESCRICAO?.trim() === "POSTO - 30" &&
            COLETA_EFETIVA_POSTO30 === null
          ) {
            validandoBaixa(tipeServicoEntrada);
          } else if (
            DESCRICAO?.trim() === "POSTO - 30" &&
            SAIDA_EFETIVA_COLETA === null
          ) {
            validandoBaixa(tipeServicoSaida, COLETA_EFETIVA_POSTO30);
          } else if (
            DESCRICAO?.trim() === "POSTO - 30" &&
            SAIDA_EFETIVA_COLETA !== null
          ) {
            carregamentoMundoLiberado = true;
          }

          if (
            carregamentoMundoLiberado &&
            DESCRICAO?.trim() === "MUNDO - CSN" &&
            COLETA_EFETIVA_MUNDO === null
          ) {
            validandoBaixa(tipeServicoEntrada);
          } else if (
            carregamentoMundoLiberado &&
            DESCRICAO?.trim() === "MUNDO - CSN" &&
            SAIDA_EFETIVA_COLETA === null
          ) {
            validandoBaixa(tipeServicoSaida, COLETA_EFETIVA_MUNDO);
          } else if (
            carregamentoMundoLiberado &&
            DESCRICAO?.trim() === "MUNDO - CSN" &&
            SAIDA_EFETIVA_COLETA !== null
          ) {
            carregamentoPeacaoLiberado = true;
          }

          if (
            carregamentoPeacaoLiberado &&
            DESCRICAO?.trim() === "PEACAO - CSN" &&
            COLETA_EFETIVA_PEACAO === null
          ) {
            validandoBaixa(tipeServicoEntrada);
          } else if (
            carregamentoPeacaoLiberado &&
            DESCRICAO?.trim() === "PEACAO - CSN" &&
            SAIDA_EFETIVA_COLETA === null
          ) {
            validandoBaixa(tipeServicoSaida, COLETA_EFETIVA_PEACAO);
          } else if (
            carregamentoPeacaoLiberado &&
            DESCRICAO?.trim() === "PEACAO - CSN" &&
            SAIDA_EFETIVA_COLETA !== null
          ) {
            carregamentoIntermediarioLiberado = true;
          }

          if (
            carregamentoIntermediarioLiberado &&
            STATUS_SERVICO === "COLETA" &&
            COLETA_EFETIVA === null
          ) {
            validandoBaixa(tipeServicoEntrada, null, tipoPassagem);
          } else if (
            carregamentoIntermediarioLiberado &&
            STATUS_SERVICO === "COLETA" &&
            SAIDA_EFETIVA_COLETA === null
          ) {
            validandoBaixa(
              carregamentoIntermediarioLiberado && tipeServicoSaida,
              COLETA_EFETIVA,
              tipoPassagem
            );
          } else if (
            carregamentoIntermediarioLiberado &&
            STATUS_SERVICO === "ENTREGA" &&
            ENTREGA_EFETIVA === null
          ) {
            validandoBaixa(tipeServicoEntrada, null, tipoPassagem);
          } else if (
            carregamentoIntermediarioLiberado &&
            STATUS_SERVICO === "ENTREGA" &&
            SAIDA_EFETIVA_ENTREGA === null
          ) {
            validandoBaixa(tipeServicoSaida, ENTREGA_EFETIVA, tipoPassagem);
          }
        }
      }
    }
    return arrayCargaUpdate;
  }

  public async updatePontoParada({ ID, ...valuePontoParada }: IDadosUpdate) {
    const DATA_ATUALIZACAO = this.dataAtual;
    await database("con_pontos_parada")
      .update({
        ...valuePontoParada,
        DATA_ATUALIZACAO,
      })
      .where("ID", ID);

    const log = {
      oid: "robô",
      url: `/con_pontos_parada/${ID}`,
      metodo: "PUT",
      timestamp: DateUtils.getCurrentDate().getTime(),
      token: moment().format("YYYY-MM-DD"),
      corpo: `{ COLETA/ENTREGA: ${DATA_ATUALIZACAO}, DATA_ATUALIZACAO: ${DATA_ATUALIZACAO}}`,
    };

    await database("con_logs_csn").insert(log);
  }

  public async updateCargas(id: number, fk_situacao: number) {
    const data_atualizacao = new Date();
    await database("con_cargas")
      .update({
        fk_situacao,
        canal_comunicacao: "robô",
        data_atualizacao,
      })
      .where("id", id);

    const cargaAtualizada = await this.cargaRepository.index(id);
    notifyAll({
      name: "@carga-update",
      details: cargaAtualizada,
    });

    const log = {
      oid: "robô",
      url: `/cargas/${id}`,
      metodo: "PUT",
      timestamp: DateUtils.getCurrentDate().getTime(),
      token: moment().format("YYYY-MM-DD"),
      corpo: `{canal_comunicacao: 'robô', data_atualizacao: ${data_atualizacao}, fk_situacao: ${fk_situacao}}`,
    };

    await database("con_logs_csn").insert(log);
  }
}

export default async function run() {
  async function job() {
    console.log(
      "|-------------------INICIO JOB CARGA CSN EM VIAGEM---------------------|"
    );
    try {
      const serviceFinishCargas = new ServiceFinishCargasCsn();

      const idsCargas = await serviceFinishCargas.getCargasInicioTrajeto();
      if (idsCargas.length) {
        const dadosAtualizar =
          await serviceFinishCargas.validateLoadToFinalization(idsCargas);

        if (dadosAtualizar.length) {
          dadosAtualizar.forEach((itemAtualizar) => {
            const {
              ID_CON_CARGAS,
              STATUS_SERVICO,
              ENTREGA_FINAL,
              fk_situacao,
              ...dataPontoPassagem
            } = itemAtualizar;

            serviceFinishCargas.updatePontoParada(dataPontoPassagem);
            if (
              STATUS_SERVICO === "ENTREGA" &&
              ENTREGA_FINAL === 1 &&
              dataPontoPassagem.SAIDA_EFETIVA_ENTREGA
            ) {
              serviceFinishCargas.updateCargas(Number(ID_CON_CARGAS), 6);
            } else if (fk_situacao === 7 || fk_situacao === 8) {
              serviceFinishCargas.updateCargas(
                Number(ID_CON_CARGAS),
                fk_situacao
              );
            }
          });
        }
      }
    } catch (error) {
      console.error("ERROR JOB CSN", error);
    }
    console.log(
      "|-----------------FIM JOB CARGA CSN EM VIAGEM-------------------|"
    );
  }
  cron.schedule(" */2 * * * * ", job);
  //job();
}
