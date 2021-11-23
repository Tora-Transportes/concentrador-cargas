import database from "../database";
import AppError from "../models/AppError";
import TokenAd, { ITokenAdClaims } from "../models/TokenAd";
import EPermissions from "../models/EPermissions";

export interface IProduto {
  id?: number;
  nome: string;
  usuario: string;
  ativo?: 1;
}

export interface IProdutoDeleteAction {
  id: number;
  usuario: string;
  observacao?: string;
}

export class ServiceProdutos {
  async checkProdutoPermissions(usuario: string): Promise<ITokenAdClaims> {
    const tokenClaims = TokenAd.getClaims(String(usuario));
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

    return tokenClaims;
  }

  async insert({ nome, usuario }: IProduto) {
    if (!nome) {
      throw new AppError("Nome inválido informado", 400);
    }

    const { name: userName } = await this.checkProdutoPermissions(usuario);
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
      ativo: 1,
    });
    return { id: nextId, nome: upperCaseName };
  }

  async update({ id, nome, usuario }: IProduto) {
    if (!id || !nome || !usuario) {
      throw new AppError("Dados inválidos", 400);
    }

    const { name } = await this.checkProdutoPermissions(usuario);
    const newName = nome.toUpperCase();

    const produto = await database("con_produtos")
      .first()
      .where("id", id)
      .where("ativo", 1);
    if (!produto) {
      throw new AppError("Produto não existe ou foi desativado", 404);
    }

    if (
      await database("con_produtos")
        .first()
        .where("nome", newName)
        .where("id", "<>", id)
    ) {
      throw new AppError("Um produto com esse nome já foi registrado", 400);
    }

    const update = { id, nome: newName, usuario: name };
    await database("con_produtos").update(update).where("id", id);

    return update;
  }

  async delete({ id, usuario, observacao }: IProdutoDeleteAction) {
    const { name } = await this.checkProdutoPermissions(usuario);
    if (!observacao) {
      throw new AppError("Digite a observação", 400);
    }
    await database("con_produtos")
      .update({
        ativo: 0,
        usuario: name,
        observacao,
      })
      .where("id", id);
    return { id, ativo: 0, observacao, usuario: name };
  }

  async enable({ id, usuario }: IProdutoDeleteAction) {
    const { name } = await this.checkProdutoPermissions(usuario);
    await database("con_produtos")
      .update({
        ativo: 1,
        usuario: name,
        observacao: null,
      })
      .where("id", id);
    return { id, ativo: 1 };
  }

  async list() {
    return database("con_produtos").select("*").orderBy("nome", "asc");
  }
}
