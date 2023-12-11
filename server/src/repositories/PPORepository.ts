import database, { mssqlPPO } from "../database";
import IAvaliacao from "../models/IAvaliacao";
import IAtributo from "../models/IAtributo";
import { object } from "yup";

interface IPPORepository {
  avaliacoes(cpf: string): Promise<IAvaliacao[] | undefined>;
  distancia(id: number): Promise<void>;
  infracoes(id: number): Promise<void>;
  interjornada(id: number): Promise<void>;
  atributos(): Promise<IAtributo[] | undefined>;
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
  async atributos(): Promise<any[] | undefined> {
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
}
