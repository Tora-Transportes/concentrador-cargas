import database from "../database";
import { ICarga, ICargaCTE } from "../models/ICargas";
import { Knex } from "knex";
export interface IPaginationResult<T> {
  page: number;
  total_pages: number;
  total_registers: number;
  results: T[];
}
export interface IResultExcel<T> {
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

    if (!carga) return;
    const locais = (
      await database("con_locais_carga")
        .where("fk_carga", id)
        .select(["descricao"])
    ).map((i) => i.descricao);
    return { ...carga, locais };
  }

  async indexPlate(plate: string): Promise<ICarga | undefined> {
    const carga = await database("con_cargas")
      .select([
        "con_cargas.*",
        "con_situacoes_cargas.descricao as situacao.descricao",
        "con_situacoes_cargas.cor as situacao.cor",
        "FILIAL.FIL_DSC as filial.descricao",
        "CADASTRO_GERAL.CG_NOME as nome_motorista",
      ])
      .first()
      .where("con_cargas.placa_veiculo", plate)
      .orderBy("con_cargas.data_cadastro", "DESC")
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

    if (!carga) return;

    return carga;
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

  async updatePatch(id: number, dadosCarga: Partial<ICarga>): Promise<void> {
    await database("con_cargas").update(dadosCarga).where({ id });
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
      if (query.fk_filial) {
        qb.andWhere("fk_filial", query.fk_filial);
      }
      if (query.carga_csn === 0) {
        qb.where((qB) => {
          qB.andWhere("carga_csn", "=", 0);
          qB.orWhereNull("carga_csn");
        });
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
        qb.whereIn("ativo", [1, 2]);
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
    // console.log(results.toSQL().toNative());

    const rows: ICarga[] = await results;

    // função para retirar espaço no inicio dos nomes dos clientes{
    function compare(a: ICarga, b: ICarga) {
      if (a.cliente < b.cliente) return -1;
      if (a.cliente > b.cliente) return 1;
      return 0;
    }

    if (query?.order_direction === "asc") {
      rows.forEach((item) => {
        if (item.cliente) {
          item.cliente = item.cliente.trim();
        }
      });
      rows.sort(compare);
    }
    //}

    const totalRegisters = Number((await total)?.total) || 0;

    return {
      page: realPage,
      total_pages: Math.ceil(totalRegisters / pageSize),
      total_registers: totalRegisters,
      results: rows,
    };
  }

  async searchExcel(
    query: Record<string, any>,
    pageSize = 5
  ): Promise<IResultExcel<ICarga>> {
    const results = database("con_cargas")
      .select([
        "con_cargas.id AS Código da carga",
        "con_cargas.cliente AS Cliente",
        database.raw(
          `CASE WHEN "con_cargas"."e_lote" = 0 THEN 'Não' WHEN "con_cargas"."e_lote" = 1 THEN 'Sim' END AS "E lote"`
        ),
        "con_cargas.origem_carga AS Origem Carga",
        "con_cargas.destino_carga AS Destino Carga",
        database.raw(
          `to_char("con_cargas"."data_coleta", 'dd/mm/yyyy') AS "Data Coleta"`
        ),
        database.raw(
          `to_char("con_cargas"."data_entrega", 'dd/mm/yyyy') AS "Data Entrega"`
        ),
        "con_cargas.tipo_carga AS Tipo Material",
        "con_cargas.quantidade AS Quantidade",
        "con_cargas.quantidade_atual AS Quantidade Atual",
        "con_cargas.fk_lote_pai AS Lote Pai",
        "con_situacoes_cargas.descricao AS Situação",
        "FILIAL.FIL_DSC AS Descrição Filial",
        "con_cargas.fk_filial AS Código Filial",
        "con_cargas.documento_transporte AS Documento de transporte",
        "con_cargas.unidade_medida AS UN",
        "con_cargas.responsavel_cadastro AS Responsável Cadastro",
        "con_cargas.canal_comunicacao AS Canal AS Comunicação",
        "con_cargas.observacao AS Observação",
        "con_situacoes_cargas.descricao AS Status",
        "con_cargas.placa_veiculo AS Placa",
        "con_cargas.observacao_gr AS Observação do GR",
        database.raw(
          `to_char("con_cargas"."data_cadastro", 'dd/mm/yyyy') AS "Data Cadastro"`
        ),
        database.raw(
          `to_char("con_cargas"."data_atualizacao", 'dd/mm/yyyy') AS "Data Atualização"`
        ),
      ])
      .where("fk_filial", query?.fk_filial)
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
      .modify(function (con_cargas) {
        if (query.date_execel_inicio && query.date_execel_fim) {
          con_cargas.andWhereBetween("con_cargas.data_cadastro", [
            new Date(query.date_execel_inicio + "T00:00:00"),
            new Date(query.date_execel_fim + "T23:59:00"),
          ]);
        }
      })
      .modify(function (con_cargas) {
        if (query.e_lote) {
          con_cargas.where("con_cargas.e_lote", query.e_lote);
        }
      });

    results.orderBy("con_cargas.id", "asc");
    const rows = await results;
    return {
      results: rows,
    };
  }
}
