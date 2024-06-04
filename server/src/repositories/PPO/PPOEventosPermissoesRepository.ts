import database from "../../database";
import { mssqlPPO } from "../../database";
import AppError from "../../models/AppError";
import TokenAd from "../../models/TokenAd";
import IUserAprovacao from "../../models/IUserAprovacao";
import IPermissao from "../../models/IUserAprovacao";
import { dateAtualMoment } from "../../Utils/formatData";

interface IPPOEventosPermissoesRepository {
  findByOid(oid: string): Promise<any | undefined>;
  index(): Promise<Promise<any> | undefined>;
  getUsers(): Promise<any | undefined>;
  create(body: IUserAprovacao, user: string): Promise<any | undefined>;
  deleteUser(oid: string): Promise<any>;
}

export class PPOEventosPermissoesRepository
  implements IPPOEventosPermissoesRepository
{
  async findByOid(oid: string): Promise<any> {
    return await mssqlPPO("dbo.ppo_sascar_eventos_usuarios_permissoes")
      .first()
      .where("oid", oid);
  }

  async index(): Promise<Promise<any> | undefined> {
    return await mssqlPPO("dbo.ppo_sascar_eventos_usuarios_permissoes");
  }

  async getUsers() {
    return await database("con_usuarios")
      .select(["oid as value", "nome as label", "email"])
      .distinct();
  }

  async create(body: IUserAprovacao, user: string) {
    const usuario = await this.findByOid(body.users.value);
    if (usuario != undefined) {
      throw new AppError("Esse usuário já existe favor editar", 400);
    }
    const data = {
      oid: body.users.value,
      nome: body.users.label,
      email: body.users.email,
      permissao: body.permissao.value,
      cod_usu_create: TokenAd.getClaims(user).name,
    };
    mssqlPPO("dbo.ppo_sascar_eventos_usuarios_permissoes")
      .insert(data)
      .catch((error) => {
        console.error(error);
        throw new AppError(error, 400);
      });
    return { msg: "Inserido com sucesso" };
  }

  async deleteUser(oid: string): Promise<any> {
    try {
      await mssqlPPO("dbo.ppo_sascar_eventos_usuarios_permissoes")
        .delete()
        .where({ oid: oid });
      return { message: "Deletado com sucesso" };
    } catch (error) {
      throw new AppError("Não foi possivel deletar usuários", 400);
    }
  }

  async updateUser(body: IPermissao, oid: string, user: string): Promise<any> {
    const cod_usuario = TokenAd.getClaims(user).name;
    const data = {
      permissao: body.permissao.value,
      cod_usu_update: cod_usuario,
      updated_at: new Date(dateAtualMoment()),
    };

    try {
      await mssqlPPO("dbo.ppo_sascar_eventos_usuarios_permissoes")
        .update(data)
        .where({ oid: oid });
      return { message: "Atualizado com sucesso" };
    } catch (error) {
      throw new AppError("Não foi possivel atualizar o usuário", 400);
    }
  }
}
