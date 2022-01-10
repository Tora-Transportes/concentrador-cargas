import database from "../database";
export class ReportTotalizadores {
  private async generateByAtivos() {
    return await database.raw(`select count("con_cargas"."id") as "total", "con_vw_ativo"."ativo"
    from (select 1 "ativo" from dual union select 0 "ativo" from dual) "con_vw_ativo"
    left join "con_cargas" on "con_vw_ativo"."ativo" = "con_cargas"."ativo"
    where "e_lote" = 0
    group by "con_vw_ativo"."ativo"`);
  }

  private async generateByCanal() {
    return await database.raw(`select count("con_cargas_1"."id") as "total", "con_vw_canal"."canal_comunicacao"
      from (select 'portal' "canal_comunicacao" from dual union select 'manual' from dual) "con_vw_canal"
      join (select * from "con_cargas" where "ativo" = 1 and "e_lote" = 0) "con_cargas_1" on "con_vw_canal"."canal_comunicacao" = "con_cargas_1"."canal_comunicacao"
      group by "con_vw_canal"."canal_comunicacao"`);
  }

  private async generateBySituacao() {
    return await database.raw(`
      select count("con_cargas_1"."id") as "total", "con_situacoes_cargas"."id" as "fk_situacao", "descricao"
        from (select * from "con_cargas" where "ativo" = 1 and "e_lote" = 0) "con_cargas_1"
        right join "con_situacoes_cargas" ON "con_situacoes_cargas"."id" = "con_cargas_1"."fk_situacao"
        group by "fk_situacao", "descricao", "con_situacoes_cargas"."id", "ativo" order by "con_situacoes_cargas"."id"`);
  }

  async generate() {
    const output = {
      cargas_ativas: 0,
      cargas_desativadas: 0,
      cadastro_portal: 0,
      cadastro_manual: 0,
      geral: [],
    };

    const ativos = await this.generateByAtivos();
    for (const i of ativos) {
      if (i.ativo === 0) {
        output.cargas_desativadas = i.total;
      }
      if (i.ativo === 1) {
        output.cargas_ativas = i.total;
      }
    }
    const canais = await this.generateByCanal();
    for (const i of canais) {
      if (i.canal_comunicacao === "portal") {
        output.cadastro_portal = i.total;
      }
      if (i.canal_comunicacao === "manual") {
        output.cadastro_manual = i.total;
      }
    }
    // @ts-expect-error: coisa de typescript
    output.geral.push(...(await this.generateBySituacao()));

    return output;
  }
}
