import { Request, Response } from "express";
import { PPORastreamentoRepository } from "../../repositories/PPO/PPORastreamentoRepository";
import xlsx from "xlsx";
import fs from "fs";
import AppError from "../../models/AppError";

interface IPPORastreamentoController {
  relatorio(req: Request, res: Response): Promise<Response>;
  relatorioExcel(req: Request, res: Response): Promise<Response>;
}

class PPORastreamentoController implements IPPORastreamentoController {
  async relatorio(req: Request, res: Response): Promise<Response> {
    const ppo = new PPORastreamentoRepository();
    const result = await ppo.search(
      { ...req.query },
      Number(req.query.page),
      Number(req.query.limit) || 5
    );
    return res.json({ data: result });
  }

  async relatorioExcel(req: Request, res: Response): Promise<Response> {
    const ppoRepository = new PPORastreamentoRepository();
    const filename = `static/RELATORIO-RASTREABILIDADE-PPO-${new Date().getTime()}.xlsx`;
    const searchResult = await ppoRepository.search(
      { ...req.query },
      0,
      1200000
    );

    if (searchResult.results.length == 0) {
      throw new AppError(
        "Não foram encontrados dados com essas informações no filtro de data.",
        202
      );
    }

    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(searchResult.results);

    xlsx.utils.book_append_sheet(workbook, sheet);

    await xlsx.writeFile(workbook, filename, {
      bookType: "xlsx",
      type: "binary",
    });

    const stream = fs.createReadStream(filename);

    stream.once("end", () => {
      if (fs.existsSync(filename)) {
        fs.unlink(filename, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    });

    stream.pipe(res);

    return res;
  }
}

export default new PPORastreamentoController();
