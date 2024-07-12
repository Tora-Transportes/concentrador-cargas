import { mssqlPPO } from "../../database";
import ICalculador from "../../models/ICalculador";
//import AppError from "../models/AppError";
import TokenAd from "../../models/TokenAd";
import { dateAtualMoment } from "../../Utils/formatData";

interface IPPOCalculadorRepository {
  create(calculador: ICalculador, user: string): Promise<any>;
  update(id: number, calculador: ICalculador, user: string): Promise<any>;
  index(id: string): Promise<ICalculador | undefined>;
  search(filter: Record<string, any>): Promise<any[]>;
  delete(id: number): Promise<void>;
  relatorio(
    query: Record<string, any>,
    page?: number,
    pageSize?: number
  ): Promise<any | undefined>;
  dash(): Promise<any>;
  blocos(): Promise<any>;
  emExecucao(): Promise<any>;
}

const isValid = (value: string | null | undefined) =>
  !["", null, undefined, "null", "undefined"].includes(value);

export class PPOCalculadorRepository implements IPPOCalculadorRepository {
  async index(id: string): Promise<ICalculador | undefined> {
    return await mssqlPPO("dbo.ppo_calculador_controle")
      .first()
      .where("id", id);
  }

  async create(calculador: ICalculador, user: string) {
    calculador.cod_usu_create = TokenAd.getClaims(user).name;
    return mssqlPPO("dbo.ppo_calculador_controle").insert(calculador);
  }

  async blocos() {
    const blocos = await mssqlPPO.raw(
      `SELECT TOP 6 mes_avaliacao, ano_avaliacao
      FROM (
          SELECT DISTINCT mes_avaliacao, ano_avaliacao
          FROM ppo_resultado
      ) AS distinct_results
      ORDER BY ano_avaliacao DESC, mes_avaliacao DESC;`
    );
    return blocos;
  }

  async emExecucao() {
    const blocos = await mssqlPPO.raw(
      `select * from dbo.ppo_calculador_controle
      WHERE status in(0,1)
      `
    );
    return blocos;
  }

  async dash() {
    const qtd_ppo = await mssqlPPO.raw(`SELECT 
    count(*) as total
    FROM
    (
    SELECT DISTINCT  cpf,mes_avaliacao,ano_avaliacao FROM dbo.ppo_resultado WITH(NOLOCK)
     group by cpf,mes_avaliacao,ano_avaliacao
     )  x`);

    const data_ult = await mssqlPPO.raw(` 
    SELECT top 1 updated_at as ultimo_processamento FROM ppo_calculador_controle WITH(NOLOCK)
    ORDER BY updated_at DESC`);

    const processando = await mssqlPPO.raw(`
    SELECT status,qtd_processada,qtd_final FROM ppo_calculador_controle WITH(NOLOCK)
      where status = 1
    `);
    return {
      qtd_ppo_calculados: qtd_ppo[0]["total"],
      data_ult_processamento: data_ult[0]["ultimo_processamento"],
      processando: processando.length > 0 ? true : false,
      data_processando: processando.length > 0 ? processando[0] : {},
    };
  }

  async update(id: number, calculador: ICalculador, user: string) {
    calculador.cod_usu_update = TokenAd.getClaims(user).name;
    calculador.updated_at = new Date(dateAtualMoment());
    return mssqlPPO("dbo.ppo_calculador_controle")
      .update(calculador)
      .where("id", id);
  }

  async delete(id: number): Promise<void> {
    await mssqlPPO("dbo.ppo_calculador_controle").delete().where({ id });
  }

  async search(filter: Record<string, any>) {
    const query = mssqlPPO("dbo.ppo_calculador_controle")
      .select("*")
      .orderBy("id", "asc");
    for (const i in filter) {
      if (filter[i] !== undefined && filter[i] !== null) {
        query.where(i, filter[i]);
      }
    }
    return query;
  }

  async relatorio(
    query: Record<string, any>,
    page = 1,
    pageSize = 5
  ): Promise<any | undefined> {
    const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

    let filtro = "";

    if (isValid(query?.mes)) {
      filtro = filtro + ` AND mes LIKE '%${query.mes}%'`;
    }
    if (isValid(query?.ano)) {
      filtro = filtro + ` AND ano LIKE '%${query.ano}%'`;
    }
    if (isValid(query?.tipo)) {
      filtro = filtro + ` AND tipo LIKE '%${query.tipo}%'`;
    }

    const total = await mssqlPPO.raw(
      `SELECT COUNT(0) as total FROM ppo_calculador_controle
       WHERE 1=1
       ${filtro}
      `
    );

    const sql = `
    SELECT * FROM ppo_calculador_controle
    WHERE 1=1
    ${filtro}
    ORDER BY id DESC
    OFFSET ${(realPage - 1) * pageSize} ROWS
    FETCH NEXT  ${pageSize} ROWS ONLY
    `;
    const results = await mssqlPPO.raw(sql);
    const totalRegisters = Number(total[0]["total"]) || 0;

    return {
      page: realPage,
      total_pages: Math.ceil(totalRegisters / pageSize),
      total_registers: totalRegisters,
      results: results,
    };
  }
}
