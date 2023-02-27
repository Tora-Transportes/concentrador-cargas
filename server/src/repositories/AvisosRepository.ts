import database from "../database";
import IModelAvisos from "../models/Avisos";

interface IAvisosRepository {
  create(dataAviso: IModelAvisos): Promise<void>;
  index(id: number): Promise<IModelAvisos>;
  search(): Promise<IModelAvisos[]>;
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

  async search(): Promise<IModelAvisos[]> {
    return database("con_avisos").select("*").orderBy("ID", "desc");
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
