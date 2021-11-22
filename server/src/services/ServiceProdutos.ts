import database from "../database";
import AppError from "../models/AppError";
import TokenAd from "../models/TokenAd";
import EPermissions from "../models/EPermissions";

export interface IProduto {
  nome: string;
  usuario: string;
}

export class ServiceProdutos {
  async insert({ nome, usuario }: IProduto) {
    if (!nome) {
      throw new AppError("Nome inválido informado", 400);
    }
    const tokenClaims = TokenAd.getClaims(String(usuario));
    const userName = tokenClaims.name;
    const oid = tokenClaims.oid;
    const hasPermission = await database("con_usuarios_permissoes")
      .where("fk_usuario", oid)
      .where("permissao", EPermissions.CADASTRAR_PRODUTOS)
      .select("*")
      .first();

    if (!hasPermission) {
      throw new AppError(
        "O usuário não possui permissão para cadastrar produtos",
        403
      );
    }

    const upperCaseName = nome.toUpperCase().trim();

    const alreadExists = await database("con_produtos")
      .where("nome", upperCaseName)
      .first()
      .select("*");
    if (alreadExists) {
      throw new AppError("Já existe um produto registrado com esse nome", 409);
    }

    const nextId = (
      await database("DUAL").select("seq_con_produtos.NEXTVAL as id")
    )[0].id;

    await database("con_produtos").insert({
      usuario: userName,
      nome: upperCaseName,
      id: nextId,
    });
    return { id: nextId, nome: upperCaseName };
  }

  async list() {
    return database("con_produtos").select("*").orderBy("nome", "asc");
  }
}
