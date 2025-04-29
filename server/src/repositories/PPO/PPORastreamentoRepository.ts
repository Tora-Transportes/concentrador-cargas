import { mssqlPPO } from "../../database";
import AppError from "../../models/AppError";
import TokenAd from "../../models/TokenAd";

interface Motorista {
  nome: string;
  cpf: string;
  matricula: string;
  filial: string;
  empresa: string;
  cod_empresa: string;
  status: string;
}

interface ValorItem {
  item: string;
  referencia: string;
  valor: string; // ou `number` se for convertido posteriormente
}

interface ItemSelect {
  value: string;
  label: string;
}

interface DadosMotorista {
  motorista: Motorista;
  motivo: string;
  mes: string;
  ano: string;
  valores: ValorItem[];
  item: ItemSelect;
}

interface IPPORastreamentoRepository {
  create(data: DadosMotorista, user: string): Promise<any>;
}
const isValid = (value: string | null | undefined) =>
  !["", null, undefined, "null", "undefined"].includes(value);

export class PPORastreamentoRepository implements IPPORastreamentoRepository {
  private async getGrupoId(item: string, filial: string): Promise<number> {
    try {
      const result = await mssqlPPO.raw(
        `
        SELECT TOP 1 pg.id AS parametro_grupo_id
        FROM ppo_grupos g
        INNER JOIN ppo_parametros_grupo pg ON pg.grupo_id = g.id
        INNER JOIN ppo_parametros p ON p.id = pg.parametro_id
        WHERE g.filial = ?
          AND pg.ativo = 1
          AND p.nome = ?
        `,
        [filial, item]
      );

      const row = result.recordset?.[0] ?? result[0];
      return row?.parametro_grupo_id ?? 0;
    } catch (error) {
      throw new AppError("Erro ao buscar parametro_grupo_id", 500);
    }
  }

  async create(data: DadosMotorista, user: string) {
    const userName = TokenAd.getClaims(user).name;
    const now = new Date();

    await mssqlPPO.transaction(async (trx) => {
      for (const valor of data.valores) {
        await trx("ppo_resultado").insert({
          nome_motorista: data.motorista.nome,
          cpf: data.motorista.cpf,
          matricula: data.motorista.matricula,
          parametro_grupo_id: await this.getGrupoId(
            valor.item,
            data.motorista.filial
          ),
          dado_verificado: valor.referencia,
          premio: valor.valor,
          apto: 1,
          ppo_cancelado: 0,
          observacao: data.motivo,
          mes_avaliacao: data.mes,
          ano_avaliacao: data.ano,
          hash: null,
          created_at: now,
          updated_at: now,
          ativo: 1,
          tipo: 2,
        });
      }

      await trx("ppo_rastreamento").insert({
        mes: data.mes,
        ano: data.ano,
        cpf: data.motorista.cpf,
        tipo: "insercao",
        tipo_ppo: 2,
        created_user: userName,
        created_at: now,
        observacao: data.motivo,
      });
    });
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
    ORDER BY id DESC
    OFFSET ${(realPage - 1) * pageSize} ROWS
    FETCH NEXT  ${pageSize} ROWS ONLY
    `;
    } else {
      sql = `
        select * from ppo_rastreamento 
    WHERE 1=1
    ${filtro}
    ORDER BY id DESC
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
