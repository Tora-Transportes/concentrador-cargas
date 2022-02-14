import cron from "node-cron";
import database from "../../database";
import { CargaRepository } from "../../repositories/CargaRepository";
import { notifyAll } from "../../socketsRoutes";
import DateUtils from "../../Utils/date";

class ServiceFinishCargas {
  async searchMDFEs(codigoCargas: number[]) {
    if (codigoCargas.length === 0) return [];
    const parameters = codigoCargas.map(() => "?").join(",");
    return database.raw(
      `
            SELECT
            ROT_SEQ,
            CAST(NUM_CAR AS VARCHAR(40)) AS DOC_ID,
            CAR.NUM_CAR AS NUM_VIAGEM,
            CAR.CAR_DT AS DT_HORA_EMISSAO,
            CAR.CAR_DT_PROTOCOLO_CANC AS DT_CANCELAMENTO,
            'MDFE' AS TIPO_DOC
            FROM CARGA CAR
            WHERE CAR.NUM_DOC_REFERENCIA IN
            (
            SELECT TO_CHAR(CAR.NUM_DVF) FROM CARGA CAR
            INNER JOIN DVF DVF ON DVF.NUM_DVF = CAR.NUM_DVF AND CAR.CAR_TP_DOC = 5
            AND CAR.NUM_CAR IN (${parameters})
            )
            UNION
            SELECT
            ROT_SEQ,
            CAST(CAR.NUM_CAR AS VARCHAR(40)) AS DOC_ID,
            RPA.NUM_CAR AS NUM_VIAGEM,
            CAR.CAR_DT AS DT_HORA_EMISSAO,
            CAR.CAR_DT_PROTOCOLO_CANC AS DT_CANCELAMENTO,
            'MDFE' AS TIPO_DOC
            FROM RPA RPA
            INNER JOIN CARGA CAR ON CAR.NUM_DOC_REFERENCIA = RPA.RPA_NUM
            WHERE RPA.NUM_CAR IN (${parameters})
        `,
      [...codigoCargas, ...codigoCargas]
    );
  }

  async searchCTEs(codigosCargas: number[]): Promise<Array<any>> {
    if (codigosCargas.length === 0) {
      return [];
    }
    const params = codigosCargas.map(() => `?`);
    return database.raw(
      `
      SELECT CAST(REC.REC_NUM AS VARCHAR(40)) AS DOC_ID,
      REC.REC_HR_EMISSAO AS DT_HORA_EMISSAO,
      NULL AS DT_CANCELAMENTO,
      'CTE' AS TIPO_DOC,
      ITC.NUM_CAR NUM_CAR
      FROM ITEM_CARGA  ITC
      INNER JOIN RECEITA REC ON REC.TDM_COD = ITC.TDM_COD
      AND ITC.FIL_COD = REC.FIL_COD 
      AND REC.REC_NUM = ITC.REC_NUM
      WHERE ITC.NUM_CAR IN (${params}) AND REC.TDM_COD = 24`,
      codigosCargas
    );
  }

  async searchNFSE(codigosCargas: number[]): Promise<any[]> {
    if (codigosCargas.length === 0) {
      return [];
    }
    const params = codigosCargas.map(() => `?`);
    return database.raw(
      `
      SELECT CAST(REC.REC_NUM AS VARCHAR(40)) AS DOC_ID,
      REC.REC_HR_EMISSAO AS DT_HORA_EMISSAO,
      NULL AS DT_CANCELAMENTO,
      'NFSE' AS TIPO_DOC,
      ITC.NUM_CAR
      FROM ITEM_CARGA  ITC
      INNER JOIN RECEITA REC ON REC.TDM_COD = ITC.TDM_COD
      AND ITC.FIL_COD = REC.FIL_COD 
      AND REC.REC_NUM = ITC.REC_NUM
      WHERE ITC.NUM_CAR IN (${params})
      AND REC.TDM_COD = 26
    `,
      codigosCargas
    );
  }

  async searchRPADVF(codigosCargas: number[]): Promise<any[]> {
    if (codigosCargas.length === 0) {
      return [];
    }
    const params = codigosCargas.map(() => `?`);
    return database.raw(
      `
    SELECT CAST(RPA.RPA_NUM AS VARCHAR(40)) AS DOC_ID,
    RPA.RPA_HR_EMISSAO AS DT_HORA_EMISSAO,
    RPA.RPA_DT_CANCEL AS DT_CANCELAMENTO,
    'RPA' AS TIPO_DOC,
    CAR.NUM_CAR
    FROM RPA RPA
    INNER JOIN CARGA CAR ON CAR.NUM_CAR = RPA.NUM_CAR
    AND CAR.FIL_CAR = RPA.FIL_CAR
    AND CAR.NUM_CAR IN (${params}) 
    AND CAR.CAR_TP_DOC = 5
    UNION
    SELECT CAST(CAR.NUM_DVF AS VARCHAR(40)) AS DOC_ID,
    DVF.DVF_DT_EMISSAO AS DT_HORA_EMISSAO,
    NULL AS DT_CANCELAMENTO,
    'DVF' AS TIPO_DOC,
    CAR.NUM_CAR
    FROM CARGA CAR
    INNER JOIN DVF DVF ON DVF.NUM_DVF = CAR.NUM_DVF
    WHERE CAR.NUM_CAR IN (${params})
    AND CAR.CAR_TP_DOC = 5`,
      [...codigosCargas, ...codigosCargas]
    );
  }

