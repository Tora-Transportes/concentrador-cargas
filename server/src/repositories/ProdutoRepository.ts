import database from "../database";

export class AddProdutoRepo {
  async save(produto: Record<string, any>) {
    return database("con_produtos").insert(produto);
  }

  async getNextId() {
    return Number(
      (await database("DUAL").select("seq_con_produtos.NEXTVAL as id"))[0].id
    );
  }
}

export class UpdateProdutoRepo {
  async save(id: number, produto: Record<string, any>) {
    return database("con_produtos").update(produto).where("id", id);
  }
}

export class ViewProdutoRepo {
  async get(filter: Record<string, any>) {
    const query = database("con_produtos").select("*").orderBy("nome", "asc");
    for (const i in filter) {
      if (filter[i] !== undefined && filter[i] !== null) {
        query.where(i, filter[i]);
      }
    }
    return query;
  }
}
