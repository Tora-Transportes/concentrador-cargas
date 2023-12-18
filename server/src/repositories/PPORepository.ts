import database, { mssqlPPO } from "../database";
import IAvaliacao from "../models/IAvaliacao";
import IAtributo from "../models/IAtributo";
import AppError from "../models/AppError";
import { decrypt, encrypt } from "../Utils/utlis";
import { Knex } from "knex";
import { has } from "lodash";

interface IPPORepository {
  avaliacoes(cpf: string): Promise<IAvaliacao[] | undefined>;
  distancia(id: number): Promise<void>;
  infracoes(id: number): Promise<void>;
  interjornada(id: number): Promise<void>;
  atributos(): Promise<IAtributo[] | undefined>;
  resultado_ppo(
    cpf: string,
    mes: string,
    ano: string
  ): Promise<IAtributo[] | undefined>;
  relatorio_motoristas(
    query: Record<string, any>,
    page?: number,
    pageSize?: number
  ): Promise<any | undefined>;
}
const isValid = (value: string | null | undefined) =>
  !["", null, undefined, "null", "undefined"].includes(value);

export class PPORepository implements IPPORepository {
  async avaliacoes(cpf: string): Promise<IAvaliacao[] | undefined> {
    return await mssqlPPO("dbo.ppo_rank_avaliacao_fleet")
      .select([
        "classificacao",
        "nome_motorista",
        "cpf",
        "pontuacao",
        "periodo_inicial",
        "periodo_final",
      ])
      .where("cpf", cpf);
  }
  async distancia(ID: number): Promise<void> {
    await database("con_avisos").delete().where({ ID });
  }
  async infracoes(ID: number): Promise<void> {
    await database("con_avisos").delete().where({ ID });
  }
  async interjornada(ID: number): Promise<void> {
    await database("con_avisos").delete().where({ ID });
  }
  async atributos(): Promise<any | undefined> {
    const atributos = await mssqlPPO.raw(`
    SELECT 
    pr.id as id_rotulo,
    TABELAS.TABLE_SCHEMA AS schemas,
    TABELAS.TABLE_NAME as tabela,
    COLUNAS.COLUMN_NAME as coluna,
    pr.rotulo as rotulo
    FROM INFORMATION_SCHEMA.COLUMNS AS COLUNAS
    INNER JOIN INFORMATION_SCHEMA.TABLES  AS TABELAS ON TABELAS.TABLE_NAME = COLUNAS.TABLE_NAME
    INNER JOIN [dbo].[ppo_de_para_rotulo] AS pr ON pr.tabela = CONCAT ( TABELAS.TABLE_SCHEMA, '.',TABELAS.TABLE_NAME) and pr.campo = COLUNAS.COLUMN_NAME  
    `);

    const tabelasAgrupadas: any = [];

    atributos.forEach(
      (objeto: {
        id_rotulo: number;
        schemas: string;
        tabela: string;
        coluna: string;
        rotulo: string;
      }) => {
        tabelasAgrupadas.push({
          id_rotulo: objeto.id_rotulo,
          tabela: `${objeto.schemas}.${objeto.tabela}`,
          coluna: objeto.coluna,
          rotulo: objeto.rotulo,
        });
      }
    );
    return tabelasAgrupadas;
  }

  async demonstrativos(filter: Record<string, any>): Promise<any | undefined> {
    let clausula = "";

    for (const i in filter) {
      if (filter[i] !== undefined && filter[i] !== null) {
        clausula = clausula + ` AND ${i} LIKE '%${filter[i]}%'`;
      }
    }

    const query = mssqlPPO.raw(` 
    SELECT DISTINCT r.nome_motorista as nome
    ,r.cpf
    ,r.mes_avaliacao
    ,r.ano_avaliacao 
    FROM dbo.ppo_resultado r
    inner join dbo.ppo_parametros_grupo pg on pg.id = r.parametro_grupo_id
    inner join dbo.ppo_parametros p on p.id =  pg.parametro_id
    WHERE r.apto = 1
    ${clausula}
  `);

    const data = await query;

    if (data.length == 0) {
      throw new AppError("Sem dados de demonstrativo", 400);
    }

    return data;
  }

