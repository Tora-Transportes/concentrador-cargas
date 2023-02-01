import database from "../database";
import IPontosParada from "../models/IPontosDeParada";

interface IPontoParadaRepository {
  create(dataParada: IPontosParada): Promise<void>;
  index(ID: number): Promise<IPontosParada | undefined>;
  search(): Promise<IPontosParada[] | undefined>;
  getOfIdRotasCsn(ID: number): Promise<IPontosParada | undefined>;
  getOfIdConCarga(ID: number): Promise<IPontosParada[] | undefined>;
  update(ID: number, dataParada: IPontosParada): Promise<void>;
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

  async search(): Promise<IPontosParada[] | undefined> {
    return await database("con_pontos_parada").select("*");
  }

  async getOfIdRotasCsn(ID: number): Promise<IPontosParada | undefined> {
    return await database("con_pontos_parada")
      .select("*")
      .first()
      .where("ID_ROTAS_CSN", ID);
  }
  async getOfIdConCarga(ID: number): Promise<IPontosParada[] | undefined> {
    return await database("con_pontos_parada")
      .select([
        "COLETA_EFETIVA_POSTO30",
        "COLETA_EFETIVA_MUNDO",
        "COLETA_EFETIVA_PEACAO",
        "SAIDA_EFETIVA_COLETA",
        "ENTREGA_EFETIVA",
        "SAIDA_EFETIVA_ENTREGA",
        "TEMP_SERV_LOCAL_COLETA",
      ])
      .where("ID_CON_CARGAS", ID);
  }

  async update(ID: number, dataParada: IPontosParada): Promise<void> {
    await database("con_pontos_parada").update(dataParada).where({ ID });
  }

  async delete(ID: number): Promise<void> {
    await database("con_pontos_parada").delete().where({ ID });
  }
}
