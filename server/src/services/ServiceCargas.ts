import { ICarga } from "../models/ICargas";
import database from "../database";
import AppError from "../models/AppError";
import TokenAd from "../models/TokenAd";
import ISearchCarga from "../models/ISearchCarga";
import { Knex } from "knex";

export class ServiceCargas {
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
    const { oid, name } = TokenAd.getClaims(usuario);
    const hasPermission = await database("con_usuarios_permissoes")
      .where("fk_usuario", oid)
      .where("permissao", "DELETAR_CARGAS")
      .select("*")
      .first();
    if (!hasPermission) {
      throw new AppError(
        "O usuário não possui permissão para deletar as cargas",
        403
      );
    }
    await database("con_cargas")
      .update({
        ativo: 0,
        usuario: name,
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

  async search(query: ISearchCarga, pageSize = 50) {
    const realPage =
      isNaN(Number(query?.page)) || Number(query?.page) < 1
        ? 1
        : Number(query?.page);

    const total = database("con_cargas")
      .count("id as total")
      .first()
      .where("ativo", 1);

    const results = database("con_cargas")
      .select("*")
      .limit(pageSize)
      .offset((realPage - 1) * pageSize)
      .where("ativo", 1);

    const isValid = (value: string | null | undefined) =>
      !["", null, undefined, "null", "undefined"].includes(value);

    const filterDbFunction = (qb: Knex.QueryBuilder) => {
      if (query?.data_cadastro) {
        const date = query.data_cadastro.split("T")[0];
        qb.andWhereBetween("data_cadastro", [
          new Date(date + "T00:00:00"),
          new Date(date + "T23:59:59"),
        ]);
      }
      if (query?.data_coleta) {
        qb.andWhere("data_coleta", "=", new Date(query.data_coleta));
      }
      if (query?.data_entrega) {
        qb.andWhere("data_entrega", "=", new Date(query.data_entrega));
      }

      if (isValid(query?.cliente)) {
        qb.andWhere("cliente", "like", `%${query.cliente}%`);
      }
      if (isValid(query?.id)) {
        qb.andWhere("id", "like", `%${query.id}%`);
      }
      if (isValid(String(query?.e_lote))) {
        qb.andWhere("e_lote", "=", `${query.e_lote}`);
      }
      if (isValid(String(query?.tipo_carga))) {
        qb.andWhere("tipo_carga", "like", `%${query.tipo_carga}%`);
      }
      if (isValid(String(query?.responsavel_cadastro))) {
        qb.andWhere(
          "responsavel_cadastro",
          "like",
          `%${query.responsavel_cadastro}%`
        );
      }
    };

    total.andWhere(filterDbFunction);
    results.andWhere(filterDbFunction);

    return {
      total_pages: Math.ceil(Number((await total)?.total || 0) / pageSize),
      results: await results,
    };
  }
}
