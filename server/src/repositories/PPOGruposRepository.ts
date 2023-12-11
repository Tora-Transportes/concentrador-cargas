import { mssqlPPO } from "../database";
import IGrupo from "../models/IGrupo";
import AppError from "../models/AppError";
import TokenAd from "../models/TokenAd";
import { dateAtualMoment } from "../Utils/formatData";
import { compareValues } from "../Utils/utlis";

interface IPPOGruposRepository {
  findByName(nome: string): Promise<IGrupo | undefined>;
  create(grupo: IGrupo, user: string): Promise<any>;
  update(id: number, grupo: IGrupo, user: string): Promise<any>;
  index(id: string): Promise<IGrupo | undefined>;
  search(filter: Record<string, any>): Promise<any[]>;
  delete(id: number): Promise<void>;
}

export class PPOGruposRepository implements IPPOGruposRepository {
  async index(id: string): Promise<IGrupo | undefined> {
    return await mssqlPPO("dbo.ppo_grupos").first().where("id", id);
  }

  async create(grupo: IGrupo, user: string) {
    const gp = await this.findByName(grupo.nome);
    grupo.cod_usu_create = TokenAd.getClaims(user).name;
    if (gp != undefined) {
      throw new AppError("Esse nome já se encontra em uso", 400);
    } else {
      return mssqlPPO("dbo.ppo_grupos").insert(grupo);
    }
  }

  async update(id: number, grupo: IGrupo, user: string) {
    const gp = await this.findByName(grupo.nome);
    grupo.cod_usu_update = TokenAd.getClaims(user).name;
    grupo.updated_at = new Date(dateAtualMoment());
    if (gp != undefined && gp.id != id) {
      throw new AppError("Esse nome já se encontra em uso", 400);
    } else {
      return mssqlPPO("dbo.ppo_grupos").update(grupo).where("id", id);
    }
  }

  async delete(id: number): Promise<void> {
    const params = await mssqlPPO("dbo.ppo_parametros_grupo")
      .count("* as qtd_parms")
      .where("grupo_id", id);
    if (compareValues(params[0].qtd_parms, 0)) {
      throw new AppError(
        "Não foi possivel deletar esse grupo pois possuem parâmetros atrelados a ele",
        400
      );
    } else {
      await mssqlPPO("dbo.ppo_grupos").delete().where({ id });
    }
  }

  async findByName(nome: string): Promise<IGrupo | undefined> {
    return mssqlPPO("dbo.ppo_grupos").select("*").where("nome", nome).first();
  }

  async search(filter: Record<string, any>) {
    const query = mssqlPPO("dbo.ppo_grupos").select("*").orderBy("nome", "asc");
    for (const i in filter) {
      if (filter[i] !== undefined && filter[i] !== null) {
        query.where(i, filter[i]);
      }
    }
    return query;
  }
}
