import database, { mssqlPPO } from "../database";
import IAvaliacao from "../models/IAvaliacao";

interface IPPORepository {
  avaliacoes(cpf: string): Promise<IAvaliacao[] | undefined>;
  distancia(id: number): Promise<void>;
  infracoes(id: number): Promise<void>;
  interjornada(id: number): Promise<void>;
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
}