  distinct<T>(list: T[]): T[] {
    return Array.from(new Set(list));
  }

  async *run() {
    const PAGE_SIZE = 100;
    const totalRegisters = Number(
      (
        await database("con_cargas")
          .count("id as total")
          .where("fk_situacao", 3)
          .where("ativo", 1)
          .where("e_lote", 0)
          .first()
      )?.total
    );
    const totalPages = Math.ceil(Number(totalRegisters) / PAGE_SIZE);
    for (let page = 1; page <= totalPages; page++) {
      const idsCargasConcentrador = (
        await database("con_cargas")
          .select("id")
          .where("ativo", 1)
          .where("e_lote", 0)
          .where("fk_situacao", 3)
          .limit(PAGE_SIZE)
          .offset((page - 1) * PAGE_SIZE)
      ).map((i) => i.id);

      const referenciasCargasSit = await database("CARGA")
        .select(["NUM_CAR", "COD_ATS", "CAR_TP_DOC"])
        .whereIn("COD_ATS", idsCargasConcentrador);

      // O tipo de documento tem que ser 5
      const cargasSit = referenciasCargasSit.filter(
        (i) => Number(i.CAR_TP_DOC) === 5
      );
      console.log("Encontrei as seguintes cargas no SIT ");
      console.table(cargasSit);

      const translate = new Map();
      for (const i of referenciasCargasSit) {
        translate.set(String(i.NUM_CAR), i.COD_ATS);
      }

      const numerosDeCargas = cargasSit.map((i) => i.NUM_CAR);
      const cargasComCTE = this.distinct(
        (await this.searchCTEs(numerosDeCargas)).map((i) => i.NUM_CAR)
      );
      const cargasComMDFE = this.distinct(
        (await this.searchMDFEs(cargasComCTE)).map((i: any) => i.NUM_VIAGEM)
      );

      const cargasComNFSE = this.distinct(
        (await this.searchNFSE(numerosDeCargas)).map((i) => i.NUM_CAR)
      );
      const cargasRPADVF = this.distinct(
        (await this.searchRPADVF(cargasComNFSE)).map((i) => i.NUM_CAR)
      );

      console.log("CTE", cargasComCTE);
      console.log("MDFE", cargasComMDFE);
      console.log("NFSE", cargasComNFSE);
      console.log("RPA_DVF", cargasRPADVF);
      console.log("------------------------TRADUTOR------------------------");
      console.log("INDEX|NUM_CAR|COD_ATS");
      console.table(Array.from(translate));
      console.log("------------------------TRADUTOR------------------------");

      for (const cargaParaFinalizar of cargasComMDFE) {
        const codigoATS = translate.get(String(cargaParaFinalizar));
        if (!codigoATS) {
          console.error(
            `A carga ${cargaParaFinalizar} tem está com o codigo ATS vazio > ${codigoATS}`
          );
          continue;
        }
        console.log(
          `MDFE > Finaliza a carga ${cargaParaFinalizar} - ${codigoATS}`
        );
        yield codigoATS;
      }

      for (const cargaParaFinalizar of cargasRPADVF) {
        const codigoATS = translate.get(String(cargaParaFinalizar));
        if (!codigoATS) {
          console.error(
            `A carga ${cargaParaFinalizar} tem está com o codigo ATS vazio > ${codigoATS}`
          );
          continue;
        }
        console.log(
          `NFSE > Finaliza a carga ${cargaParaFinalizar} - ${codigoATS}`
        );
        yield codigoATS;
      }
    }
  }
}

export default async function run() {
  async function job() {
    console.log(
      "|-------------------JOB CARGA EM VIAGEM---------------------|"
    );
    try {
      const service = new ServiceFinishCargas();
      const cargaRepository = new CargaRepository();
      for await (const codigoCarga of service.run()) {
        console.log(`Atualizando carga que possui o código ${codigoCarga}`);
        await database("con_cargas")
          .update({
            fk_situacao: 6,
            data_atualizacao: DateUtils.getCurrentDate(),
          })
          .where("id", codigoCarga);
        const cargaAtualizada = await cargaRepository.index(codigoCarga);
        notifyAll({
          name: "@carga-update",
          details: cargaAtualizada,
        });
      }
    } catch (error) {
      console.error(error);
    }
    console.log(
      "|-----------------FIM JOB CARGA EM VIAGEM-------------------|"
    );
  }
  // cron.schedule("* * * * *", job);
  job();
}
