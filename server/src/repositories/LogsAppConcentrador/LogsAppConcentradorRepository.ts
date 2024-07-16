import { mssqlLogs } from "../../database";
import ILogConcentradorApp from "../../models/ILogConcentradorApp";
//import AppError from "../models/AppError";
import TokenAd from "../../models/TokenAd";

interface ILogsAppConcentradorRepository {
  create(calculador: ILogConcentradorApp, user: string): Promise<any>;
  info(): Promise<any>;
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

  async info() {
    async function cargasMatch() {
      return mssqlLogs.raw(`SELECT count(0) as total_cargas_match
      FROM logs_integracao
      WHERE JSON_VALUE(json_envio, '$.cpf_motorista') IS NOT NULL
      AND metodo = 'POST - CRIAR CARGA'`);
    }

    async function cargasSemMatch() {
      return mssqlLogs.raw(`SELECT count(0) as total_cargas_sem_match
      FROM logs_integracao
      WHERE JSON_VALUE(json_envio, '$.cpf_motorista') IS NULL
      AND metodo = 'POST - CRIAR CARGA'`);
    }

    async function cargasTotal() {
      return mssqlLogs.raw(`select count(0) as total_cargas from dbo.logs_integracao
      where metodo = 'POST - CRIAR CARGA'`);
    }

    async function cargasCanceladas() {
      return mssqlLogs.raw(`select count(0) as total_cargas_canceladas from dbo.logs_integracao
      where metodo = 'PATCH - CANCELAR CARGA'`);
    }

    async function errosIntegracao() {
      return mssqlLogs.raw(`select count(*) as integracoes_com_erro from dbo.logs_integracao
       where erro = 1`);
    }

    async function integracaoSemErro() {
      return mssqlLogs.raw(`select count(*) as integracoes_sem_erro from dbo.logs_integracao
      where erro = 0`);
    }

    return Promise.all([
      cargasMatch(),
      cargasSemMatch(),
      cargasTotal(),
      cargasCanceladas(),
      integracaoSemErro(),
      errosIntegracao(),
    ]).then((values) => {
      return {
        info_1: values[0][0],
        info_2: values[1][0],
        info_3: values[2][0],
        info_4: values[3][0],
        info_5: values[4][0],
        info_6: values[5][0],
      };
    });
  }

  async relatorio(
    query: Record<string, any>,
    page = 1,
    pageSize = 5
  ): Promise<any | undefined> {
    const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

    let filtro = "";

    if (isValid(query?.metodo)) {
      filtro = filtro + ` AND metodo LIKE '%${query.metodo}%'`;
    }
    if (isValid(query?.status)) {
      filtro = filtro + ` AND status LIKE '%${query.status}%'`;
    }
    if (isValid(query?.erro)) {
      filtro = filtro + ` AND erro = ${query.erro}`;
    }
    if (isValid(query?.cod_carga)) {
      filtro =
        filtro +
        ` AND (JSON_VALUE(json_envio, '$.requestCode') = '${query.cod_carga}' 
      OR  JSON_VALUE(json_envio, '$.availableFreight') = '${query.cod_carga}')`;
    }

    const total = await mssqlLogs.raw(
      `SELECT COUNT(0) as total FROM logs_integracao
       WHERE 1=1
       ${filtro}
      `
    );

    const sql = `
    SELECT 
    CASE 
      WHEN JSON_VALUE(json_envio, '$.availableFreight') IS NOT NULL THEN JSON_VALUE(json_envio, '$.availableFreight')
      WHEN JSON_VALUE(json_envio, '$.requestCode') IS NOT NULL THEN JSON_VALUE(json_envio, '$.requestCode')
      ELSE 'Sem código de carga'
    END AS 'cod_carga',*
    FROM logs_integracao
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
