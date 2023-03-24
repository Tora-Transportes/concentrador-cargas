import { Knex } from "knex";
import database from "../database";
import IModelAvisos from "../models/Avisos";
interface IAvisosRepository {
  create(dataAviso: IModelAvisos): Promise<void>;
  index(id: number): Promise<IModelAvisos>;
  search(query: any, page: number, pageSize: number): Promise<IModelAvisos[]>;
  update(id: number, dataUpdate: IModelAvisos): Promise<void>;
  delete(id: number): Promise<void>;
}

export class AvisosRepository implements IAvisosRepository {
  async create(dataAviso: IModelAvisos): Promise<void> {
    await database("con_avisos").insert(dataAviso);
  }

  async index(ID: number): Promise<IModelAvisos> {
    return await database("con_avisos").select("*").first().where({ ID });
  }

  async search(
    query: any,
    page = 1,
    pageSize: number
  ): Promise<IModelAvisos[]> {
    const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);
    const results = database("con_avisos")
      .select("*")
      .orderBy("ID", "desc")
      .limit(pageSize)
      .offset((realPage - 1) * pageSize);

    const filterDbFunction = (qb: Knex.QueryBuilder) => {
      const data = query?.data;
      if (data) {
        qb.andWhereBetween("DATA_CADASTRO", [
          new Date(data + "T00:00:00"),
          new Date(data + "T23:59:59"),
        ]);
      }
    };
    results.andWhere(filterDbFunction);
    return results;
  }

  async update(ID: number, dataUpdate: IModelAvisos): Promise<void> {
    await database("con_avisos").update(dataUpdate).where({ ID });
  }

  async pathUpdate(ID: number, dataUpdate: IModelAvisos): Promise<void> {
    await database("con_avisos").update(dataUpdate).where({ ID });
  }

  async delete(ID: number): Promise<void> {
    await database("con_avisos").delete().where({ ID });
  }
}
