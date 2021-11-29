import database from "../database";
import IProduto from "../models/IProduto";

export class ProdutoRepository {
  async getNextId(): Promise<number> {
    return Number(
      (await database("DUAL").select("seq_con_produtos.NEXTVAL as id"))[0].id
    );
  }

  async index(id: string): Promise<IProduto | undefined> {
    return await database("con_produtos").first().where("id", id);
  }

  async create(produto: IProduto) {
    return database("con_produtos").insert(produto);
  }

  async update(id: number, produto: IProduto) {
    return database("con_produtos").update(produto).where("id", id);
  }

  async findByName(nome: string): Promise<IProduto | undefined> {
    return database("con_produtos").select("*").where("nome", nome).first();
  }

  async search(filter: Record<string, any>) {
    const query = database("con_produtos").select("*").orderBy("nome", "asc");
    for (const i in filter) {
      if (filter[i] !== undefined && filter[i] !== null) {
        query.where(i, filter[i]);
      }
    }
    return query;
  }
}