  async resultado_ppo(
    cpf: string,
    mes: string,
    ano: string
  ): Promise<any | undefined> {
    const data_hash = await mssqlPPO.raw(`
    SELECT 
    CONCAT( r.cpf,'|',
    RTRIM(LTRIM(r.matricula)),'|',
    g.nome,'|',  g.empresa,'|',
    sum(cast(r.premio as float)),'|',
	  r.mes_avaliacao,'|',r.ano_avaliacao) as hash
    FROM 
    dbo.ppo_resultado r
    INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
    INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
    INNER JOIN dbo.ppo_parametros p ON p.id = pg.parametro_id
    WHERE  r.cpf = '${cpf}'
    AND r.mes_avaliacao = '${mes}'
    AND r.ano_avaliacao = '${ano}'
    GROUP BY 
    r.cpf,r.matricula,g.nome, g.empresa, r.mes_avaliacao,
    r.ano_avaliacao;
    `);

    const total = await mssqlPPO.raw(`
      SELECT 'R$ '+CONVERT(VARCHAR, CAST(SUM(CAST(premio as float)) AS MONEY), 1) as valor FROM dbo.ppo_resultado
      WHERE cpf = '${cpf}'
      and apto = 1
      AND mes_avaliacao = '${mes}'
      AND ano_avaliacao = '${ano}'
      `);
    const valores = await mssqlPPO.raw(` 
      SELECT p.nome,r.dado_verificado,'R$ '+CONVERT(VARCHAR, CAST(r.premio AS MONEY), 1) as valor FROM dbo.ppo_resultado r
      inner join dbo.ppo_parametros_grupo pg on pg.id = r.parametro_grupo_id
      join dbo.ppo_parametros p on p.id =  pg.parametro_id
      WHERE r.apto = 1
      AND r.cpf = '${cpf}'
      AND r.mes_avaliacao = '${mes}'
      AND r.ano_avaliacao = '${ano}'
    `);

    const dados_motorista = await mssqlPPO.raw(` 
    SELECT DISTINCT r.nome_motorista as nome
    ,r.cpf
    ,r.matricula
    ,CASE WHEN r.ppo_cancelado = 1 THEN 'Sim' ELSE 'Não' END as cancelado
    ,CASE WHEN r.observacao is NULL THEN 'Sem Observação' ELSE r.observacao END as observacao
    ,CONCAT(r.mes_avaliacao,'/',r.ano_avaliacao) as mes_ano
    FROM dbo.ppo_resultado r
    inner join dbo.ppo_parametros_grupo pg on pg.id = r.parametro_grupo_id
    join dbo.ppo_parametros p on p.id =  pg.parametro_id
    WHERE r.cpf = '${cpf}'
    AND r.mes_avaliacao = '${mes}'
    AND r.ano_avaliacao = '${ano}'
  `);
    if (dados_motorista.length == 0) {
      throw new AppError("Sem dados para gerar demonstrativo", 400);
    }
    const hash = encrypt(data_hash[0]["hash"]);

    const update_hash = await mssqlPPO("dbo.ppo_resultado") //update hash
      .update({ hash: hash })
      .where("cpf", cpf)
      .andWhere("mes_avaliacao", mes)
      .andWhere("ano_avaliacao", ano);

    return {
      dados_motorista: dados_motorista[0],
      valores: valores,
      total: total[0]["valor"] ? total[0]["valor"] : "R$ 0.00",
      hash: hash,
    };
  }

