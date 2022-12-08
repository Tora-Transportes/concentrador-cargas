import database from "../../database";
import { ICarga } from "../../models/ICargas";
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

export class CargaCsnInfoRepository {
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
        "con_situacoes_cargas_csn.descricao as situacao.descricao",
        "con_situacoes_cargas_csn.cor as situacao.cor",
        "FILIAL.FIL_DSC as filial.descricao",
        "CADASTRO_GERAL.CG_NOME as nome_motorista",
      ])
      .join(
        "con_situacoes_cargas_csn",
        "con_situacoes_cargas_csn.id",
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
      if (query?.carga_csn == 1) {
        qb.andWhere("carga_csn", query.carga_csn);
      } else if (query.carga_csn && query.carga_csn != 1) {
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
      if (isValid(String(query?.placa_carreta))) {
        qb.andWhere("placa_carreta", "like", `%${query.placa_carreta}%`);
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
    //console.log(results.toSQL().toNative());

    const rows: ICarga[] = await results;

    rows.map(async (obj) => {
      const data = await database("con_pontos_parada")
        .select([
          "con_pontos_parada.*",
          "con_rotas_csn.DESCRICAO",
          "con_rotas_csn.LATITUDE AS LATITUDE_ROTA",
          "con_rotas_csn.LONGITUDE AS LONGITUDE_ROTA",
        ])
        .where("con_pontos_parada.ID_CON_CARGAS", obj.id)
        .leftJoin(
          "con_rotas_csn",
          "con_rotas_csn.ID",
          "con_pontos_parada.ID_ROTAS_CSN"
        );
      obj.ponto_parada = data;
      return obj;
    });

    const totalRegisters = Number((await total)?.total) || 0;

    return {
      page: realPage,
      total_pages: Math.ceil(totalRegisters / pageSize),
      total_registers: totalRegisters,
      results: rows,
    };
  }

  async index(id: number): Promise<ICarga | undefined> {
    const carga: ICarga[] = await database("con_cargas")
      .select([
        "con_cargas.*",
        "con_situacoes_cargas.descricao as situacao.descricao",
        "con_situacoes_cargas.cor as situacao.cor",
        "FILIAL.FIL_DSC as filial.descricao",
        "CADASTRO_GERAL.CG_NOME as nome_motorista",
      ])
      //.first()
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

    for (const item of carga) {
      const data = await database("con_pontos_parada")
        .select([
          "con_pontos_parada.*",
          "con_rotas_csn.DESCRICAO",
          "con_rotas_csn.LATITUDE AS LATITUDE_ROTA",
          "con_rotas_csn.LONGITUDE AS LONGITUDE_ROTA",
        ])
        .where("con_pontos_parada.ID_CON_CARGAS", item.id)
        .leftJoin(
          "con_rotas_csn",
          "con_rotas_csn.ID",
          "con_pontos_parada.ID_ROTAS_CSN"
        )
        .orderBy("con_pontos_parada.ID", "asc");

      item.ponto_parada = data;
    }

    return { ...carga[0], locais };
  }

  async indexOfSituacaoEndPlaca(
    placa: string
  ): Promise<IResultExcel<ICarga> | undefined> {
    const carga: ICarga[] = await database("con_cargas")
      .select("*")
      .where("con_cargas.placa_veiculo", placa)
      .andWhere("con_cargas.carga_csn", 1)
      .andWhere("con_cargas.e_lote", 0)
      .andWhere("con_cargas.ativo", 1)
      .whereIn("con_cargas.fk_situacao", [2, 3]);

    if (!carga) return;
    return { results: carga };
  }
}
