import database, { mssqlPPO } from "../database";
import IAvaliacao from "../models/IAvaliacao";
import IAtributo from "../models/IAtributo";

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
    const atributos = await mssqlPPO("INFORMATION_SCHEMA.COLUMNS AS COLUNAS")
      .select(["TABELAS.TABLE_NAME as tabela", "COLUNAS.COLUMN_NAME as coluna"])
      .innerJoin(
        "INFORMATION_SCHEMA.TABLES  AS TABELAS",
        "TABELAS.TABLE_NAME",
        "COLUNAS.TABLE_NAME"
      )
      .whereNotIn("COLUNAS.COLUMN_NAME", [
        "id",
        "data_insercao",
        "created_at",
        "updated_at",
      ])
      .whereNotIn("TABELAS.TABLE_NAME", [
        "ppo_grupos",
        "ppo_parametros",
        "ppo_parametros_grupo",
      ])
      .andWhere(" TABELAS.TABLE_TYPE", "BASE TABLE");
    const tabelasAgrupadas: any = {};

    atributos.forEach((objeto) => {
      const tabela = objeto.tabela;
      if (!tabelasAgrupadas[tabela]) {
        tabelasAgrupadas[tabela] = [];
      }
      tabelasAgrupadas[tabela].push({ coluna: objeto.coluna });
    });

    const arrayDeTabelas = Object.entries(tabelasAgrupadas).map(
      ([tabela, colunas]) => ({
        tabela,
        colunas,
      })
    );

    return arrayDeTabelas;
  }
}