  async relatorio_motoristas(
    query: Record<string, any>,
    page = 1,
    pageSize = 5
  ): Promise<any | undefined> {
    const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

    const filterDbFunction = (qb: Knex.QueryBuilder) => {
      if (isValid(query?.cpf)) {
        qb.andWhere("cpf", "like", `%${query.cpf}%`);
      }
      if (isValid(query?.matricula)) {
        qb.andWhere("matricula", "like", `%${query.matricula}%`);
      }
      if (isValid(query?.nome_motorista)) {
        qb.andWhere("nome_motorista", "like", `%${query.nome_motorista}%`);
      }
      if (isValid(query?.mes_avaliacao)) {
        qb.andWhere("mes_avaliacao", "like", `%${query.mes_avaliacao}%`);
      }
      if (isValid(query?.ano_avaliacao)) {
        qb.andWhere("ano_avaliacao", "like", `%${query.ano_avaliacao}%`);
      }
      if (isValid(query?.ppo_cancelado)) {
        qb.andWhere("ppo_cancelado", "like", `%${query.ppo_cancelado}%`);
      }
    };
    const total = mssqlPPO("dbo.ppo_resultado")
      .count("id as total")
      .andWhere(filterDbFunction)
      .first();

    const results = mssqlPPO("dbo.ppo_resultado")
      .select([
        "dbo.ppo_resultado.nome_motorista",
        "dbo.ppo_resultado.cpf",
        "dbo.ppo_resultado.matricula",
        "dbo.ppo_grupos.nome as nome_grupo",
        "dbo.ppo_grupos.empresa ",
        "dbo.ppo_grupos.filial as filial",
        "dbo.ppo_parametros.nome as parametro",
        "dbo.ppo_resultado.dado_verificado as referencia",
        "dbo.ppo_parametros_grupo.operador_logico_primario",
        "dbo.ppo_parametros_grupo.valor_primario",
        "dbo.ppo_parametros_grupo.faixa_valores as faixa_valores",
        "dbo.ppo_resultado.dado_verificado as referencia_secundaria",
        "dbo.ppo_parametros_grupo.operador_logico_secundaria",
        "dbo.ppo_parametros_grupo.valor_secundario",
        "dbo.ppo_parametros_grupo.multiplicar_premio as multiplicar_premio",
        "dbo.ppo_parametros_grupo.premio as premio_referencia",
        "dbo.ppo_resultado.premio as premio",
        "dbo.ppo_resultado.apto",
        "dbo.ppo_resultado.ppo_cancelado",
        "dbo.ppo_resultado.observacao",
        "dbo.ppo_resultado.mes_avaliacao",
        "dbo.ppo_resultado.ano_avaliacao",
      ])
      .innerJoin(
        "dbo.ppo_parametros_grupo",
        "dbo.ppo_parametros_grupo.id",
        "dbo.ppo_resultado.parametro_grupo_id"
      )
      .innerJoin(
        "dbo.ppo_grupos",
        "dbo.ppo_grupos.id",
        "dbo.ppo_parametros_grupo.grupo_id"
      )
      .innerJoin(
        "dbo.ppo_parametros",
        "dbo.ppo_parametros.id",
        "dbo.ppo_parametros_grupo.parametro_id"
      )
      .limit(pageSize)
      .offset((realPage - 1) * pageSize)
      .andWhere(filterDbFunction);

    if (isValid(query?.order_column)) {
      results.orderBy(
        "ppo_resultado." + String(query.order_column),
        String(query?.order_direction)
      );
    }
    results.orderBy("ppo_resultado.id", "asc");

    const rows = await results;
    const totalRegisters = Number((await total)?.total) || 0;

    return {
      page: realPage,
      total_pages: Math.ceil(totalRegisters / pageSize),
      total_registers: totalRegisters,
      results: rows,
    };
  }

