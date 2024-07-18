import { mssqlLogs } from "../../database";
import oracle from "../../database";
import ILogConcentradorApp from "../../models/ILogConcentradorApp";
//import AppError from "../models/AppError";
import TokenAd from "../../models/TokenAd";

interface ILogsAppConcentradorRepository {
  create(calculador: ILogConcentradorApp, user: string): Promise<any>;
  info(query: Record<string, any>): Promise<any>;
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

  async info(query: Record<string, any>) {
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

    async function historico30diasApp() {
      return mssqlLogs.raw(`
WITH DateRange AS (
    SELECT CAST(GETDATE() AS DATE) AS dia
    UNION ALL
    SELECT DATEADD(DAY, -1, dia)
    FROM DateRange
    WHERE DATEADD(DAY, -1, dia) >= DATEADD(DAY, -30, GETDATE())
)

SELECT 
    d.dia,
    COALESCE(SUM(CASE WHEN l.id IS NOT NULL AND JSON_VALUE(l.json_envio, '$.placa_veiculo') IS NULL THEN 1 ELSE 0 END), 0) AS total_sem_match,
    COALESCE(SUM(CASE WHEN l.id IS NOT NULL AND JSON_VALUE(l.json_envio, '$.placa_veiculo') IS NOT NULL THEN 1 ELSE 0 END), 0) AS total_com_match,
    'POST - CRIAR CARGA' AS metodo
FROM 
    DateRange d
LEFT JOIN 
    [dbo].[logs_integracao] l
    ON CAST(l.created_at AS DATE) = d.dia
    AND l.metodo = 'POST - CRIAR CARGA'
    AND l.fk_filial = '${query.fk_filial}'
WHERE 
    d.dia >= DATEADD(DAY, -30, GETDATE())
GROUP BY 
    d.dia
ORDER BY 
    d.dia

OPTION (MAXRECURSION 0);
`);
    }

    async function historico30dias() {
      return oracle.raw(`
      SELECT 
      COUNT(*) AS "total_registros",
      TRUNC("data_cadastro") AS "dia"
  FROM 
      "con_cargas"
  WHERE 
      "data_cadastro" >= TRUNC(SYSDATE) - 30 
      AND "carga_app" <> 1
      AND "fk_filial" = ${query.fk_filial}
  GROUP BY 
      TRUNC("data_cadastro")
  ORDER BY 
      "dia"
  `);
    }

    return Promise.all([
      cargasMatch(),
      cargasSemMatch(),
      cargasTotal(),
      cargasCanceladas(),
      integracaoSemErro(),
      errosIntegracao(),
      historico30diasApp(),
      historico30dias(),
    ]).then((values) => {
      const info_7 = values[6]; // historico30diasApp
      const info_8 = values[7]; // historico30dias
      const dadosMerged: any = [];

      for (let i = 0; i < info_7.length; i++) {
        const element7 = info_7[i];
        const data = new Date(element7.dia);
        const dateString7 = data.toISOString().substring(0, 10);

        let achou = false;

        for (let j = 0; j < info_8.length; j++) {
          const element8 = info_8[j];
          const data8 = new Date(element8.dia);
          const dateString8 = data8.toISOString().substring(0, 10);

          if (dateString7 === dateString8) {
            dadosMerged.push({
              dia: element7.dia,
              total_sem_match: element7.total_sem_match,
              total_com_match: element7.total_com_match,
              total_fora_app: element8.total_registros,
              metodo: "POST - CRIAR CARGA",
            });
            achou = true;
            break; // Sai do loop interno
          }
        }
        if (!achou) {
          dadosMerged.push({
            dia: element7.dia,
            total_sem_match: element7.total_sem_match,
            total_com_match: element7.total_com_match,
            total_fora_app: 0,
            metodo: "POST - CRIAR CARGA",
          });
        }
      }

      return {
        info_1: values[0][0],
        info_2: values[1][0],
        info_3: values[2][0],
        info_4: values[3][0],
        info_5: values[4][0],
        info_6: values[5][0],
        info_7: dadosMerged,
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
