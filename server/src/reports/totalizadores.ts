import database from "../database";

export interface IFilter {
  data_inicio?: string;
  data_final?: string;
  fk_filial?: number | null;
}

export class ReportTotalizadores {
  private async generateByAtivos({
    data_inicio,
    data_final,
    fk_filial,
  }: IFilter) {
    const query = database(
      database.raw(
        `(select 1 "ativo" from dual union select 0 "ativo" from dual) "con_vw_ativo"`
      )
    )
      .count("con_cargas.id as total")
      .select("con_vw_ativo.ativo")
      .leftJoin("con_cargas", "con_cargas.ativo", "con_vw_ativo.ativo")
      .where("e_lote", 0)
      .groupBy("con_vw_ativo.ativo");
    if (data_inicio) {
      query.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') >= ?`, [
        data_inicio,
      ]);
    }
    if (data_final) {
      query.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') <= ?`, [
        data_final,
      ]);
    }
    if (fk_filial) {
      query.where("fk_filial", fk_filial);
    }
    return await query;
    // return await database.raw(`select count("con_cargas"."id") as "total", "con_vw_ativo"."ativo"
    // from (select 1 "ativo" from dual union select 0 "ativo" from dual) "con_vw_ativo"
    // left join "con_cargas" on "con_vw_ativo"."ativo" = "con_cargas"."ativo"
    // where "e_lote" = 0
    // group by "con_vw_ativo"."ativo"`);
  }

  private async generateByCanal({
    data_inicio,
    data_final,
    fk_filial,
  }: IFilter) {
    const query = database(
      database.raw(
        `(select 'portal' "canal_comunicacao" from dual union select 'manual' from dual union select 'email' from dual) "con_vw_canal"`
      )
    )
      .select(["con_vw_canal.canal_comunicacao"])
      .count("con_cargas.id as total")
      .join(
        "con_cargas",
        "con_vw_canal.canal_comunicacao",
        "con_cargas.canal_comunicacao"
      )
      .where("con_cargas.e_lote", 0)
      .where("con_cargas.ativo", 1)
      .groupBy("con_vw_canal.canal_comunicacao")
      .orderBy("con_vw_canal.canal_comunicacao");
    if (data_inicio) {
      query.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') >= ?`, [
        data_inicio,
      ]);
    }
    if (data_final) {
      query.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') <= ?`, [
        data_final,
      ]);
    }
    if (fk_filial) {
      query.where("fk_filial", fk_filial);
    }
    return await query;
    // return await database.raw(`select count("con_cargas_1"."id") as "total", "con_vw_canal"."canal_comunicacao"
    //   from (select 'portal' "canal_comunicacao" from dual union select 'manual' from dual) "con_vw_canal"
    //   join (select * from "con_cargas" where "ativo" = 1 and "e_lote" = 0) "con_cargas_1" on "con_vw_canal"."canal_comunicacao" = "con_cargas_1"."canal_comunicacao"
    //   group by "con_vw_canal"."canal_comunicacao"`);
  }

  private async generateBySituacao({
    data_inicio,
    data_final,
    fk_filial,
  }: IFilter) {
    const subquery = database("con_cargas")
      .where("con_cargas.ativo", 1)
      .where("con_cargas.e_lote", 0)
      .as("con_cargas_1");
    if (data_inicio) {
      subquery.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') >= ?`, [
        data_inicio,
      ]);
    }
    if (data_final) {
      subquery.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') <= ?`, [
        data_final,
      ]);
    }
    if (fk_filial) {
      subquery.where("fk_filial", fk_filial);
    }
    const query = database(subquery)
      .count("con_cargas_1.id as total")
      .select(["con_situacoes_cargas.id as fk_situacao", "descricao"])

      .rightJoin(
        "con_situacoes_cargas",
        "con_situacoes_cargas.id",
        "con_cargas_1.fk_situacao"
      )
      .groupBy(["fk_situacao", "descricao", "con_situacoes_cargas.id", "ativo"])
      .orderBy("con_situacoes_cargas.id");

    return await query;
    // return await database.raw(`
    //   select count("con_cargas_1"."id") as "total", "con_situacoes_cargas"."id" as "fk_situacao", "descricao"
    //     from (select * from "con_cargas" where "ativo" = 1 and "e_lote" = 0) "con_cargas_1"
    //     right join "con_situacoes_cargas" ON "con_situacoes_cargas"."id" = "con_cargas_1"."fk_situacao"
    //     group by "fk_situacao", "descricao", "con_situacoes_cargas"."id", "ativo" order by "con_situacoes_cargas"."id"`);
  }

  private async generateLoteByActive({
    data_final,
    data_inicio,
    fk_filial,
  }: IFilter) {
    const status = database.raw(
      `(select 1 "ativo" from DUAL union select 0 "ativo" from "DUAL") "con_vw_status"`
    );
    const subquery = database("con_cargas").where("e_lote", 1);
    if (data_inicio) {
      subquery.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') >= ?`, [
        data_inicio,
      ]);
    }
    if (data_final) {
      subquery.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') <= ?`, [
        data_final,
      ]);
    }
    if (fk_filial) {
      subquery.where("fk_filial", fk_filial);
    }
    return database(status)
      .count("con_cargas.id as total")
      .select("con_vw_status.ativo")
      .leftJoin(
        subquery.as("con_cargas"),
        "con_cargas.ativo",
        "con_vw_status.ativo"
      )
      .groupBy("con_vw_status.ativo");
  }

  async generate(filter: IFilter) {
    const output = {
      cargas_ativas: 0,
      cargas_desativadas: 0,
      cadastro_portal: 0,
      cadastro_manual: 0,
      cadastro_email: 0,
      lotes_ativos: 0,
      lotes_desativados: 0,
      geral: [],
    };

    const lotes = await this.generateLoteByActive(filter);
    for (const i of lotes) {
      if (i.ativo === 0) {
        output.lotes_desativados = Number(i.total);
      }
      if (i.ativo === 1) {
        output.lotes_ativos = Number(i.total);
      }
    }
    const ativos = await this.generateByAtivos(filter);
    for (const i of ativos) {
      if (i.ativo === 0) {
        output.cargas_desativadas = Number(i.total);
      }
      if (i.ativo === 1) {
        output.cargas_ativas = Number(i.total);
      }
    }
    const canais = await this.generateByCanal(filter);
    for (const i of canais) {
      if (i.canal_comunicacao === "portal") {
        output.cadastro_portal = Number(i.total);
      }
      if (i.canal_comunicacao === "email") {
        output.cadastro_email = Number(i.total);
      }
      if (i.canal_comunicacao === "manual") {
        output.cadastro_manual = Number(i.total);
      }
    }
    // @ts-expect-error: coisa de typescript
    output.geral.push(...(await this.generateBySituacao(filter)));

    return output;
  }
}
