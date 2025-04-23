import { mssqlPPO, mssqlPPOView } from "../../database";
import AppError from "../../models/AppError";
import TokenAd from "../../models/TokenAd";

interface IPPOMotoristasGruposRepository {
  findByName(nome: string): Promise<IGrupoMotorista | undefined>;
  create(grupoMotorista: IGrupoMotorista, user: string): Promise<any>;
  index(id: string): Promise<IGrupoMotorista | undefined>;
  search(filter: Record<string, any>): Promise<any[]>;
  delete(id: number, user: string): Promise<void>;
  motoristasAtivos(): Promise<any[]>;
  driverIsLinked(cpf: string): Promise<IMotorisLiked[]>;
  relatorioHistoricoMovimentacoes(
    query: Record<string, any>,
    page?: number,
    pageSize?: number
  ): Promise<any | undefined>;
}

interface IMotorisLiked {
  id: number;
  cpf: string;
  nome: string;
  nome_grupo: string;
  grupo_id: number;
}

interface IGrupoMotorista {
  grupo_id: number;
  nome: string;
  cpf: string;
  codigo_motorista: string;
  filial: string;
  empresa: string;
  codigo_empresa: string;
  status: string;
  cod_usu_create: string;
}

const isValid = (value: string | null | undefined) =>
  !["", null, undefined, "null", "undefined"].includes(value);

export class PPOMotoristasGruposRepository
  implements IPPOMotoristasGruposRepository
{
  async index(id: string): Promise<IGrupoMotorista | undefined> {
    return await mssqlPPO("dbo.ppo_grupo_motorista").first().where("id", id);
  }

  async motoristasAtivos() {
    return await mssqlPPOView.raw(`
      SELECT RA_NOME as nome
        ,RA_CIC as cpf
        ,RA_MAT as matricula
        ,M0_FILIAL as filial
        ,EMPRESA as empresa
        ,CODIGO_EMPRESA as cod_empresa
        ,TIPO_STATUS as status 
      FROM dbo.VW_DADO_MOTORISTA_PPO
`);
  }

  async create(grupo: IGrupoMotorista, user: string) {
    const hoje = new Date();
    const dia = hoje.getDate();

    // Bloqueio entre os dias 1 e 5
    if (dia >= 1 && dia <= 5) {
      throw new AppError(
        "Alterações de grupo estão bloqueadas entre os dias 1 e 5 devido ao cálculo do PPO.",
        400
      );
    }

    const driverIsLinked = await this.driverIsLinked(grupo.cpf);
    grupo.cod_usu_create = TokenAd.getClaims(user).name;

    if (driverIsLinked?.length > 0) {
      await this.delete(driverIsLinked[0].id, user, "moved");
    }

    // Inserir novo grupo e obter o ID gerado
    const [novoGrupoId] = await mssqlPPO("dbo.ppo_grupo_motorista")
      .insert(grupo)
      .returning("id"); // retorna o ID inserido

    await this.createHistory(
      novoGrupoId,
      "create",
      grupo.cod_usu_create,
      grupo.cpf
    );

    return novoGrupoId;
  }

  async delete(id: number, user: string, status?: string): Promise<void> {
    const userNameChanged = TokenAd.getClaims(user).name;

    await mssqlPPO("dbo.ppo_grupo_motorista")
      .update({ active: 0 })
      .where({ id });

    const userObj = await this.index(id.toString());
    if (userObj) {
      await this.createHistory(
        String(id),
        status ? status : "delete",
        userNameChanged,
        userObj?.cpf
      );
    }
  }

  async findByName(nome: string): Promise<IGrupoMotorista | undefined> {
    return mssqlPPO("dbo.ppo_grupo_motorista")
      .select("*")
      .where("nome", nome)
      .first();
  }

  async driverIsLinked(cpf: string): Promise<IMotorisLiked[]> {
    return mssqlPPO.raw(`
      SELECT pgm.id, pgm.nome,pgm.cpf,pg.nome as nome_grupo,pgm.grupo_id FROM ppo_grupo_motorista pgm
      INNER JOIN ppo_grupos pg on pg.id = pgm.grupo_id
      WHERE pgm.cpf = '${cpf}'
      AND pgm.active = 1
    `);
  }

  private async createHistory(
    motoristas_grupos_id: string,
    status: string,
    user_created: string,
    cpf_mot: string
  ) {
    const ultimaMovimetacao = await mssqlPPO.raw(`
      SELECT TOP 1 pgmh.id as id
          FROM ppo_grupo_motorista_historico pgmh
      INNER JOIN ppo_grupo_motorista pgm ON pgm.id = pgmh.motoristas_grupos_id
      WHERE pgm.cpf = '${cpf_mot}'
       ORDER BY pgmh.id DESC;
    `);

    console.log("ultimaMovimetacao: ", ultimaMovimetacao);

    await mssqlPPO("dbo.ppo_grupo_motorista_historico").insert({
      motoristas_grupos_id,
      tipo_movimentacao: status,
      user_created,
      ultima_movimentacao_id:
        ultimaMovimetacao.length > 0 ? ultimaMovimetacao[0].id : null,
    });
  }

  async search(filter: Record<string, any>) {
    const query = mssqlPPO("dbo.ppo_grupo_motorista")
      .select("*")
      .orderBy("nome", "asc");
    for (const i in filter) {
      if (filter[i] !== undefined && filter[i] !== null) {
        query.where(i, filter[i]);
      }
    }
    return query;
  }

  async relatorioHistoricoMovimentacoes(
    query: Record<string, any>,
    page = 1,
    pageSize = 5
  ): Promise<any | undefined> {
    const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

    let filtro = "";

    if (isValid(query?.cpf)) {
      filtro = filtro + ` AND pgm.cpf LIKE '%${query.cpf}%'`;
    }
    if (isValid(query?.nome)) {
      filtro = filtro + ` AND pgm.nome LIKE '%${query.nome}%'`;
    }

    const total = await mssqlPPO.raw(
      `SELECT COUNT(0) as total 
          FROM ppo_grupo_motorista pgm
      INNER JOIN ppo_grupo_motorista_historico pgmh ON pgmh.motoristas_grupos_id = pgm.id
      INNER JOIN ppo_grupos pg ON pg.id = pgm.grupo_id
           WHERE 1=1
           ${filtro}
          `
    );

    const sql = `    
      SELECT 
          pg.nome as nome_grupo,
          pgm.nome,
          pgm.cpf,
          pgm.filial,
          pgm.empresa,
          pgm.codigo_empresa,
          pgm.status as status_mot,
          pgm.created_at as pgm_created_at,
          pgm.cod_usu_create as pgm_cod_usu,
          pgmh.id as pgmh_id,
          pgmh.tipo_movimentacao,
          pgmh.ultima_movimentacao_id,
          pgmh.user_created as pgmh_cod_usu,
          pgmh.created_at as pgmh_created_at
      FROM ppo_grupo_motorista pgm
      INNER JOIN ppo_grupo_motorista_historico pgmh ON pgmh.motoristas_grupos_id = pgm.id
      INNER JOIN ppo_grupos pg ON pg.id = pgm.grupo_id
      WHERE 1=1
      ${filtro}
      ORDER BY pgmh.created_at ASC
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
