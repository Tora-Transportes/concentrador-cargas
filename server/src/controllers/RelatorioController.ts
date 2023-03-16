import { Request, Response } from "express";
import { ReportTotalizadores } from "../reports/totalizadores";
import { ReportDetalhesTotalizadores } from "../reports/dadosTotalizadores";
import { ReportResumoPorDia } from "../reports/resumoPorDia";
import { TempoMedioAprovacaoGr } from "../reports/tempoMedioAprovacaoGr";

import fs from "fs";
import AppError from "../models/AppError";
class RelatorioController {
  async gerarTotalizadores(req: Request, res: Response) {
    const report = new ReportTotalizadores();
    return res.json({
      data: await report.generate(req.query),
    });
  }

  async detalhesTotalizadores(req: Request, res: Response) {
    const filename = `DETALHES_TOTALIZADORES-${Math.ceil(
      Math.random() * 100
    )}.xlsx`;
    const report = new ReportDetalhesTotalizadores();
    await report.generate(req.params.key, req.query, filename);
    const stream = fs.createReadStream(filename);
    stream.pipe(res);

    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }
    return new Promise((resolve) => {
      res.on("close", () => {
        resolve(res);
      });
    });
  }

  async gerarResumoDiario(req: Request, res: Response) {
    const report = new ReportResumoPorDia();
    const { fk_filial, data_inicio, data_final, carga_csn, carga_app } =
      req.query;
    if (!fk_filial || !data_inicio || !data_final) {
      throw new AppError("Parametros inválidos para gerar o relatório", 400);
    }

    return res.json({
      data: await report.generate({
        fk_filial: String(fk_filial),
        data_inicio: String(data_inicio),
        data_final: String(data_final),
        carga_csn: String(carga_csn),
        carga_app: String(carga_app),
      }),
    });
  }

  async gerarResumoTempoMedioAtendimentoGr(req: Request, res: Response) {
    const report = new TempoMedioAprovacaoGr();
    return res.json({
      data: await report.generate(),
    });
  }
}

export default new RelatorioController();
