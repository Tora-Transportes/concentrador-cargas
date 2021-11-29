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
    return await database("con_cargas").first().where("id", id);
  }

  async create(carga: ICarga): Promise<ICarga> {
    await database("con_cargas").insert(carga);
    return carga;
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
      .select("*")
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
        qb.andWhere("id", "like", `%${query.id}%`);
      }
      if (isValid(String(query?.e_lote))) {
        qb.andWhere("e_lote", "=", `${query.e_lote}`);
      }
      if (isValid(String(query?.tipo_carga))) {
        qb.andWhere("tipo_carga", "like", `%${query.tipo_carga}%`);
      }
      if (!isNaN(Number(query?.ativo))) {
        qb.andWhere("ativo", "=", Number(query?.ativo));
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
        String(query.order_column),
        String(query?.order_direction)
      );
    }

    return {
      page: realPage,
      total_pages: Math.ceil(Number((await total)?.total || 0) / pageSize),
      results: await results,
    };
  }
}

export class AddCargaRepository {
  async save(carga: ICarga) {
    return database("con_cargas").insert(carga);
  }
}

export class UpdateCargaRepository {
  async save(id: string, carga: ICarga) {
    await database("con_cargas").update(carga).where("id", id);
    return carga;
  }
}

export class ViewCargaRepository {
  async run(query: Record<string, any>, page = 1, pageSize = 5) {
    const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

    const total = database("con_cargas").count("id as total").first();

    const results = database("con_cargas")
      .select("*")
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
        qb.andWhere("id", "like", `%${query.id}%`);
      }
      if (isValid(String(query?.e_lote))) {
        qb.andWhere("e_lote", "=", `${query.e_lote}`);
      }
      if (isValid(String(query?.tipo_carga))) {
        qb.andWhere("tipo_carga", "like", `%${query.tipo_carga}%`);
      }
      if (!isNaN(Number(query?.ativo))) {
        qb.andWhere("ativo", "=", Number(query?.ativo));
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
        String(query.order_column),
        String(query?.order_direction)
      );
    }

    return {
      page: realPage,
      total_pages: Math.ceil(Number((await total)?.total || 0) / pageSize),
      results: await results,
    };
  }
}
