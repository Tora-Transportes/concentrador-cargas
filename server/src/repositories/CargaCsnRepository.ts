//import moment from "moment";
import database from "../database";
import ICargasCsn from "../models/ICargasCsn";

import { IPaginationResult } from "./CargaRepository";

interface ICargaCsnRepository {
  create(dataRota: ICargasCsn): Promise<void>;
  search(
    filter: Record<string, any>,
    page: number,
    pageSize: number
  ): Promise<IPaginationResult<ICargasCsn> | undefined>;
  update(ID: number, dadosRota: ICargasCsn): Promise<ICargasCsn>;
  delete(ID: number): Promise<void>;
}

export class CargaCsnRepository implements ICargaCsnRepository {
  async create(dataRota: ICargasCsn): Promise<void> {
    await database("con_rotas_csn").insert(dataRota);
  }

  async index(ID: number): Promise<ICargasCsn | undefined> {
    return await database("con_rotas_csn").select("*").first().where({ ID });
  }

  async search(): Promise<IPaginationResult<ICargasCsn> | undefined> {
    const results = database("con_rotas_csn").select("*").orderBy("ID", "desc");
    const rows: ICargasCsn[] = await results;

    return {
      page: 0,
      total_pages: 0,
      total_registers: 0,
      results: rows,
    };
  }

  async update(ID: number, dadosRota: ICargasCsn): Promise<ICargasCsn> {
    await database("con_rotas_csn").update(dadosRota).where({ ID });

    return dadosRota;
  }

  async delete(ID: number): Promise<void> {
    await database("con_rotas_csn").delete().where({ ID });
  }
}
