import { CargaRepository } from "./../../repositories/CargaRepository";
import moment from "moment";
//import cron from "node-cron";
import {
  IDadosUpdate,
  IInfoCarga,
  ILastLocations,
  IPosicaoAtual,
} from "./interfaceCargasJob";
import database, { mssqlCoordenadas } from "../../database";
import oracle from "../../database";
import DateUtils from "../../Utils/date";
//import { notifyAll } from "../../socketsRoutes";

class ServiceFinishCargasCsn {
  dataAtual = DateUtils.getCurrentDate();
  cargaRepository = new CargaRepository();

  public async getCargasAndamento(): Promise<IInfoCarga[]> {
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

  public optionSaveEfetivo(
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
            { TEMP_SERV_LOCAL_ENTREGA: timeServiceLocation },
          ];
        } else {
          return [
            { COLETA_EFETIVA: this.dataAtual },
            { SAIDA_EFETIVA: this.dataAtual },
            { TEMP_SERV_LOCAL: timeServiceLocation },
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
        SAIDA_EFETIVA,
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
        dataServico?: Date | null
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

            if (
              Number(calculoDistancia.toFixed(2)) < 700 &&
              statusServico === "Entrada"
            ) {
              const tipoEfetivoSave = this.optionSaveEfetivo(
                DESCRICAO,
                STATUS_SERVICO
              );
              arrayCargaUpdate.push({
                ...tipoEfetivoSave[0],
                ID,
                ID_CON_CARGAS,
              });
            } else if (Number(calculoDistancia.toFixed(2)) > 100) {
              //Somando tempo de carregamento ou entrega na empresa
              console.log("DATAAAAAA", dataServico);
              const startTime = moment(dataServico);
              const endTime = moment().subtract(1, "hour");
              const horasPermanenciaLocal = moment
                .utc(
                  moment(endTime, "HH:mm:ss").diff(
                    moment(startTime, "HH:mm:ss")
                  )
                )
                .format("HH:mm:ss");
              //seleciona o tipo de coluna que será dado a baixa
              const tipoEfetivoSave = this.optionSaveEfetivo(
                DESCRICAO,
                STATUS_SERVICO,
                horasPermanenciaLocal
              );
              arrayCargaUpdate.push({
                ...tipoEfetivoSave[1],
                ...tipoEfetivoSave[2],
                ID,
                ID_CON_CARGAS,
              });
            }
          }
        });
      };

      if (
        DESCRICAO?.trim() === "POSTO - 30" &&
        COLETA_EFETIVA_POSTO30 === null
      ) {
        const tipeServico = "Entrada";
        validandoBaixa(tipeServico);
      } else if (
        SAIDA_EFETIVA_POSTO30 === null &&
        DESCRICAO?.trim() === "POSTO - 30"
      ) {
        const tipeServico = "Saida";
        validandoBaixa(tipeServico, COLETA_EFETIVA_POSTO30);
      }

      if (
        DESCRICAO?.trim() === "MUNDO - CSN" &&
        COLETA_EFETIVA_MUNDO === null
      ) {
        const tipeServico = "Entrada";
        validandoBaixa(tipeServico);
      } else if (
        SAIDA_EFETIVA_MUNDO === null &&
        DESCRICAO?.trim() === "MUNDO - CSN"
      ) {
        const tipeServico = "Saida";
        validandoBaixa(tipeServico, COLETA_EFETIVA_MUNDO);
      }

      if (
        DESCRICAO?.trim() === "PEACAO - CSN" &&
        COLETA_EFETIVA_PEACAO === null
      ) {
        const tipeServico = "Entrada";
        validandoBaixa(tipeServico);
      } else if (
        SAIDA_EFETIVA_PEACAO === null &&
        DESCRICAO?.trim() === "PEACAO - CSN"
      ) {
        const tipeServico = "Saida";
        validandoBaixa(tipeServico, COLETA_EFETIVA_PEACAO);
      }

      if (COLETA_EFETIVA === null) {
        const tipeServico = "Entrada";
        validandoBaixa(tipeServico);
      } else if (SAIDA_EFETIVA === null) {
        const tipeServico = "Saida";
        validandoBaixa(tipeServico, COLETA_EFETIVA);
      }

      // if (ENTREGA_EFETIVA === null) {
      //   const tipeServico = "Entrada";
      //   validandoBaixa(tipeServico);
      // } else if(SAIDA_EFETIVA_ENTREGA === null){
      //   const tipeServico = "Saida";
      //   validandoBaixa(tipeServico, ENTREGA_EFETIVA);
      // }
    }
    return arrayCargaUpdate;
  }

  public async updatePontoParada({ ID, ...valuePontoParada }: IDadosUpdate) {
    console.log("DATA update Ponto parada", valuePontoParada, { ID });

    await database("con_pontos_parada")
      .update({
        ...valuePontoParada,
        DATA_ATUALIZACAO: this.dataAtual,
      })
      .where("ID", ID);
  }

  public async updateCargas(id: number) {
    console.log("DATA carga update", id);
    //   await database("con_cargas")
    //     .update({
    //       fk_situacao: 6,
    //       data_atualizacao: new Date(),
    //     })
    //     .where("id", id);

    //   const cargaAtualizada = await this.cargaRepository.index(id);
    //   notifyAll({
    //     name: "@carga-update",
    //     details: cargaAtualizada,
    //   });
    // }
  }
}

export default async function run() {
  async function job() {
    console.log(
      "|-------------------INICIO JOB CARGA CSN EM VIAGEM---------------------|"
    );
    try {
      const serviceFinishCargas = new ServiceFinishCargasCsn();
      const idsCargas = await serviceFinishCargas.getCargasAndamento();
      if (idsCargas.length) {
        const dadosAtualizar =
          await serviceFinishCargas.validateLoadToFinalization(idsCargas);

        if (dadosAtualizar.length) {
          dadosAtualizar.forEach((itemAtualizar) => {
            const { ID_CON_CARGAS, ...dataPontoPassagem } = itemAtualizar;
            serviceFinishCargas.updatePontoParada(dataPontoPassagem);
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
  // cron.schedule(" * * * * * ", job);
  job();
}
