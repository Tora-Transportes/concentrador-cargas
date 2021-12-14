import database from "../database";

export interface IRotaPendente extends Record<string, any> {
  id?: number;
  cidade_origem: string;
  estado_origem: string;
  estado_destino: string;
  cidade_destino: string;
}

export class RotasPendentesRepository {
  async getNextId(): Promise<number> {
    return Number(
      (
        await database("DUAL").select("seq_con_rotas_pendentes.NEXTVAL as id")
      )[0].id
    );
  }

  async create(rotaPendente: IRotaPendente) {
    return database("con_rotas_pendentes").insert(rotaPendente);
  }

  async findByNames(filter: IRotaPendente) {
    const query = database("con_rotas_pendentes").select("*").first();
    for (const i in filter) {
      if (filter[i] !== undefined && filter[i] !== null) {
        query.where(i, filter[i]);
      }
    }
    return query;
  }

  async search(filter: Record<string, any>, page = 1, pageSize = 50) {
    const total = database("con_rotas_pendentes").first().count("id as total");
    const query = database("con_rotas_pendentes").select("*");

    const { order_column, order_direction } = filter;
    if (order_column !== undefined && order_direction !== undefined) {
      query.orderBy(order_column, order_direction);
    }

    for (const i in filter) {
      if (filter[i] !== undefined && filter[i] !== null) {
        if (i.startsWith("order_")) {
          continue;
        }
        query.where(i, "like", filter[i]);
        total.where(i, "like", filter[i]);
      }
    }

    query.limit(pageSize).offset((page - 1) * pageSize);
    query.orderBy("id", "asc");
    return {
      total_pages: Math.ceil(Number((await total).total) / pageSize),
      page,
      results: await query,
    };
  }

  async delete(id: number): Promise<void> {
    await database("con_rotas_pendentes").delete().where("id", id);
  }
}
