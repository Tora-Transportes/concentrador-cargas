import { mssqlLogs } from "../../database";
import ILogConcentradorApp from "../../models/ILogConcentradorApp";
//import AppError from "../models/AppError";
import TokenAd from "../../models/TokenAd";

interface ILogsAppConcentradorRepository {
  create(calculador: ILogConcentradorApp, user: string): Promise<any>;
  relatorio(
    query: Record<string, any>,
    page?: number,
    pageSize?: number
  ): Promise<any | undefined>;
}

const isValid = (value: string | null | undefined) =>
  !["", null, undefined, "null", "undefined"].includes(value);

export class LogsAppConcentradorRepository
  implements ILogsAppConcentradorRepository
{
  async create(calculador: ILogConcentradorApp, user: string) {
    calculador.cod_usu_create = TokenAd.getClaims(user).name;
    return mssqlLogs("dbo.logs_integracao").insert(calculador);
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

    const total = await mssqlLogs.raw(
      `SELECT COUNT(0) as total FROM logs_integracao
       WHERE 1=1
       ${filtro}
      `
    );

    const sql = `
    SELECT * FROM logs_integracao
    WHERE 1=1
    ${filtro}
    ORDER BY id DESC
    OFFSET ${(realPage - 1) * pageSize} ROWS
    FETCH NEXT  ${pageSize} ROWS ONLY
    `;
    const results = await mssqlLogs.raw(sql);
    const totalRegisters = Number(total[0]["total"]) || 0;

    return {
      page: realPage,
      total_pages: Math.ceil(totalRegisters / pageSize),
      total_registers: totalRegisters,
      results: results,
    };
  }
}
