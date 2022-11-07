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
}

export class CargaCsnRepository implements ICargaCsnRepository {
  async create(dataRota: ICargasCsn): Promise<void> {
    await database("con_rotas_csn").insert(dataRota);
  }

  async index(ID: number): Promise<ICargasCsn | undefined> {
    return await database("con_rotas_csn").select("*").first().where({ ID });
  }

  async search(): // filter: Record<string, any>,
  // page = 1,
  // pageSize = 5
  Promise<IPaginationResult<ICargasCsn> | undefined> {
    // const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

    // const isValid = (value: string | null | undefined) =>
    //   !["", null, undefined, "null", "undefined"].includes(value);

    //const total = database("con_rotas_csn").count("ID as total").first();
    const results = database("con_rotas_csn").select("*").orderBy("ID", "desc");
    // .limit(pageSize)
    // .offset((realPage - 1) * pageSize);

    // for (const i in filter) {
    //   if (filter[i] !== undefined && filter[i] !== null) {
    //     await results.where(i, filter[i]);
    //     await total.where(i, filter[i]);
    //   }

    // if (isValid(filter?.order_column)) {
    //   results.orderBy(
    //     "con_rota_csn." + String(filter.order_column),
    //     String(filter?.order_direction)
    //   );
    // } else {
    //   results.orderBy("results.observacao", "asc");
    // }

    //const totalRegisters = Number((await total)?.total) || 0;
    const rows: ICargasCsn[] = await results;

    return {
      page: 0, //realPage,
      total_pages: 0, //Math.ceil(totalRegisters / pageSize),
      total_registers: 0, // totalRegisters,
      results: rows,
    };
    //}

    // console.log("AAAAAAA>>>>", filter, page, pageSize);

    // const query1: ICargasCsn[] = [
    //   {
    //     observacao: "betim",
    //     latitude: -147852,
    //     longitude: -5478322,
    //   },
    //   {
    //     observacao: "betim",
    //     latitude: -147852,
    //     longitude: -5478322,
    //   },
    // ];
    // const totalRegisters = 24 || 0;

    // const result = {
    //   page: realPage,
    //   total_pages: Math.ceil(totalRegisters / pageSize),
    //   total_registers: pageSize,
    //   results: query1,
    // };
    // return result;
  }

  async update(ID: number, dadosRota: ICargasCsn): Promise<ICargasCsn> {
    await database("con_rotas_csn").update(dadosRota).where({ ID });

    return dadosRota;
  }

  async delete(ID: number): Promise<void> {
    await database("con_rotas_csn").delete().where({ ID });
  }
}
