import { mssqlPPO } from "../../database";

interface IPPOEventosRelatoriosRepository {
  relatorioAprovacoes(
    query: Record<string, any>,
    page?: number,
    pageSize?: number
  ): Promise<any | undefined>;

  relatorioAprovacoesExcel(
    query: Record<string, any>,
    pageSize?: number
  ): Promise<any | undefined>;
}

const isValid = (value: string | null | undefined) =>
  !["", null, undefined, "null", "undefined"].includes(value);

export class PPOEventosRelatoriosRepository
  implements IPPOEventosRelatoriosRepository
{
  async relatorioAprovacoes(
    query: Record<string, any>,
    page = 1,
    pageSize = 5
  ): Promise<any | undefined> {
    const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

    let filtro = "";

    if (isValid(query?.cpf)) {
      filtro = filtro + ` AND cpf LIKE '%${query.cpf}%'`;
    }
    if (isValid(query?.matricula)) {
      filtro = filtro + ` AND matricula LIKE '%${query.matricula}%'`;
    }
    if (isValid(query?.nome)) {
      filtro = filtro + ` AND nome LIKE '%${query.nome}%'`;
    }
    if (isValid(query?.status_aprovacao)) {
      filtro = filtro + ` AND status_aprovacao = ${query.status_aprovacao}`;
    }
    if (isValid(query?.aprovado)) {
      filtro = filtro + ` AND aprovado = ${query.aprovado}`;
    }
    if (isValid(query?.mes)) {
      filtro = filtro + ` AND  MONTH(created_at) = ${query.mes}`;
    }
    if (isValid(query?.ano)) {
      filtro = filtro + ` AND YEAR(created_at) = ${query.ano}`;
    }

    const total = await mssqlPPO.raw(
      `SELECT COUNT(0) as total FROM dbo.ppo_sascar_eventos_aprovacao
         WHERE 1=1
         ${filtro}
        `
    );

    const sql = `    
    select 
    MONTH(created_at) as mes,
    YEAR(created_at) as ano,
    * from ppo_sascar_eventos_aprovacao
    WHERE 1=1
    ${filtro}
    ORDER BY id ASC
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

  async relatorioAprovacoesExcel(
    query: Record<string, any>,
    pageSize = 5
  ): Promise<any | undefined> {
    let filtro = "";

    console.log(query);

    if (isValid(query?.cpf)) {
      filtro = filtro + ` AND cpf LIKE '%${query.cpf}%'`;
    }
    if (isValid(query?.matricula)) {
      filtro = filtro + ` AND matricula LIKE '%${query.matricula}%'`;
    }
    if (isValid(query?.nome)) {
      filtro = filtro + ` AND nome LIKE '%${query.nome}%'`;
    }
    if (isValid(query?.status_aprovacao)) {
      filtro = filtro + ` AND status_aprovacao = ${query.status_aprovacao}`;
    }
    if (isValid(query?.aprovado)) {
      filtro = filtro + ` AND aprovado = ${query.aprovado}`;
    }
    if (isValid(query?.mes)) {
      filtro = filtro + ` AND  MONTH(created_at) = ${query.mes}`;
    }
    if (isValid(query?.ano)) {
      filtro = filtro + ` AND YEAR(created_at) = ${query.ano}`;
    }

    const results = mssqlPPO.raw(`
    select 
    MONTH(created_at) as mes,
    YEAR(created_at) as ano,
	  cpf,
	  matricula,
	  nome,
	  horas,
	  id_pacote_ini,
	  id_pacote_fim,
	  CASE
        WHEN status_aprovacao = 0 THEN 'Aguardando aprovação supervisor'
        WHEN status_aprovacao = 1 THEN 'Aprovado Supervisor aguardando Gerente'
        WHEN status_aprovacao = 2 THEN 'Aprovado Supervisor e Gerente'
		    WHEN status_aprovacao = 3 THEN 'Reprovado pelo Superviso'
		    WHEN status_aprovacao = 4 THEN 'Reprovado pelo Gerente'
    ELSE 'Indefinido'
    END as status,
	  CASE
        WHEN aprovado = 0 THEN 'Não'
        WHEN aprovado = 1 THEN 'Sim'
        ELSE 'Indefinido'
    END as aprovado,
	  obs_supervisor as 'Obs. Supervisor',
	  obs_gerente  as 'Obs. Gerente',
	  cod_usu_create as 'Criado por',
	  created_at as 'Horário criado',
	  cod_usu_update as 'Atualizado por',
	  updated_at as 'Horário atualizado'
    from ppo_sascar_eventos_aprovacao
    WHERE 1=1
    ${filtro}
    ORDER BY id ASC
    OFFSET 0 ROWS
    FETCH NEXT  ${pageSize} ROWS ONLY
    `);

    const rows = await results;
    return {
      results: rows,
    };
  }
}
