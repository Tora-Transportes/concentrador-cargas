import { mssqlPPO } from "../../database";
import IParametroGrupo from "../../models/IParametroGrupo";
//import AppError from "../models/AppError";
import TokenAd from "../../models/TokenAd";
import { dateAtualMoment } from "../../Utils/formatData";

interface IPPOParametrosGrupoRepository {
  findByName(nome: string): Promise<IParametroGrupo | undefined>;
  create(parametro: IParametroGrupo, user: string): Promise<any>;
  update(id: number, parametro: IParametroGrupo, user: string): Promise<any>;
  index(id: string): Promise<IParametroGrupo | undefined>;
  search(filter: Record<string, any>): Promise<any[]>;
  delete(id: number): Promise<void>;
}

export class PPOParametrosGPRepository
  implements IPPOParametrosGrupoRepository
{
  async index(id: string): Promise<IParametroGrupo | undefined> {
    return await mssqlPPO("dbo.ppo_parametros_grupo").first().where("id", id);
  }

  async create(parametro_grupo: IParametroGrupo, user: string) {
    parametro_grupo.cod_usu_create = TokenAd.getClaims(user).name;
    return mssqlPPO("dbo.ppo_parametros_grupo").insert(parametro_grupo);
  }

  async update(id: number, parametro_grupo: IParametroGrupo, user: string) {
    parametro_grupo.cod_usu_update = TokenAd.getClaims(user).name;
    parametro_grupo.updated_at = new Date(dateAtualMoment());
    return mssqlPPO("dbo.ppo_parametros_grupo")
      .update(parametro_grupo)
      .where("id", id);
  }

  async delete(id: number): Promise<void> {
    await mssqlPPO("dbo.ppo_parametros_grupo").delete().where({ id });
  }

  async findByName(nome: string): Promise<IParametroGrupo | undefined> {
    return mssqlPPO("dbo.ppo_parametros_grupo")
      .select("*")
      .where("nome", nome)
      .first();
  }

  async search(filter: Record<string, any>) {
    const query = mssqlPPO("dbo.ppo_parametros_grupo as pg")
      .select("pg.*", "p.nome as parametro_nome", "g.nome as grupo_nome")
      .innerJoin("dbo.ppo_parametros as p", "p.id", "pg.parametro_id")
      .innerJoin("dbo.ppo_grupos as g", "g.id", "pg.grupo_id")
      .orderBy("pg.id", "asc");
    for (const i in filter) {
      if (filter[i] !== undefined && filter[i] !== null) {
        query.where(i, filter[i]);
      }
    }
    return query;
  }
}
