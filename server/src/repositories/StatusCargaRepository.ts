import database from "../database";
import IStatusCarga from "../models/IStatusCarga";

export class StatusCargaRepository {
  async search(filter: Record<string, any>): Promise<IStatusCarga[]> {
    const query = database("con_situacoes_cargas")
      .select("*")
      .orderBy("id", "asc");
    for (const i in filter) {
      if (filter[i] !== undefined && filter[i] !== null) {
        query.where(i, filter[i]);
      }
    }
    return query;
  }
}
