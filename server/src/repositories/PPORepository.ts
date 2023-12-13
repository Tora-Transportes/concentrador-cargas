import database, { mssqlPPO } from "../database";
import IAvaliacao from "../models/IAvaliacao";
import IAtributo from "../models/IAtributo";
import AppError from "../models/AppError";

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
}

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

  async resultado_ppo(
    cpf: string,
    mes: string,
    ano: string
  ): Promise<any | undefined> {
    const total = await mssqlPPO.raw(`
      SELECT 'R$ '+CONVERT(VARCHAR, CAST(SUM(CAST(premio as float)) AS MONEY), 1) as valor FROM dbo.ppo_resultado
      WHERE apto = 1
      AND cpf = '${cpf}'
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
    ,CONCAT(r.mes_avaliacao,'/',r.ano_avaliacao) as mes_ano
    FROM dbo.ppo_resultado r
    inner join dbo.ppo_parametros_grupo pg on pg.id = r.parametro_grupo_id
    join dbo.ppo_parametros p on p.id =  pg.parametro_id
    WHERE r.apto = 1
    AND r.cpf = '${cpf}'
    AND r.mes_avaliacao = '${mes}'
    AND r.ano_avaliacao = '${ano}'
  `);
    if (dados_motorista.length == 0) {
      throw new AppError("Sem dados para gerar demonstrativo", 400);
    }

    return {
      dados_motorista: dados_motorista[0],
      valores: valores,
      total: total[0]["valor"],
    };
  }
}
