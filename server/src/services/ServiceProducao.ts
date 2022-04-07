import database, { mssql } from "../database";
import AppError from "../models/AppError";

export interface IEventoJustificativa {
  codigo_veiculo: number;
  data_inicio: Date;
  data_final: Date;
  conteudo: string;
  id: number;
}

class ServiceProducao {
  async index(placa_veiculo: string): Promise<any> {
    const codigoCavalo = (
      await database("VEICULO")
        .where("VEI_PLACA", placa_veiculo)
        .first()
        .select("VEI_COD")
    )?.VEI_COD;

    if (!codigoCavalo) {
      throw new AppError("Veículo não encontrado", 404);
    }

    const documentos = await database.raw(
      `
        SELECT 'DOCUMENTO DVF' as EVENTO, 
          CAST(T1.NUM_DVF AS VARCHAR(2048)) AS CONTEUDO,
          (CORI.CID_NOM || ' - ' || EORI.UF_SIGLA) AS ORIGEM,
          (CDES.CID_NOM || ' - ' || EDES.UF_SIGLA) AS DESTINO,
          DVF_DT_EMISSAO AS DATA_INICIO,
          NULL as DATA_FINAL,
          T1.POS AS RANK
          FROM (SELECT ROW_NUMBER() OVER (PARTITION BY COD_CAVALO ORDER BY DVF_DT_EMISSAO DESC) as POS, DVF.CID_ORI, DVF.CID_DES, DVF.COD_CAVALO, DVF.NUM_DVF, DVF.DVF_DT_EMISSAO FROM DVF) T1 
          JOIN CIDADE CORI ON CORI.CID_COD = T1.CID_ORI
          JOIN ESTADO EORI ON CORI.UF_COD = EORI.UF_COD
          JOIN CIDADE CDES ON CDES.CID_COD = T1.CID_DES
          JOIN ESTADO EDES ON CDES.UF_COD = EDES.UF_COD
          WHERE T1.COD_CAVALO = ?

        UNION 

        SELECT 'DOCUMENTO RPA' as EVENTO, 
          CAST(T1.RPA_NUM AS VARCHAR(2048)) AS CONTEUDO,
          (CORI.CID_NOM || ' - ' || EORI.UF_SIGLA) AS ORIGEM,
          (CDES.CID_NOM || ' - ' || EDES.UF_SIGLA) AS DESTINO,
          RPA_DT_EMISSAO AS DATA_INICIO,
          NULL as DATA_FINAL,
          T1.POS AS RANK
          FROM (SELECT ROW_NUMBER() OVER (PARTITION BY VEI_COD ORDER BY RPA_DT_EMISSAO DESC) as POS, RPA.CID_COD, RPA.CID_CID_COD, RPA.VEI_COD, RPA.RPA_NUM, RPA.RPA_DT_EMISSAO FROM RPA) T1
          JOIN CIDADE CORI ON CORI.CID_COD = T1.CID_COD
          JOIN ESTADO EORI ON CORI.UF_COD = EORI.UF_COD
          JOIN CIDADE CDES ON CDES.CID_COD = T1.CID_CID_COD
          JOIN ESTADO EDES ON CDES.UF_COD = EDES.UF_COD
          WHERE T1.VEI_COD = ?


        UNION

        SELECT 'JUSTIFICATIVA',
          "conteudo",
          NULL as ORIGEM,
          NULL as DESTINO,
          "data_inicio",
          "data_final",
          "id"
          FROM "con_producao_justificativas"
          where "codigo_veiculo" = ?
    `,
      [codigoCavalo, codigoCavalo, codigoCavalo]
    );

    const origemDestino = [
      ...new Set<string>(
        documentos
          .filter((i: any) => i.ORIGEM !== null && i.DESTINO !== null)
          .map((i: Record<string, string>) =>
            `${i.ORIGEM}||${i.DESTINO}`
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toUpperCase()
          )
      ),
    ];
    const rotas = mssql("ROTAS_OPERACAO_NEW").select([
      "DISTANCIA as distancia",
      "ORIGEM",
      "DESTINO",
    ]);

    for (const i of origemDestino) {
      const [origem, destino] = i.split("||");
      const [cidadeOrigem, ufOrigem] = origem.split(" - ");
      const [cidadeDestino, ufDestino] = destino.split(" - ");

      rotas.orWhere(function () {
        this.where("ORIGEM", `${cidadeOrigem}, ${ufOrigem}`);
        this.where("DESTINO", `${cidadeDestino}, ${ufDestino}`);
      });
    }

    const distancias = new Map();
    for (const i of await rotas) {
      const { distancia, ORIGEM, DESTINO } = i;
      distancias.set(`${ORIGEM}||${DESTINO}`, Number(distancia));
    }

    const calcularPrevisaoChegada = (distanciaKm: number) =>
      Math.trunc(distanciaKm / 500) * 86400 +
      (((distanciaKm % 500) * 8) / 500) * 60 * 60;

    for (let i = 0; i < documentos.length; i++) {
      if (documentos[i].EVENTO === "JUSTIFICATIVA") {
        continue;
      }
      const chave = `${documentos[i].ORIGEM}||${documentos[i].DESTINO}`.replace(
        / - /g,
        ", "
      );
      const distancia = distancias.get(chave);
      documentos[i].DATA_FINAL = null;
      if (distancia) {
        const DIA_EM_MS = 60 * 60 * 24 * 1000;
        const previsaoChegadaEmMs =
          new Date(documentos[i].DATA_INICIO).getTime() +
          DIA_EM_MS +
          calcularPrevisaoChegada(Number(distancia)) * 1000;
        const dataPrevisaochegada = new Date();
        dataPrevisaochegada.setTime(previsaoChegadaEmMs);
        documentos[i].DATA_FINAL = dataPrevisaochegada;
      }
    }

    return { CODIGO_VEICULO: codigoCavalo, EVENTOS: documentos };
  }

  async nextId(): Promise<number> {
    return Number(
      (
        await database("DUAL").select(
          "seq_con_prd_justificativas.NEXTVAL as id"
        )
      )[0].id
    );
  }

  async createEvent(event: IEventoJustificativa) {
    await database("con_producao_justificativas").insert(event);
  }

  async getPlaca(codigo_veiculo: number) {
    return (
      await database("VEICULO")
        .where("VEI_COD", codigo_veiculo)
        .first()
        .select("VEI_PLACA")
    ).VEI_PLACA;
  }
}

export default new ServiceProducao();
