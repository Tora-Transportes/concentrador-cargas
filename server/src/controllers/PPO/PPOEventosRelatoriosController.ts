import { Request, Response } from "express";
import { PPOEventosRelatoriosRepository } from "../../repositories/PPO/PPOEventosRelatoriosRepository";
import AppError from "../../models/AppError";
import xlsx from "xlsx";
import fs from "fs";

interface IPPOEventosRelatoriosController {
  relatorioAprovacoes(req: Request, res: Response): Promise<Response>;
  relatorioAprovacoesExcel(req: Request, res: Response): Promise<Response>;
  relatorioEventos(req: Request, res: Response): Promise<Response>;
  relatorioEventosExcel(req: Request, res: Response): Promise<Response>;
}

class PPOEventosRelatoriosController
  implements IPPOEventosRelatoriosController
{
  async relatorioAprovacoes(req: Request, res: Response): Promise<Response> {
    const PERR = new PPOEventosRelatoriosRepository();
    const result = await PERR.relatorioAprovacoes(
      { ...req.query },
      Number(req.query.page),
      Number(req.query.limit) || 5
    );
    return res.json({ data: result });
  }

  async relatorioAprovacoesExcel(
    req: Request,
    res: Response
  ): Promise<Response> {
    const PERR = new PPOEventosRelatoriosRepository();
    const filename = `static/RELATORIO-PPO_EVENTOS_APROVACOES__${new Date().getTime()}.xlsx`;
    const searchResult = await PERR.relatorioAprovacoesExcel(
      { ...req.query },
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

  async relatorioEventos(req: Request, res: Response): Promise<Response> {
    const PERR = new PPOEventosRelatoriosRepository();
    const result = await PERR.relatorioEventos(
      { ...req.query },
      Number(req.query.page),
      Number(req.query.limit) || 5
    );
    return res.json({ data: result });
  }

  async relatorioEventosExcel(req: Request, res: Response): Promise<Response> {
    const PERR = new PPOEventosRelatoriosRepository();
    const filename = `static/RELATORIO-PPO_EVENTOS_SASCAR_${new Date().getTime()}.xlsx`;
    const searchResult = await PERR.relatorioEventosExcel(
      { ...req.query },
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

export default new PPOEventosRelatoriosController();
