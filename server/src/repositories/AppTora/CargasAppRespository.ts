import database from "../../database";
import { ICarga } from "../../models/ICargas";
import { ICargaAppRepository, IStatusApp } from "./IntefaceRepositoryApp";

class CargaAppRepository implements ICargaAppRepository {
  async indexId(id: number): Promise<ICarga> {
    return await database("con_cargas").select().first().where("id", id);
  }

  async updateFk_situacao(id: number, situacao: IStatusApp): Promise<number> {
    return await database("con_cargas").update(situacao).where("id", id);
  }
}

export default new CargaAppRepository();
