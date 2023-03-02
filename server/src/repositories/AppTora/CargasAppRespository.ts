import database from "../../database";
import { ICarga } from "../../models/ICargas";
import { ICargaAppRepository, IStatusApp } from "./IntefaceRepositoryApp";

class CargaAppRepository implements ICargaAppRepository {
  async indexId(id: number): Promise<ICarga> {
    return await database("con_cargas").select().first().where("id", id);
  }
  async indexIdAndPlate(id: number, placa: string): Promise<ICarga> {
    return await database("con_cargas")
      .select()
      .first()
      .where("id", id)
      .andWhere("placa_veiculo", placa);
  }

  async updateFk_situacao(id: number, body: IStatusApp): Promise<number> {
    return await database("con_cargas").update(body).where("id", id);
  }
}

export default new CargaAppRepository();
