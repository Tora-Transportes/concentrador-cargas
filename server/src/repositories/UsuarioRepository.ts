import database from "../database";
import { Knex } from "knex";
import IUsuario from "../models/IUsuario";
export class UsuarioRepository {
  async search(filter: Record<string, any>, page = 1) {
    let results;
    if (filter.query === "csn") {
      results = database("con_usuarios")
        .select(["con_usuarios.*"])
        .distinct()
        .join(
          "con_cargas",
          "con_cargas.responsavel_cadastro",
          "con_usuarios.nome"
        )
        .where("con_cargas.carga_csn", 1);
    } else if (filter.query === "padrao") {
      results = database("con_usuarios")
        .select(["*"])
        .distinct()
        .join(
          "con_cargas",
          "con_cargas.responsavel_cadastro",
          "con_usuarios.nome"
        )
        .where("con_cargas.carga_csn", 0)
        .orWhereNull("con_cargas.carga_csn");
    } else {
      results = database("con_usuarios").select("*");

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
    }

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
        outputUsers.push({
          oid,
          nome,
          email,
          permissoes: [],
        });
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
}
