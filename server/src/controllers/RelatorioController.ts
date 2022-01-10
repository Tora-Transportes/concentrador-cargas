import { Request, response, Response } from "express";
import { ReportTotalizadores } from "../reports/totalizadores";
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

    return res.json({ data: await report.generate() });
  }
}

export default new RelatorioController();
