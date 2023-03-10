import { Request, Response } from "express";
import xlsx from "xlsx";
import fs from "fs";
import os from "os";
import path from "path";
import {
  CargaRepository,
  //IPaginationResult,
  IResultExcel,
} from "../repositories/CargaRepository";
import { ICarga } from "../models/ICargas";
import { calculateDiffDate } from "../Utils/formatData";
import AppError from "../models/AppError";

class ExportController {
  async generateReportFromCargasInScreen(req: Request, res: Response) {
    const { date_execel_inicio, date_execel_fim } = req.query;
    if (date_execel_inicio && date_execel_fim) {
      const diferencaDate = await calculateDiffDate(
        String(date_execel_inicio),
        String(date_execel_fim)
      );

      if (diferencaDate > 31) {
        throw new AppError(
          "O período entre a data de início e fim não pode ser maior que 31 dias!",
          202
        );
      }
    }

    const filename =
      //path.resolve(
      // os.tmpdir(),
      `RELATORIO_CARGAS-${new Date().getTime()}.xlsx`;
    //);

    const searchResult: IResultExcel<ICarga> =
      await new CargaRepository().searchExcel(
        { ...req.query, ativo: 1 },
        1200000
      );

    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(searchResult.results);

    xlsx.utils.book_append_sheet(workbook, sheet);

    await xlsx.writeFile(workbook, filename, {
      bookType: "xlsx",
      type: "binary",
    });

    const stream = fs.createReadStream(filename);
    stream.pipe(res);
    if (fs.existsSync(filename)) fs.unlinkSync(filename);
    return res;
  }
}

export default new ExportController();