  async searchExcel(
    query: Record<string, any>,
    pageSize = 5
  ): Promise<any | undefined> {
    const filterDbFunction = (qb: Knex.QueryBuilder) => {
      if (isValid(query?.cpf)) {
        qb.andWhere("cpf", "like", `%${query.cpf}%`);
      }
      if (isValid(query?.matricula)) {
        qb.andWhere("matricula", "like", `%${query.matricula}%`);
      }
      if (isValid(query?.nome_motorista)) {
        qb.andWhere("nome_motorista", "like", `%${query.nome_motorista}%`);
      }
      if (isValid(query?.mes_avaliacao)) {
        qb.andWhere("mes_avaliacao", "like", `%${query.mes_avaliacao}%`);
      }
      if (isValid(query?.ano_avaliacao)) {
        qb.andWhere("ano_avaliacao", "like", `%${query.ano_avaliacao}%`);
      }
      if (isValid(query?.ppo_cancelado)) {
        qb.andWhere("ppo_cancelado", "like", `%${query.ppo_cancelado}%`);
      }
      if (isValid(query?.date_execel_inicio)) {
        qb.andWhere("mes_avaliacao", "like", `%${query.date_execel_inicio}%`);
      }
      if (isValid(query?.date_execel_fim)) {
        qb.andWhere("ano_avaliacao", "like", `%${query.date_execel_fim}%`);
      }
    };

    const results = mssqlPPO("dbo.ppo_resultado")
      .select([
        "dbo.ppo_resultado.nome_motorista as Nome Motorista",
        "dbo.ppo_resultado.cpf as CPF",
        "dbo.ppo_resultado.matricula as Matrícula",
        "dbo.ppo_grupos.nome as nome_grupo as Grupo",
        "dbo.ppo_grupos.empresa as Empresa",
        "dbo.ppo_grupos.filial as filial as Filial",
        "dbo.ppo_parametros.nome as parametro as Parâmetro",
        "dbo.ppo_resultado.dado_verificado as Dado Comparado ",
        "dbo.ppo_parametros_grupo.operador_logico_primario as Operador Primário",
        "dbo.ppo_parametros_grupo.valor_primario as Valor Primário",
        mssqlPPO.raw(
          `CASE WHEN "dbo"."ppo_parametros_grupo"."faixa_valores"=1 THEN 'Sim' ELSE 'Não'END as "Faixa de Valores"`
        ),
        "dbo.ppo_resultado.dado_verificado as referencia_secundaria as Dado Comparado",
        "dbo.ppo_parametros_grupo.operador_logico_secundaria as Operador Secundário",
        "dbo.ppo_parametros_grupo.valor_secundario as Valor Secundário",
        mssqlPPO.raw(
          `CASE WHEN "dbo"."ppo_parametros_grupo"."multiplicar_premio"=1 THEN 'Sim' ELSE 'Não' END as "Multiplicar Prêmio"`
        ),
        mssqlPPO.raw(
          `CONVERT(VARCHAR, CAST("dbo"."ppo_parametros_grupo"."premio" AS MONEY), 1) as "Prêmio Referência"`
        ),
        mssqlPPO.raw(
          `CONVERT(VARCHAR, CAST((CASE WHEN "dbo"."ppo_resultado"."apto"=1 THEN "dbo"."ppo_resultado"."premio" ELSE "dbo"."ppo_parametros_grupo"."premio" END) AS MONEY), 1) as "Prêmio"`
        ),
        mssqlPPO.raw(
          `CASE WHEN "dbo"."ppo_resultado"."apto"=1 THEN 'Sim' ELSE 'Não' END as "Apto"`
        ),
        mssqlPPO.raw(
          `CASE WHEN "dbo"."ppo_resultado"."ppo_cancelado"=1 THEN 'Sim' ELSE 'Não' END as "PPO Cancelado"`
        ),
        "dbo.ppo_resultado.observacao as Observação",
        "dbo.ppo_resultado.mes_avaliacao as Mês",
        "dbo.ppo_resultado.ano_avaliacao as Ano",
      ])
      .innerJoin(
        "dbo.ppo_parametros_grupo",
        "dbo.ppo_parametros_grupo.id",
        "dbo.ppo_resultado.parametro_grupo_id"
      )
      .innerJoin(
        "dbo.ppo_grupos",
        "dbo.ppo_grupos.id",
        "dbo.ppo_parametros_grupo.grupo_id"
      )
      .innerJoin(
        "dbo.ppo_parametros",
        "dbo.ppo_parametros.id",
        "dbo.ppo_parametros_grupo.parametro_id"
      )
      .limit(pageSize)
      .andWhere(filterDbFunction);

    const rows = await results;
    return {
      results: rows,
    };
  }
}
