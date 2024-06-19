import database from "../database";
import { mssqlPPO } from "../database";
import { Knex } from "knex";
import IUsuario from "../models/IUsuario";
import { ISavePermission } from "../domain/UseCaseUsuario";
export class UsuarioRepository {
  async search(filter: Record<string, any>, more: boolean, page = 1) {
    const results = database("con_usuarios").select("*");

    const funcToFilter = (qb: Knex.QueryBuilder) => {
      if (filter.query) {
        qb.orWhere("nome", "like", `%${filter.query}%`);
        qb.orWhere("email", "like", `%${filter.query}%`);
      }
      for (const i in filter) {
        if (i === "query") continue;
        qb.andWhere(i, filter[i]);
      }
    };
    results.where(funcToFilter);

    const usersAndPermissions = await database
      .from(results.as("usuarios"))
      .leftJoin(
        "con_usuarios_permissoes",
        "usuarios.oid",
        "con_usuarios_permissoes.fk_usuario"
      )
      .select("*")
      .orderBy("nome");

    const outputUsers: Record<string, any> = [];
    const formattedUsersAndPermissions: Record<string, number> = {};

    for (const i of usersAndPermissions) {
      const { oid, nome, email, permissao } = i;
      if (formattedUsersAndPermissions[oid] === undefined) {
        if (!more) {
          const permissoes_visualizacao = await mssqlPPO.raw(`
        SELECT G.id,G.nome,G.filial FROM ppo_visualizacao_usuarios_grupos VUG
          INNER JOIN ppo_visualizacao_usuarios VU ON VU.id = VUG.id_ppo_visualizacao_usuario
          INNER JOIN ppo_grupos G ON G.id = VUG.id_ppo_grupos
        WHERE VU.oid = '${oid}'
        `);
          const permissao_aprovacao_ppo_eventos =
            await mssqlPPO.raw(`SELECT oid,nome,email,permissao 
        FROM [dbo].[ppo_sascar_eventos_usuarios_permissoes]
        WHERE oid = '${oid}'`);
          outputUsers.push({
            oid,
            nome,
            email,
            permissoes: [],
            permissoes_visualizacao: permissoes_visualizacao,
            permissao_aprovacao_ppo_eventos: permissao_aprovacao_ppo_eventos,
          });
        } else {
          outputUsers.push({
            oid,
            nome,
            email,
            permissoes: [],
          });
        }
        formattedUsersAndPermissions[oid] = outputUsers.length - 1;
      }
      if (permissao) {
        outputUsers[formattedUsersAndPermissions[oid]].permissoes.push(
          String(permissao)
        );
      }
    }

    return {
      page,
      results: outputUsers,
    };
  }

  async searchName(filter: any) {
    const result = database("con_cargas")
      .select([
        "con_cargas.usuario as nome",
        "con_usuarios.oid as oid",
        "con_usuarios.email as email",
      ])
      .leftJoin("con_usuarios", "con_usuarios.nome", "con_cargas.usuario")
      .distinct();
    const funcToFilter = (qb: Knex.QueryBuilder) => {
      if (filter.query === "csn") {
        qb.orWhere("carga_csn", 1);
      }
    };
    result.where(funcToFilter);
    const rows = await result;
    return { results: rows };
  }

  async update(oid: string, usuario: IUsuario) {
    const { nome, email, permissoes } = usuario;
    await database("con_usuarios")
      .update({
        oid: usuario.oid,
        nome,
        email,
      })
      .where("oid", oid);

    await database("con_usuarios_permissoes").delete().where("fk_usuario", oid);
    if (permissoes.length > 0) {
      await database("con_usuarios_permissoes").insert(
        permissoes.map((i) => ({
          fk_usuario: oid,
          permissao: i,
        }))
      );
    }
    return { oid, nome, email, permissoes };
  }

  async index(oid: string) {
    const userData = await database("con_usuarios")
      .where("oid", oid)
      .select("*")
      .leftJoin(
        "con_usuarios_permissoes",
        "con_usuarios_permissoes.fk_usuario",
        "con_usuarios.oid"
      );
    if (userData.length === 0) {
      return undefined;
    }

    const usuario: IUsuario = {
      oid: userData[0].oid,
      nome: userData[0].nome,
      email: userData[0].email,
      permissoes: [],
    };
    for (const i of userData) {
      if (i.permissao) {
        usuario.permissoes.push(String(i.permissao));
      }
    }

    return usuario;
  }

  async getAllFkUsuario() {
    return await database("con_usuarios").select(["oid"]).distinct();
  }

  async deleteAllPermissions(permissoes: string[]) {
    return await database("con_usuarios_permissoes")
      .delete()
      .whereIn("permissao", permissoes);
  }
  async insertAllPermissions(permissoes: ISavePermission[]) {
    return await database("con_usuarios_permissoes").insert(permissoes);
  }
}
