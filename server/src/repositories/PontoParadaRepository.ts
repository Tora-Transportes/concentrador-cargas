import database from "../database";
import IPontosParada from "../models/IPontosDeParada";

interface IPontoParadaRepository {
  create(dataParada: IPontosParada): Promise<void>;
  index(ID: number): Promise<IPontosParada | undefined>;
  update(ID: number, dataParada: IPontosParada): Promise<IPontosParada>;
}

export class PontoParadaRepository implements IPontoParadaRepository {
  async create(dataParada: IPontosParada): Promise<void> {
    await database("con_pontos_parada").insert(dataParada);
  }

  async index(ID: number): Promise<IPontosParada | undefined> {
    return await database("con_pontos_parada")
      .select("*")
      .first()
      .where({ ID });
  }
  async getOfIdRotasCsn(ID: number): Promise<IPontosParada | undefined> {
    return await database("con_pontos_parada")
      .select("*")
      .first()
      .where("ID_ROTAS_CSN", ID);
  }

  async update(ID: number, dataParada: IPontosParada): Promise<IPontosParada> {
    await database("con_pontos_parada").update(dataParada).where({ ID });

    return dataParada;
  }

  async delete(ID: number): Promise<void> {
    await database("con_pontos_parada").delete().where({ ID });
  }
}
