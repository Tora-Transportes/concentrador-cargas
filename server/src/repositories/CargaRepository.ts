import database from "../database";
import { ICarga } from "../models/ICargas";
import { Knex } from "knex";

export interface IPaginationResult<T> {
  page: number;
  total_pages: number;
  results: T[];
}

export class CargaRepository {
  async index(id: string): Promise<ICarga | undefined> {
    return await database("con_cargas")
      .select([
        "con_cargas.*",
        "con_situacoes_cargas.descricao as situacao.descricao",
        "con_situacoes_cargas.cor as situacao.cor",
      ])
      .first()
      .where("con_cargas.id", id)
      .join(
        "con_situacoes_cargas",
        "con_situacoes_cargas.id",
        "con_cargas.fk_situacao"
      );
  }

  async create(carga: ICarga): Promise<ICarga> {
    await database("con_cargas").insert(carga);
    return carga;
  }

  async bulkCreate(cargas: ICarga[]): Promise<ICarga[]> {
    await database("con_cargas").insert(cargas);
    return cargas;
  }

  async update(id: string, carga: ICarga): Promise<ICarga> {
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
      ])
      .join(
        "con_situacoes_cargas",
        "con_situacoes_cargas.id",
        "con_cargas.fk_situacao"
      )
      .limit(pageSize)
      .offset((realPage - 1) * pageSize);

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

    return {
      page: realPage,
      total_pages: Math.ceil(Number((await total)?.total || 0) / pageSize),
      results: rows,
    };
  }
}
