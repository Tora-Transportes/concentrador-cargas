import { Request, Response } from "express";
// @ts-ignore: There's no type for this module
import excel from "excel4node";
import { ViewCargaRepository } from "../repositories/CargaRepository";

class ExportController {
  async generateReportFromCargasInScreen(req: Request, res: Response) {
    const filename = `RELATORIO_CARGAS-${new Date().getTime()}.xlsx`;
    const searchResult = await new ViewCargaRepository().run(
      req.query,
      1,
      1200000
    );
    const workbook = new excel.Workbook();
    const ws = workbook.addWorksheet("Relatório");
    const columns = [
      { name: "id", description: "Código da carga", type: "string" },
      { name: "cliente", description: "Cliente", type: "string" },
      { name: "e_lote", description: "E Lote ?", type: "bool" },
      { name: "origem_carga", description: "Origem Carga", type: "string" },
      { name: "destino_carga", description: "Destino Carga", type: "string" },
      { name: "data_entrega", description: "Data Entrega", type: "date" },
      { name: "data_coleta", description: "Data Coleta", type: "date" },
      { name: "tipo_carga", description: "Tipo Material", type: "string" },
      { name: "quantidade", description: "Quantidade", type: "number" },
      { name: "unidade_medida", description: "UN", type: "string" },
      {
        name: "responsavel_cadastro",
        description: "Responsável Cadastro",
        type: "string",
      },
      {
        name: "canal_comunicacao",
        description: "Canal Comunicação",
        type: "string",
      },
      { name: "observacao", description: "Observação", type: "string" },
      { name: "data_cadastro", description: "Data Cadastro", type: "date" },
      {
        name: "data_atualizacao",
        description: "Data Atualização",
        type: "date",
      },
    ];

    const titleStyle = workbook.createStyle({
      font: {
        bold: true,
        underline: true,
      },
      alignment: {
        wrapText: true,
        horizontal: "center",
      },
    });

    for (let i = 1; i <= columns.length; i++) {
      ws.cell(1, i)
        .string(columns[i - 1].description)
        .style(titleStyle);
    }

    for (let i = 0; i < searchResult.results.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        const contentCell = searchResult.results[i][columns[j].name];
        if (!["object", "undefined"].includes(typeof columns[j].type)) {
          switch (columns[j].type) {
            case "string":
              ws.cell(i + 2, j + 1).string(String(contentCell));
              break;
            case "bool":
              ws.cell(i + 2, j + 1).bool(!!contentCell);
              break;
            case "number":
              ws.cell(i + 2, j + 1).number(Number(contentCell));
              break;
            case "date":
              ws.cell(i + 2, j + 1).date(contentCell);
              break;
          }
        }
      }
    }

    return workbook.write(filename, res);
  }
}

export default new ExportController();
