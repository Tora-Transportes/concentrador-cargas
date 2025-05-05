import { Request, Response } from "express";
import { PPOMotoristasGruposRepository } from "../../repositories/PPO/PPOMotoristasGruposRepository";
import AppError from "../../models/AppError";
import xlsx from "xlsx";
import fs from "fs";

interface IPPOMotoristasGruposController {
  index(req: Request, res: Response): Promise<Response>;
  create(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
  motoristasAtivos(req: Request, res: Response): Promise<Response>;
  relatorioHistoricoMovimentacoes(
    req: Request,
    res: Response
  ): Promise<Response>;
}

class PPOMotoristasGruposController implements IPPOMotoristasGruposController {
  async index(req: Request, res: Response): Promise<Response> {
    const pmg = new PPOMotoristasGruposRepository();
    const result = await pmg.search(req.query);
    return res.json({ data: result });
  }

  async motoristasAtivos(req: Request, res: Response): Promise<Response> {
    const pmg = new PPOMotoristasGruposRepository();
    const result = await pmg.motoristasAtivos();
    return res.json({ data: result });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const pmg = new PPOMotoristasGruposRepository();
    const result = await pmg.create(
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const pmg = new PPOMotoristasGruposRepository();
    const { id } = req.params;
    const result = await pmg.delete(
      Number(id),
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async driverLiked(req: Request, res: Response): Promise<Response> {
    const pmg = new PPOMotoristasGruposRepository();
    const { cpf } = req.params;
    const result = await pmg.driverIsLinked(cpf);
    return res.json({ data: result });
  }

  async relatorioHistoricoMovimentacoes(
    req: Request,
    res: Response
  ): Promise<Response> {
    const pmg = new PPOMotoristasGruposRepository();
    const result = await pmg.relatorioHistoricoMovimentacoes(
      { ...req.query },
      Number(req.query.page),
      Number(req.query.limit) || 5
    );
    return res.json({ data: result });
  }
  async relatorioExcel(req: Request, res: Response): Promise<Response> {
    const pmg = new PPOMotoristasGruposRepository();
    const filename = `static/RELATORIO-MOVIMENTACOES-MOTORISTAS-${new Date().getTime()}.xlsx`;
    const searchResult = await pmg.relatorioHistoricoMovimentacoes(
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

export default new PPOMotoristasGruposController();
