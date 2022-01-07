import { Request, Response } from "express";
import useCases from "../domain/UseCaseCoordenada";
import xlsx from "xlsx";
import os from "os";
import path from "path";
import fs from "fs";

class CoordenadasController {
  async search(req: Request, res: Response) {
    return res.json({
      data: await useCases.UseCaseViewCoordenada.run(req.query),
    });
  }

  async export(req: Request, res: Response) {
    const data = await useCases.UseCaseViewCoordenada.run(
      req.query,
      9999999999
    );

    const filename = path.resolve(
      os.tmpdir(),
      `RELATORIO_COORDENADAS-${new Date().getTime()}.xlsx`
    );

    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(data.results);
    xlsx.utils.book_append_sheet(workbook, sheet);

    xlsx.writeFile(workbook, filename, {
      bookType: "xlsx",
      type: "binary",
    });

    const stream = fs.createReadStream(filename);
    stream.pipe(res);
    fs.unlinkSync(filename);
    return res;
  }
}

export default new CoordenadasController();
