import database from "../database";
import IPreRequisito from "../models/IPreRequisito";
import TokenAd from "../models/TokenAd";

export class PreRequisitosRepository {
  async getNextId(): Promise<number> {
    return Number(
      (
        await database("DUAL").select(
          "con_pre_requisito_sequence.NEXTVAL as id"
        )
      )[0].id
    );
  }

  async index(id: string): Promise<IPreRequisito | undefined> {
    return await database("con_pre_requisitos").first().where("id", id);
  }

  async create(prerequisito: IPreRequisito, user: string) {
    prerequisito.cod_usu_create = TokenAd.getClaims(user).name;
    return database("con_pre_requisito").insert(prerequisito);
  }

  async update(id: number, prerequisito: IPreRequisito, user: string) {
    prerequisito.cod_usu_update = TokenAd.getClaims(user).name;
    return database("con_pre_requisito").update(prerequisito).where("id", id);
  }

  async findByName(nome: string): Promise<IPreRequisito | undefined> {
    return database("con_pre_requisito")
      .select("*")
      .where("nome", nome)
      .first();
  }

  async search(filter: Record<string, any>) {
    const query = database("con_pre_requisito")
      .select("*")
      .orderBy("nome", "asc");
    for (const i in filter) {
      if (filter[i] !== undefined && filter[i] !== null) {
        query.where(i, filter[i]);
      }
    }
    return query;
  }
}
