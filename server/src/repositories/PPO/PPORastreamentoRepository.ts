import { mssqlPPO } from "../../database";
import IParametro from "../../models/IParametro";
import AppError from "../../models/AppError";
import TokenAd from "../../models/TokenAd";
import { dateAtualMoment } from "../../Utils/formatData";

interface IPPORastreamentoRepository {
  findByName(nome: string): Promise<IParametro | undefined>;
  create(parametro: IParametro, user: string): Promise<any>;
  update(id: number, parametro: IParametro, user: string): Promise<any>;
  index(id: string): Promise<IParametro | undefined>;
  delete(id: number): Promise<void>;
}
const isValid = (value: string | null | undefined) =>
  !["", null, undefined, "null", "undefined"].includes(value);

export class PPORastreamentoRepository implements IPPORastreamentoRepository {
  async index(id: string): Promise<IParametro | undefined> {
    return await mssqlPPO("dbo.ppo_parametros").first().where("id", id);
  }

  async create(iparametro: IParametro, user: string) {
    const parametro = await this.findByName(iparametro.nome);
    iparametro.cod_usu_create = TokenAd.getClaims(user).name;
    if (parametro != undefined) {
      throw new AppError("Esse nome já se encontra em uso", 400);
    } else {
      return mssqlPPO("dbo.ppo_parametros").insert(iparametro);
    }
  }

  async update(id: number, iparametro: IParametro, user: string) {
    const parametro = await this.findByName(iparametro.nome);
    iparametro.cod_usu_update = TokenAd.getClaims(user).name;
    iparametro.updated_at = new Date(dateAtualMoment());
    if (parametro != undefined && parametro.id != id) {
      throw new AppError("Esse nome já se encontra em uso", 400);
    } else {
      return mssqlPPO("dbo.ppo_parametros").update(iparametro).where("id", id);
    }
  }

  async delete(id: number): Promise<void> {
    await mssqlPPO("dbo.ppo_parametros").delete().where({ id });
  }

  async findByName(nome: string): Promise<IParametro | undefined> {
    return mssqlPPO("dbo.ppo_parametros")
      .select("*")
      .where("nome", nome)
      .first();
  }

  async search(
    query: Record<string, any>,
    page = 1,
    pageSize = 5
  ): Promise<any | undefined> {
    const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

    let filtro = "";
    if (isValid(query?.cpf)) {
      filtro = filtro + ` AND cpf LIKE '%${query.cpf}%'`;
    }
    if (isValid(query?.mes)) {
      filtro = filtro + ` AND mes LIKE '%${query.mes}%'`;
    }
    if (isValid(query?.ano)) {
      filtro = filtro + ` AND ano LIKE '%${query.ano}%'`;
    }
    if (isValid(query?.tipo)) {
      filtro = filtro + ` AND tipo LIKE '%${query.tipo}%'`;
    }
    if (isValid(query?.tipo_ppo)) {
      filtro = filtro + ` AND tipo_ppo LIKE '%${query.tipo_ppo}%'`;
    }
    if (query?.date_excel_inicio && query?.date_excel_fim) {
      filtro += ` AND created_at BETWEEN '${query.date_excel_inicio} 00:00:00' AND '${query.date_excel_fim} 23:59:59'`;
    }

    const total = await mssqlPPO.raw(
      `SELECT COUNT(0) as total FROM ppo_rastreamento 
       WHERE 1=1
       ${filtro}
      `
    );

    let sql = "";
    if (isValid(query?.relatorio)) {
      sql = `
        select
          id,
          mes,
          ano,
          cpf as cpf_motorista,
          tipo,
          CASE WHEN tipo_ppo = 1 THEN 'Automático' ELSE 'Manual' END as tipo_ppo,
          created_user as criado_por,
          created_at as data_criacao

        from ppo_rastreamento 
    WHERE 1=1
    ${filtro}
    ORDER BY id ASC
    OFFSET ${(realPage - 1) * pageSize} ROWS
    FETCH NEXT  ${pageSize} ROWS ONLY
    `;
    } else {
      sql = `
        select * from ppo_rastreamento 
    WHERE 1=1
    ${filtro}
    ORDER BY id ASC
    OFFSET ${(realPage - 1) * pageSize} ROWS
    FETCH NEXT  ${pageSize} ROWS ONLY
    `;
    }

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
