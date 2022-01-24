import { Request, Response } from "express";
import { ReportTotalizadores } from "../reports/totalizadores";
import { ReportDetalhesTotalizadores } from "../reports/dadosTotalizadores";
import { ReportResumoPorDia } from "../reports/resumoPorDia";
import fs from "fs";
import AppError from "../models/AppError";
class RelatorioController {
  /*
    {
        "cargas_ativas": 0,
        "cargas_desativadas": 0,
        "cadastro_portal": 0,
        "cadastro_manual": 0,
        "geral" : [
            {"total": 0, "fk_situacao": 1, "descricao": "Teste 1"},
            {"total": 0, "fk_situacao": 2, "descricao": "Teste 2"}
        ]
    }
    */
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
    fs.unlinkSync(filename);
    return res;
  }

  async gerarResumoDiario(req: Request, res: Response) {
    const report = new ReportResumoPorDia();
    const { fk_filial, data_inicio, data_final } = req.query;
    if (!fk_filial || !data_inicio || !data_final) {
      throw new AppError("Parametros inválidos para gerar o relatório", 400);
    }

    return res.json({
      data: await report.generate({
        fk_filial: String(fk_filial),
        data_inicio: String(data_inicio),
        data_final: String(data_final),
      }),
    });
  }
}

export default new RelatorioController();
