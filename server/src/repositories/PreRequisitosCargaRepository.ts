import database from "../database";
import {
  IPreRequisitosCarga,
  IPreRequisitosCargaRepository,
} from "../domain/UseCaseCarga/entities";
export class PreRequisitosCargaRepository
  implements IPreRequisitosCargaRepository
{
  async nextId(): Promise<number> {
    const id = await database.raw(
      `SELECT usu_tora.SEQ_REQ_CARGAS.NEXTVAL as id FROM DUAL`
    );
    return Number(id[0].ID);
  }

  async clear(codigoCarga: number): Promise<void> {
    if (!codigoCarga) {
      return;
    }
    await database("con_pre_requisito_carga")
      .delete()
      .where("carga_id", codigoCarga);
  }
  async insert(data: IPreRequisitosCarga[]): Promise<void> {
    await database("con_pre_requisito_carga").insert(data);
  }
}
