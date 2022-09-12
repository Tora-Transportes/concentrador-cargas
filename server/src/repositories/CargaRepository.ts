import database from "../database";
import { ICarga, ICargaCTE } from "../models/ICargas";
import { Knex } from "knex";
export interface IPaginationResult<T> {
  page: number;
  total_pages: number;
  total_registers: number;
  results: T[];
}
export class CargaRepository {
  async nextId(): Promise<number> {
    return Number(
      (await database("DUAL").select("seq_con_cargas.NEXTVAL as id"))[0].id
    );
  }

  async index(id: number): Promise<ICarga | undefined> {
    const carga = await database("con_cargas")
      .select([
        "con_cargas.*",
        database.raw(
          `SELECT 
          replace(x.cliente,'	','') as CLIENTE
      FROM (
      SELECT
          rtrim(ltrim(replace("cliente", '	 ',''))) AS CLIENTE
      FROM "con_cargas"
      
      )x -- sub query
      ORDER BY 1 ASC;
      `
        ),
        "con_situacoes_cargas.descricao as situacao.descricao",
        "con_situacoes_cargas.cor as situacao.cor",
        "FILIAL.FIL_DSC as filial.descricao",
        "CADASTRO_GERAL.CG_NOME as nome_motorista",
      ])
      .first()
      .where("con_cargas.id", id)
      .join(
        "con_situacoes_cargas",
        "con_situacoes_cargas.id",
        "con_cargas.fk_situacao"
      )
      .leftJoin(
        "CADASTRO_GERAL",
        "CADASTRO_GERAL.CG_COD",
        "con_cargas.codigo_motorista"
      )
      .leftJoin("FILIAL", "FILIAL.FIL_COD", "con_cargas.fk_filial");
    database.raw(
      `CASE WHEN "con_cargas"."e_lote" = 0 THEN 'Não' WHEN "con_cargas"."e_lote" = 1 THEN 'Sim' END AS "E lote"`
    );
    console.log(">>>>>teste", carga.toSQL().toNative());
    if (!carga) return;
    const locais = (
      await database("con_locais_carga")
        .where("fk_carga", id)
        .select(["descricao"])
    ).map((i) => i.descricao);
    return { ...carga, locais };
  }

  async searchCET(id: string): Promise<ICargaCTE> {
    const result = await database("CARGA")
      .select(["CARGA.NUM_CAR"])
      .join("VEICULO", "VEICULO.VEI_COD", "CARGA.COD_VEI")
      .first()
      .where("CARGA.CAR_TP_DOC", 5)
      .where("VEICULO.VEI_PLACA", id)
      .orderBy("CARGA.CAR_DT", "DESC");

    let dadosCET;
    if (result != undefined) {
      dadosCET = await database.raw(
        `SELECT CAST(REC.REC_NUM AS VARCHAR(40)) AS DOC_ID,
            REC.REC_HR_EMISSAO AS DT_HORA_EMISSAO,
            NULL AS DT_CANCELAMENTO,
            'CTE' AS TIPO_DOC,
            REC.REC_PES_REAL AS DT_PESO_REAL,
            REC.REC_DT_ENTREGA AS DT_ENTREGA
            FROM ITEM_CARGA  ITC
            INNER JOIN RECEITA REC ON REC.TDM_COD = ITC.TDM_COD
            AND ITC.FIL_COD = REC.FIL_COD
            AND REC.REC_NUM = ITC.REC_NUM
            WHERE ITC.NUM_CAR = (${result?.NUM_CAR})
            AND REC.TDM_COD in (24)
            ORDER BY REC.REC_HR_EMISSAO DESC`
      );
    }
    return {
      results: dadosCET,
    };
  }

  async create(carga: ICarga): Promise<ICarga> {
    await database("con_cargas").insert(carga);
    return carga;
  }

  async bulkCreate(cargas: ICarga[]): Promise<ICarga[]> {
    await database("con_cargas").insert(cargas);
    return cargas;
  }

  async update(id: number, carga: ICarga): Promise<ICarga> {
    await database("con_cargas").update(carga).where("id", id);
    return carga;
  }

