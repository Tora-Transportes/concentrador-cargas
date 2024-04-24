import database from "../database";
import IUsersGrupos from "../models/IUsersGrupos";
import { IGrupos } from "../models/IUsersGrupos";
import { mssqlPPO } from "../database";
import TokenAd from "../models/TokenAd";
import AppError from "../models/AppError";
import { forEach } from "lodash";

interface IPPOPermissoesVisualizacaoRepository {
  findByOid(oid: string): Promise<any | undefined>;
  create(body: IUsersGrupos, user: string): Promise<any | undefined>;
  getUsers(): Promise<any | undefined>;
  index(): Promise<any>;
  delete(id: string, uid: string): Promise<any>;
  deleteUser(uid: string): Promise<any>;
  updateUser(
    body: IGrupos,
    uid: string,
    user: string
  ): Promise<any | undefined>;
}

export class PPOPermissoesVisualizacaoRepository
  implements IPPOPermissoesVisualizacaoRepository
{
  async findByOid(oid: string): Promise<any> {
    return await mssqlPPO("dbo.ppo_visualizacao_usuarios")
      .first()
      .where("oid", oid);
  }
  async getUsers() {
    return await database("con_usuarios")
      .select(["oid as value", "nome as label", "email"])
      .distinct();
  }

  async create(body: IUsersGrupos, user: string) {
    const usuario = await this.findByOid(body.users.value);
    if (usuario != undefined) {
      throw new AppError("Esse usuário já existe favor editar", 400);
    }
    const data = {
      oid: body.users.value,
      nome: body.users.label,
      email: body.users.email,
      cod_usu_create: TokenAd.getClaims(user).name,
    };
    mssqlPPO("dbo.ppo_visualizacao_usuarios")
      .insert(data)
      .returning("id")
      .then((ids) => {
        body.grupos.forEach(async (element) => {
          const data = {
            id_ppo_visualizacao_usuario: ids[0],
            id_ppo_grupos: element.value,
            cod_usu_create: TokenAd.getClaims(user).name,
          };
          await mssqlPPO("dbo.ppo_visualizacao_usuarios_grupos").insert(data);
        });
      })
      .catch((error) => {
        console.error(error);
        throw new AppError(error, 400);
      });
    return { msg: "Inserido com sucesso" };
  }

  async index(): Promise<any> {
    return await mssqlPPO("dbo.ppo_visualizacao_usuarios")
      .select(
        "ppo_visualizacao_usuarios.id AS usuario_id",
        "ppo_visualizacao_usuarios.oid AS usuario_oid",
        "ppo_visualizacao_usuarios.nome AS usuario_nome",
        "ppo_visualizacao_usuarios.email AS usuario_email",
        "ppo_visualizacao_usuarios.created_at AS usuario_created_at",
        "ppo_visualizacao_usuarios.cod_usu_create AS usuario_cod_usu_create",
        "ppo_visualizacao_usuarios_grupos.id AS grupo_id",
        "ppo_visualizacao_usuarios_grupos.id_ppo_grupos AS grupo_ppo_grupos",
        "ppo_visualizacao_usuarios_grupos.created_at AS  grupo_created_at",
        "ppo_visualizacao_usuarios_grupos.cod_usu_create AS  grupo_cod_usu_create",
        "ppo_grupos.filial as filial"
      )
      .from("ppo_visualizacao_usuarios")
      .leftJoin(
        "ppo_visualizacao_usuarios_grupos",
        "ppo_visualizacao_usuarios.id",
        "ppo_visualizacao_usuarios_grupos.id_ppo_visualizacao_usuario"
      )
      .leftJoin(
        "ppo_grupos",
        "ppo_grupos.id",
        "ppo_visualizacao_usuarios_grupos.id_ppo_grupos"
      )
      .then((rows) => {
        // Organize os dados em um formato de array de usuários com seus grupos
        const usuariosComGrupos = rows.reduce((acc, row) => {
          const usuarioExistente = acc.find(
            (user: any) => user.id === row.usuario_id
          );
          if (usuarioExistente) {
            usuarioExistente.grupos.push({
              id: row.grupo_id,
              id_ppo_grupos: row.grupo_ppo_grupos,
              nome: row.filial,
              created_at: row.grupo_created_at,
              cod_usu_create: row.grupo_cod_usu_create,
            });
          } else {
            acc.push({
              id: row.usuario_id,
              oid: row.usuario_oid,
              nome: row.usuario_nome,
              email: row.usuario_email,
              created_at: row.usuario_created_at,
              cod_usu_create: row.usuario_cod_usu_create,
              grupos: row.grupo_id
                ? [
                    {
                      id: row.grupo_id,
                      id_ppo_grupos: row.grupo_ppo_grupos,
                      nome: row.filial,
                      created_at: row.grupo_created_at,
                      cod_usu_create: row.grupo_cod_usu_create,
                    },
                  ]
                : [],
            });
          }
          return acc;
        }, []);

        return usuariosComGrupos;
      })
      .catch((error) => {
        console.error(error);
        throw new AppError(error, 400);
      });
  }

  async delete(id: string, uid: string): Promise<any> {
    const permissions = await mssqlPPO("ppo_visualizacao_usuarios_grupos")
      .count("* as permissoes")
      .where("id_ppo_visualizacao_usuario", uid);
    if (permissions[0].permissoes == 1) {
      await mssqlPPO("ppo_visualizacao_usuarios_grupos").delete().where({ id });
      await mssqlPPO("ppo_visualizacao_usuarios").delete().where({ id: uid });
    } else {
      return await mssqlPPO("ppo_visualizacao_usuarios_grupos")
        .delete()
        .where({ id });
    }
  }

  async deleteUser(uid: string): Promise<any> {
    try {
      await mssqlPPO("ppo_visualizacao_usuarios").delete().where({ id: uid });
      await mssqlPPO("ppo_visualizacao_usuarios_grupos")
        .delete()
        .where({ id_ppo_visualizacao_usuario: uid });
      return { message: "deletado com sucesso" };
    } catch (error) {
      throw new AppError(
        "Não foi possivel deletar usuários e suas permissões",
        400
      );
    }
  }

  async updateUser(body: IGrupos, uid: string, user: string): Promise<any> {
    const cod_usuario = TokenAd.getClaims(user).name;
    const data: any = [];
    body.grupos.forEach((grupo) => {
      data.push({
        id_ppo_visualizacao_usuario: uid,
        id_ppo_grupos: grupo.value,
        cod_usu_create: cod_usuario,
      });
    });
    return await mssqlPPO("dbo.ppo_visualizacao_usuarios_grupos")
      .insert(data)
      .then((ret) => {
        return ret;
      })
      .catch(() => {
        throw new AppError("Não foi possivel atualizar suas permissões", 400);
      });
  }
}
