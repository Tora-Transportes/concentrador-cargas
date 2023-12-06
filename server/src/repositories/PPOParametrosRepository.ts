import { mssqlPPO } from "../database";
import IParametro from "../models/IParametro";
import AppError from "../models/AppError";
import TokenAd from "../models/TokenAd";
import { dateAtualMoment } from "../Utils/formatData";

interface IPPOParametrosRepository {
  findByName(nome: string): Promise<IParametro | undefined>;
  create(parametro: IParametro, user: string): Promise<any>;
  update(id: number, parametro: IParametro, user: string): Promise<any>;
  index(id: string): Promise<IParametro | undefined>;
  search(filter: Record<string, any>): Promise<any[]>;
  delete(id: number): Promise<void>;
}

export class PPOParametrosRepository implements IPPOParametrosRepository {
  async index(id: string): Promise<IParametro | undefined> {
    return await mssqlPPO("dbo.ppo_parametros").first().where("id", id);
  }

  async create(produto: IParametro, user: string) {
    const parametro = await this.findByName(produto.nome);
    produto.cod_usu_create = TokenAd.getClaims(user).name;
    if (parametro != undefined) {
      throw new AppError("Esse nome já se encontra em uso", 400);
    } else {
      return mssqlPPO("dbo.ppo_parametros").insert(produto);
    }
  }

  async update(id: number, produto: IParametro, user: string) {
    const parametro = await this.findByName(produto.nome);
    produto.cod_usu_update = TokenAd.getClaims(user).name;
    produto.updated_at = new Date(dateAtualMoment());
    if (parametro != undefined && parametro.id != id) {
      throw new AppError("Esse nome já se encontra em uso", 400);
    } else {
      return mssqlPPO("dbo.ppo_parametros").update(produto).where("id", id);
    }
  }

  async delete(id: number): Promise<void> {
    await mssqlPPO("dbo.ppo_parametros").delete().where({ id });
  }

  async findByName(nome: string): Promise<IParametro | undefined> {
    return mssqlPPO("dbo.ppo_parametros")
      .select("*")
      .where("nome", nome)
      .first();
  }

  async search(filter: Record<string, any>) {
    const query = mssqlPPO("dbo.ppo_parametros")
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