  async search(
    query: Record<string, any>,
    page = 1,
    pageSize = 5
  ): Promise<IPaginationResult<ICarga>> {
    const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

    const total = database("con_cargas").count("id as total").first();
    const results = database("con_cargas")
      .select([
        "con_cargas.*",
        "con_situacoes_cargas.descricao as situacao.descricao",
        "con_situacoes_cargas.cor as situacao.cor",
        "FILIAL.FIL_DSC as filial.descricao",
        "CADASTRO_GERAL.CG_NOME as nome_motorista",
      ])
      .join(
        "con_situacoes_cargas",
        "con_situacoes_cargas.id",
        "con_cargas.fk_situacao"
      )
      .leftJoin("FILIAL", "FILIAL.FIL_COD", "con_cargas.fk_filial")
      .leftJoin(
        "CADASTRO_GERAL",
        "CADASTRO_GERAL.CG_COD",
        "con_cargas.codigo_motorista"
      )
      .limit(pageSize)
      .offset((realPage - 1) * pageSize)
      .modify(function (con_cargas) {
        if (query.date_execel_inicio && query.date_execel_fim) {
          con_cargas.andWhereBetween("con_cargas.data_cadastro", [
            new Date(query.date_execel_inicio + "T00:00:00"),
            new Date(query.date_execel_fim + "T00:00:00"),
          ]);
        }
      });

    const isValid = (value: string | null | undefined) =>
      !["", null, undefined, "null", "undefined"].includes(value);

    const filterDbFunction = (qb: Knex.QueryBuilder) => {
      if (query?.data_cadastro) {
        const date = query.data_cadastro.split("T")[0];
        qb.andWhereBetween("data_cadastro", [
          new Date(date + "T00:00:00"),
          new Date(date + "T23:59:59"),
        ]);
      }
      if (query?.fk_filial) {
        qb.andWhere("fk_filial", query.fk_filial);
      }
      if (query?.destino_carga) {
        qb.andWhere(
          "destino_carga",
          "like",
          `%${query.destino_carga.toUpperCase()}%`
        );
      }
      if (query?.origem_carga) {
        qb.andWhere(
          "origem_carga",
          "like",
          `%${query.origem_carga.toUpperCase()}%`
        );
      }
      if (query?.fk_situacao && !isNaN(Number(query.fk_situacao))) {
        qb.andWhere("fk_situacao", Number(query.fk_situacao));
      }
      if (query?.data_coleta) {
        qb.andWhere("data_coleta", "=", new Date(query.data_coleta));
      }
      if (query?.data_entrega) {
        qb.andWhere("data_entrega", "=", new Date(query.data_entrega));
      }

      if (isValid(query?.cliente)) {
        qb.andWhere("cliente", "like", `%${query.cliente}%`);
      }
      if (isValid(query?.id)) {
        qb.andWhere("con_cargas.id", "like", `%${query.id}%`);
      }
      if (isValid(String(query?.e_lote))) {
        qb.andWhere("e_lote", "=", `${query.e_lote}`);
      }
      if (isValid(String(query?.tipo_carga))) {
        qb.andWhere("tipo_carga", "like", `%${query.tipo_carga}%`);
      }
      if (isValid(String(query?.documento_transporte))) {
        qb.andWhere(
          "documento_transporte",
          "=",
          `${query.documento_transporte}`
        );
      }
      if (isValid(String(query?.placa_veiculo))) {
        qb.andWhere("placa_veiculo", "like", `%${query.placa_veiculo}%`);
      }
      if (!isNaN(Number(query?.ativo))) {
        qb.andWhere("ativo", "=", Number(query?.ativo));
      }
      if (!isNaN(Number(query?.fk_situacao))) {
        qb.andWhere("fk_situacao", "=", Number(query?.fk_situacao));
      }
      if (isValid(String(query?.responsavel_cadastro))) {
        qb.andWhere(
          "responsavel_cadastro",
          "like",
          `%${query.responsavel_cadastro}%`
        );
      }
    };

    total.andWhere(filterDbFunction);
    results.andWhere(filterDbFunction);

    if (isValid(query?.order_column)) {
      results.orderBy(
        "con_cargas." + String(query.order_column),
        String(query?.order_direction)
      );
    }

    results.orderBy("con_cargas.id", "asc");
    const rows = await results;

    const totalRegisters = Number((await total)?.total) || 0;
    return {
      page: realPage,
      total_pages: Math.ceil(totalRegisters / pageSize),
      total_registers: totalRegisters,
      results: rows,
    };
  }
}
