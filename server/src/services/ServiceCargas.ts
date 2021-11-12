import { ICarga } from "../models/ICargas";
import database from "../database";
import AppError from "../models/AppError";

export class ServiceCargas {
  cargas: ICarga[] = [];
  async insert(carga: ICarga) {
    const firstLetter = carga.canal_comunicacao[0].toUpperCase();
    if (firstLetter !== carga.id[0]) {
      throw new AppError("O Id é inválido para esse canal de comunicação", 400);
    }

    const alreadExists = await database("con_cargas")
      .select("*")
      .where("id", carga.id)
      .first();

    if (alreadExists) {
      throw new AppError("Já existe uma carga registrada com esse id", 409);
    }

    const currentDate = new Date();
    await database("con_cargas").insert({
      ...carga,
      data_atualizacao: currentDate,
      data_cadastro: currentDate,
    });
    return carga.id;
  }

  async update(carga: ICarga) {
    const alreadExists = await database("con_cargas")
      .select("*")
      .where("id", carga.id)
      .first();

    if (!alreadExists) {
      throw new AppError(
        "Não existe nenhuma carga registrada com esse id",
        404
      );
    } else if (alreadExists.ATIVO === 0) {
      throw new AppError("A carga com o id requisitado foi excluida", 404);
    }

    const currentDate = new Date();
    await database("con_cargas")
      .update({
        ...carga,
        data_atualizacao: currentDate,
      })
      .where("id", carga.id);
    return carga;
  }

  async delete(cargaId: string, usuario: string) {
    await database("con_cargas")
      .update({
        ativo: 0,
        usuario: usuario,
      })
      .where("id", cargaId);
  }

  async index(cargaId: string): Promise<ICarga> {
    const carga = await database("con_cargas")
      .select("*")
      .where("id", cargaId)
      .where("ativo", 1)
      .first();
    if (!carga) {
      throw new AppError("Carga não cadastrada ou excluida", 404);
    }
    return carga;
  }

  async search(search: string, page: number) {
    const PAGINATION_SIZE = 50;
    const realPage = isNaN(page) || page < 1 ? 1 : page;
    const total = database("con_cargas")
      .count("id as total")
      .first()
      .where("ativo", 1);
    const results = database("con_cargas")
      .select("*")
      .limit(PAGINATION_SIZE)
      .offset((realPage - 1) * PAGINATION_SIZE)
      .where("ativo", 1);

    total.andWhere((qb) => {
      qb.orWhere("id", "like", `%${search}%`);
      qb.orWhere("responsavel_cadastro", "like", `%${search}%`);
      qb.orWhere("cliente", "like", `%${search}%`);
    });

    results.andWhere((qb) => {
      qb.orWhere("id", "like", `%${search}%`);
      qb.orWhere("responsavel_cadastro", "like", `%${search}%`);
      qb.orWhere("cliente", "like", `%${search}%`);
    });

    return {
      total_pages: Math.ceil(
        Number((await total)?.total || 0) / PAGINATION_SIZE
      ),
      results: await results,
    };
  }
}
