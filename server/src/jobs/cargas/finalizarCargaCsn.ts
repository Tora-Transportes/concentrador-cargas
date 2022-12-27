import { CargaRepository } from "./../../repositories/CargaRepository";
import moment from "moment";
import cron from "node-cron";
import {
  IDadosUpdate,
  IInfoCarga,
  ILastLocations,
  IPosicaoAtual,
} from "./interfaceCargasJob";
import database, { mssqlCoordenadas } from "../../database";
import oracle from "../../database";
import { notifyAll } from "../../socketsRoutes";

class ServiceFinishCargasCsn {
  dataAtual = new Date(
    // moment().subtract(1, "hour").format("YYYY-MM-DD HH:mm:ss")
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  cargaRepository = new CargaRepository();

  public async getCargasInicioTrajeto(): Promise<IInfoCarga[]> {
    return await database("con_cargas")
      .select(["id", "placa_veiculo"])
      .where("ativo", 1)
      .where("e_lote", 0)
      .where("fk_situacao", 3)
      .andWhere("carga_csn", 1);
  }

  public async lastPositionVeicle(
    plate: string
  ): Promise<ILastLocations | undefined> {
    const { VEI_REFERENCIA } = await oracle("VEICULO")
      .select(["VEI_REFERENCIA"])
      .first()
      .where("VEI_PLACA", plate);

    if (VEI_REFERENCIA) {
      const dataAtualMenos1Minuto = moment()
        .subtract(1, "minutes")
        .format("YYYY-MM-DDTHH:mm:ss");

      const queryBuild = await mssqlCoordenadas.raw(
        `select top 1 LAT, LON
      from REPORTES where DISIMEI = '${VEI_REFERENCIA}' and (dtinc < '${dataAtualMenos1Minuto}') order by dtinc desc`
      );

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
        //{ TEMP_SERV_LOCAL_ENTREGA: timeServiceLocation },
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
    tipe: string,
    statusServico: string,
    timeServiceLocation?: string
  ) {
    switch (tipe?.trim()) {
      case "POSTO - 30":
        return [
          { COLETA_EFETIVA_POSTO30: this.dataAtual },
          { SAIDA_EFETIVA_POSTO30: this.dataAtual },
          { TEMP_SERV_LOCAL_POSTO30: timeServiceLocation },
        ];
      case "MUNDO - CSN":
        return [
          { COLETA_EFETIVA_MUNDO: this.dataAtual },
          { SAIDA_EFETIVA_MUNDO: this.dataAtual },
          { TEMP_SERV_LOCAL_MUNDO: timeServiceLocation },
        ];
      case "PEACAO - CSN":
        return [
          { COLETA_EFETIVA_PEACAO: this.dataAtual },
          { SAIDA_EFETIVA_PEACAO: this.dataAtual },
          { TEMP_SERV_LOCAL_PEACAO: timeServiceLocation },
        ];
      default:
        if (statusServico === "ENTREGA") {
          return [
            { ENTREGA_EFETIVA: this.dataAtual },
            { SAIDA_EFETIVA_ENTREGA: this.dataAtual },
            //{ TEMP_SERV_LOCAL_ENTREGA: timeServiceLocation },
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
    const arrayId = infoCargas.map((i) => i.id);
    // buscar dados do ponto de parada de acordo com id da carga
    const dadosPontoParada = await database("con_pontos_parada")
      .select([
        "con_pontos_parada.*",
        "con_rotas_csn.DESCRICAO",
        "con_rotas_csn.LATITUDE AS LATITUDE_ROTA",
        "con_rotas_csn.LONGITUDE AS LONGITUDE_ROTA",
        "con_rotas_csn.RAIO",
      ])
      .whereIn("con_pontos_parada.ID_CON_CARGAS", arrayId)
      .leftJoin(
        "con_rotas_csn",
        "con_rotas_csn.ID",
        "con_pontos_parada.ID_ROTAS_CSN"
      )
      .orderBy("con_pontos_parada.ID", "asc");

    const arrayPositionCurrent: IPosicaoAtual[] = [];
    const arrayCargaUpdate: IDadosUpdate[] = [];
    //  Buscar ultima posição do veiculo
    for (const item of infoCargas) {
      const posicaoAtual = await this.lastPositionVeicle(item.placa_veiculo);
      if (posicaoAtual) {
        arrayPositionCurrent.push({
          ...posicaoAtual,
          id: item.id,
        });
      }
    }
    //for para decidir qual carga será finalizada
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
        SAIDA_EFETIVA_POSTO30,
        SAIDA_EFETIVA_MUNDO,
        SAIDA_EFETIVA_PEACAO,
        SAIDA_EFETIVA_COLETA,
        SAIDA_EFETIVA_ENTREGA,
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
        statusServico: string,
        horasEntrada?: Date | null,
        passagem?: string
      ) => {
        //validando posição para dar baixa efetiva
        arrayPositionCurrent.map((position) => {
          const { LAT, LON, id: idCargaPosition } = position;
          if (ID_CON_CARGAS === idCargaPosition) {
            const latAtual = LAT.replace(",", ".");
            const lonAtual = LON.replace(",", ".");

            const calculoDistancia = this.calculateDistancia(
              Number(latAtual),
              Number(lonAtual),
              Number(latitudeDestino),
              Number(longitudeDestino)
            );
            console.log("DISTANCIA DA PARADA --------------", calculoDistancia);
            const raioEmMetros = RAIO ? Number(RAIO) * 1000 : 2000;
            if (
              Number(calculoDistancia.toFixed(2)) < raioEmMetros &&
              statusServico === "Entrada"
            ) {
              let tipoEfetivoSave;
              if (passagem === "intermediario") {
                tipoEfetivoSave =
                  this.montagemObjetoSaveIntermediario(STATUS_SERVICO);
              } else {
                tipoEfetivoSave = this.montagemObjetoSave(
                  DESCRICAO,
                  STATUS_SERVICO
                );
              }
              arrayCargaUpdate.push({
                ...tipoEfetivoSave[0],
                ID,
                ID_CON_CARGAS,
                STATUS_SERVICO,
              });
            } else if (
              Number(calculoDistancia.toFixed(2)) > raioEmMetros &&
              statusServico === "Saida"
            ) {
              //Somando tempo de carregamento ou entrega na empresa
              const startTime = moment(horasEntrada);
              const endTime = moment().subtract(1, "hour");
              const horasPermanenciaLocal = moment
                .utc(
                  moment(endTime, "HH:mm:ss").diff(
                    moment(startTime, "HH:mm:ss")
                  )
                )
                .format("HH:mm:ss");
              //seleciona o tipo de coluna que será dado a baixa
              let tipoEfetivoSave;
              if (passagem === "intermediario") {
                tipoEfetivoSave = this.montagemObjetoSaveIntermediario(
                  STATUS_SERVICO,
                  horasPermanenciaLocal
                );
              } else {
                tipoEfetivoSave = this.montagemObjetoSave(
                  DESCRICAO,
                  STATUS_SERVICO,
                  horasPermanenciaLocal
                );
              }

              arrayCargaUpdate.push({
                ...tipoEfetivoSave[1],
                ...tipoEfetivoSave[2],
                ID,
                ID_CON_CARGAS,
                STATUS_SERVICO,
              });
            }
          }
        });
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
        SAIDA_EFETIVA_POSTO30 === null
      ) {
        validandoBaixa(tipeServicoSaida, COLETA_EFETIVA_POSTO30);
      } else if (
        DESCRICAO?.trim() === "MUNDO - CSN" &&
        COLETA_EFETIVA_MUNDO === null
      ) {
        validandoBaixa(tipeServicoEntrada);
      } else if (
        DESCRICAO?.trim() === "MUNDO - CSN" &&
        SAIDA_EFETIVA_MUNDO === null
      ) {
        validandoBaixa(tipeServicoSaida, COLETA_EFETIVA_MUNDO);
      } else if (
        DESCRICAO?.trim() === "PEACAO - CSN" &&
        COLETA_EFETIVA_PEACAO === null
      ) {
        validandoBaixa(tipeServicoEntrada);
      } else if (
        DESCRICAO?.trim() === "PEACAO - CSN" &&
        SAIDA_EFETIVA_PEACAO === null
      ) {
        validandoBaixa(tipeServicoSaida, COLETA_EFETIVA_PEACAO);
      } else if (STATUS_SERVICO === "COLETA" && COLETA_EFETIVA === null) {
        validandoBaixa(tipeServicoEntrada, null, tipoPassagem);
      } else if (STATUS_SERVICO === "COLETA" && SAIDA_EFETIVA_COLETA === null) {
        validandoBaixa(tipeServicoSaida, COLETA_EFETIVA, tipoPassagem);
      } else if (STATUS_SERVICO === "ENTREGA" && ENTREGA_EFETIVA === null) {
        validandoBaixa(tipeServicoEntrada, null, tipoPassagem);
      } else if (
        STATUS_SERVICO === "ENTREGA" &&
        SAIDA_EFETIVA_ENTREGA === null
      ) {
        validandoBaixa(tipeServicoSaida, ENTREGA_EFETIVA, tipoPassagem);
      }
    }
    return arrayCargaUpdate;
  }

  public async updatePontoParada({ ID, ...valuePontoParada }: IDadosUpdate) {
    await database("con_pontos_parada")
      .update({
        ...valuePontoParada,
        DATA_ATUALIZACAO: this.dataAtual,
      })
      .where("ID", ID);
  }

  public async updateCargas(id: number) {
    await database("con_cargas")
      .update({
        fk_situacao: 6,
        data_atualizacao: new Date(),
      })
      .where("id", id);

    const cargaAtualizada = await this.cargaRepository.index(id);
    notifyAll({
      name: "@carga-update",
      details: cargaAtualizada,
    });
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
            const { ID_CON_CARGAS, STATUS_SERVICO, ...dataPontoPassagem } =
              itemAtualizar;
            serviceFinishCargas.updatePontoParada(dataPontoPassagem);
            if (STATUS_SERVICO === "ENTREGA")
              serviceFinishCargas.updateCargas(Number(ID_CON_CARGAS));
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
  cron.schedule(" * * * * * ", job);
  //job();
}
