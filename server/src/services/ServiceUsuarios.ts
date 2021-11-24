import database from "../database";
import AppError from "../models/AppError";
import EPermissions, { isValidPermission } from "../models/EPermissions";

export interface IPermissions {
  targetOid: string;
  adminOid: string;
  permissions: string[];
}

export class ServiceUsuarios {
  async _getUser(oid: string) {
    const user = await database("con_usuarios").where("oid", oid).first();
    if (!user) {
      throw new AppError(
        "Este usuário nunca realizou login na plataforma",
        400
      );
    }
    return user;
  }

  async _getUserPermissions(oid: string) {
    const permissions = (
      await database("con_usuarios_permissoes")
        .where("fk_usuario", oid)
        .select("*")
    ).map((i) => i.permissao);
    return permissions;
  }

  async search(search: string, page: number) {
    const PAGINATION_SIZE = 50;
    const realPage = isNaN(page) || page < 1 ? 1 : page;
    const total = database("con_usuarios").count("oid as total").first();
    const results = database("con_usuarios")
      .select("*")
      .limit(PAGINATION_SIZE)
      .offset((realPage - 1) * PAGINATION_SIZE);

    total.where((qb) => {
      qb.orWhere("nome", "like", `%${search}%`);
      qb.orWhere("email", "like", `%${search}%`);
    });

    results.where((qb) => {
      qb.orWhere("nome", "like", `%${search}%`);
      qb.orWhere("email", "like", `%${search}%`);
    });

    const usersAndPermissions = await database
      .from(results.as("usuarios"))
      .leftJoin(
        "con_usuarios_permissoes",
        "usuarios.oid",
        "con_usuarios_permissoes.fk_usuario"
      )
      .select("*");
    const formattedUsersAndPermissions: Record<string, any> = {};
    for (const i of usersAndPermissions) {
      const { oid, nome, email, permissao } = i;
      if (formattedUsersAndPermissions[oid]) {
        if (permissao) {
          formattedUsersAndPermissions[oid].permissoes.push(permissao);
        }
      } else {
        formattedUsersAndPermissions[oid] = {
          oid,
          nome,
          email,
          permissoes: [],
        };
        if (permissao) {
          formattedUsersAndPermissions[oid].permissoes.push(permissao);
        }
      }
    }

    return {
      total_pages: Math.ceil(
        Number((await total)?.total || 0) / PAGINATION_SIZE
      ),
      results: Object.keys(formattedUsersAndPermissions)
        .map((i) => formattedUsersAndPermissions[i])
        .sort((a, b) => (a.nome > b.nome ? 1 : -1)),
    };
  }

  async index(oid: string) {
    const user = await this._getUser(oid);
    const permissions = await this._getUserPermissions(oid);
    return { ...user, permissoes: permissions };
  }

  async changePermissions({ targetOid, permissions, adminOid }: IPermissions) {
    const user = this._getUser(targetOid);

    const adminPermissions = await this._getUserPermissions(adminOid);
    for (const i of permissions) {
      if (!isValidPermission(i)) {
        throw new AppError(`A permissão '${i}' não é válida`, 400);
      }
    }
    if (!adminPermissions.includes(EPermissions.ALTERAR_PERMISSOES)) {
      throw new AppError(
        "O usuário atual não possui permissão para editar permissões",
        403
      );
    }
    await database("con_usuarios_permissoes")
      .where("fk_usuario", targetOid)
      .delete();
    if (permissions.length > 0) {
      await database("con_usuarios_permissoes").insert(
        permissions.map((i) => ({
          fk_usuario: targetOid,
          permissao: i,
        }))
      );
    }

    return { ...user, permissions };
  }
}
