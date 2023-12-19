import { Request, Response } from "express";
import { PPORepository } from "../repositories/PPORepository";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { format } from "date-fns";
import PDFPrinter from "pdfmake";
import xlsx from "xlsx";
import fs from "fs";
import AppError from "../models/AppError";
import { formataCPF } from "../Utils/utlis";

const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

interface IPPOController {
  avaliacoes(req: Request, res: Response): Promise<Response>;
  distancia(req: Request, res: Response): Promise<Response>;
  infracoes(req: Request, res: Response): Promise<Response>;
  interjornada(req: Request, res: Response): Promise<Response>;
  atributos(req: Request, res: Response): Promise<Response>;
  demonstrativo(req: Request, res: Response): Promise<any>;
  relatorio(req: Request, res: Response): Promise<Response>;
  relatorioExcel(req: Request, res: Response): Promise<Response>;
  demonstrativos(req: Request, res: Response): Promise<Response>;
}

class PPOController implements IPPOController {
  async demonstrativos(req: Request, res: Response): Promise<Response> {
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.demonstrativos(req.query);
    return res.json({ data: result });
  }

  async relatorioExcel(req: Request, res: Response): Promise<Response> {
    const ppoRepository = new PPORepository();
    const filename = `RELATORIO-PPO_${new Date().getTime()}.xlsx`;
    const searchResult = await ppoRepository.searchExcel(
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
    stream.pipe(res);
    if (fs.existsSync(filename)) fs.unlinkSync(filename);
    return res;
  }

  async relatorio(req: Request, res: Response): Promise<Response> {
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.relatorio_motoristas(
      { ...req.query },
      Number(req.query.page),
      Number(req.query.limit) || 5
    );
    return res.json({ data: result });
  }

  async avaliacoes(req: Request, res: Response): Promise<Response> {
    const { cpf, data_inicio, data_fim } = req.query;
    const ppoRepository = new PPORepository();
    //const { id } = req.params;
    const result = await ppoRepository.avaliacoes(String(cpf));
    return res.json({ data: result });
  }

  async distancia(req: Request, res: Response): Promise<Response> {
    const { cpf, data_inicio, data_fim } = req.query;
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.distancia(
      String(cpf),
      String(data_inicio),
      String(data_fim)
    );
    return res.json({ data: result });
  }

  async infracoes(req: Request, res: Response): Promise<Response> {
    const { cpf, data_inicio, data_fim } = req.query;
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.infracoes(
      String(cpf),
      String(data_inicio),
      String(data_fim)
    );
    return res.json({ data: result });
  }

  async interjornada(req: Request, res: Response): Promise<Response> {
    const { cpf, data_inicio, data_fim } = req.query;
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.interjornada(
      String(cpf),
      String(data_inicio),
      String(data_fim)
    );
    return res.json({ data: result });
  }

  async atributos(req: Request, res: Response): Promise<Response> {
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.atributos();
    return res.json({ data: result });
  }

  async demonstrativo(req: Request, res: Response): Promise<any> {
    const { cpf, mes, ano } = req.query;
    const ppoRepository = new PPORepository();
    const dataAtual = new Date();
    const dataFormatada = format(dataAtual, "dd/MM/yyyy HH:mm:ss");
    const date = new Date(`${mes}/01/${ano}`);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const periodoApu = `01/${mes}/${ano} à ${lastDay.toLocaleDateString()}`;
    const result = await ppoRepository.resultado_ppo(
      formataCPF(String(cpf)),
      String(mes),
      String(ano)
    );
    const body_dados_motorista = [
      [
        {
          text: "Nome",
          style: "dadosMotorista",
        },
        {
          text: result["dados_motorista"]["nome"],
          style: "dadosMotorista",
        },
      ],
      [
        {
          text: "Matricula",
          style: "dadosMotorista",
        },
        {
          text: result["dados_motorista"]["matricula"],
          style: "dadosMotorista",
        },
      ],
      [
        {
          text: "CPF",
          style: "dadosMotorista",
        },
        {
          text: result["dados_motorista"]["cpf"],
          style: "dadosMotorista",
        },
      ],
      [
        {
          text: "PPO Cancelado",
          style: "dadosMotorista",
        },
        {
          text: result["dados_motorista"]["cancelado"],
          style: "dadosMotorista",
        },
      ],
      [
        {
          text: "Motivo Cancelamento",
          style: "dadosMotorista",
        },
        {
          text: result["dados_motorista"]["observacao"],
          style: "dadosMotorista",
        },
      ],
      [
        {
          text: "Mês/Ano Demonstrativo",
          style: "dadosMotorista",
        },
        {
          text: result["dados_motorista"]["mes_ano"],
          style: "dataDemonstrativo",
        },
      ],
      [
        {
          text: "Período de Apuração",
          style: "dadosMotorista",
        },
        {
          text: periodoApu,
          style: "dataDemonstrativo",
        },
      ],
    ];

    const dados_valores: any = [];

    dados_valores.push([
      {
        text: "DESCRIMINÇÃO",
        style: "titleValores",
      },
      {
        text: "REFERÊNCIA",
        style: "titleValores",
      },
      {
        text: "VALOR",
        style: "titleValores",
      },
    ]);

    result["valores"].forEach((valor: any) => {
      dados_valores.push([
        {
          text: valor["nome"],
          style: "dadosMotorista",
        },
        {
          text: valor["dado_verificado"],
          style: "dadosValores",
        },
        {
          text: valor["valor"],
          style: "dadosValores",
        },
      ]);
    });

    const docDefinition: TDocumentDefinitions = {
      defaultStyle: { font: "Helvetica" },
      content: [
        {
          text: "Data Processamento: " + dataFormatada,
          style: "dataTopo",
        },
        {
          style: "tableExample",
          table: {
            widths: ["*", "auto"],
            body: [
              [
                {
                  text: "Demonstrativo PPO",
                  style: "header",
                },
                {
                  image: "building",
                  width: 70,
                },
              ],
            ],
          },
        },
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: "DADOS",
                  style: "titleDadosMotorista",
                },
              ],
            ],
          },
        },
        {
          table: {
            widths: [100, "*"],
            heights: 20,
            body: body_dados_motorista,
          },
        },
        {
          style: "tableValores",
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: "VALORES",
                  style: "titleDadosMotorista",
                },
              ],
            ],
          },
        },
        {
          table: {
            widths: [100, "*", 100],
            heights: 20,
            body: dados_valores,
          },
        },
        {
          style: "totalValores",
          table: {
            widths: ["*", 100],
            heights: 20,
            body: [
              [
                {
                  text: "TOTAL",
                  style: "titleValores",
                },
                {
                  text: result["total"],
                  style: "titleValores",
                },
              ],
            ],
          },
        },
        {
          text: "",
          style: "assinaturaLinha",
        },
        {
          style: "tableValores",
          table: {
            widths: [200, 300],
            body: [
              [
                {
                  text: "Esse demonstrativo foi assinado digitalmente sob o nro: ",
                  style: "hashTitle",
                },
                {
                  text: result["hash"],
                  style: "hash",
                },
              ],
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [10, 25, 0, 10],
        },
        titleDadosMotorista: {
          fontSize: 15,
          alignment: "center",
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableValores: {
          margin: [0, 30, 0, 0],
        },
        dadosMotorista: {
          alignment: "left",
          margin: [0, 2, 0, 0],
        },
        dadosValores: {
          alignment: "center",
          margin: [0, 2, 0, 0],
        },
        dataDemonstrativo: {
          fontSize: 15,
          bold: true,
          margin: [0, 8, 0, 0],
        },
        titleValores: {
          alignment: "center",
          margin: [0, 3, 0, 0],
          bold: true,
        },
        totalValores: {
          margin: [300, 0, 0, 0],
        },
        assinatura: {
          margin: [0, 5, 0, 0],
          alignment: "center",
        },
        assinaturaLinha: {
          margin: [0, 60, 0, 0],
          alignment: "center",
        },
        dataTopo: {
          alignment: "right",
          margin: [0, 0, 0, 10],
        },
        hash: {
          alignment: "left",
          fontSize: 10,
          bold: true,
          margin: [0, 2, 3, 1],
        },
        hashTitle: {
          fontSize: 10,
          alignment: "center",
          margin: [0, 2, 0, 1],
        },
      },
      images: {
        building:
          "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAfMAAAHzCAYAAAA0D/RLAAAAAXNSR0IArs4c6QAAIABJREFUeF7snQmYZFV5989daum9Z3p6FmYHAYEgi4qEBNSgQRI1itLjRowxcUnc9fPTxCgY1wBDlJho1Ihboiji57AIY4xRFFDAYRnZBgaYfeu9ura7fM//3Hq7Txc1MzXTS9W99a/nqa6uqlv3nvM7557/ed/znnMsxQcJkAAJkAAJkECsCVixTj0TTwIkQAIkQAIkoCjmrAQkQAIkQAIkEHMCFPOYFyCTTwIkQAIkQAIUc9YBEiABEiABEog5AYp5zAuQyScBEiABEiABijnrAAmQAAmQAAnEnADFPOYFyOSTAAmQAAmQAMWcdYAESIAESIAEYk6AYh7zAmTySYAESIAESIBizjpAAiRAAiRAAjEnQDGPeQEy+SRAAiRAAiRAMWcdIAESIAESIIGYE6CYx7wAmXwSIAESIAESoJizDpAACZAACZBAzAlQzGNegEw+CZAACZAACVDMWQdIgARIgARIIOYEKOYxL0AmnwRIgARIgAQo5qwDJEACJEACJBBzAhTzmBcgk08CJEACJEACFHPWARIgARIgARKIOQGKecwLkMknARIgARIgAYo56wAJkAAJkAAJxJwAxTzmBcjkkwAJkAAJkADFnHWABEiABEiABGJOgGIe8wJk8kmABEiABEiAYs46QAIkQAIkQAIxJ0Axj3kBMvkkQAIkQAIkQDFnHSABEiABEiCBmBOgmMe8AJl8EiABEiABEqCYsw6QAAmQAAmQQMwJUMxjXoBMPgmQAAmQAAlQzFkHSIAESIAESCDmBCjmMS9AJp8ESIAESIAEKOasAyRAAiRAAiQQcwIU85gXIJNPAiRAAiRAAhRz1gESIAESIAESiDkBinnMC5DJJwESIAESIAGKOesACZAACZAACcScAMU85gXI5JMACZAACZAAxZx1gARIgARIgARiToBiHvMCZPJJgARIgARIgGLOOkACJEACJEACMSdAMY95ATL5JEACJEACJEAxZx0gARIgARIggZgToJjHvACZfBIgARIgARKgmLMOkAAJkAAJkEDMCVDMY16ATD4JkAAJkAAJUMxZB0iABEiABEgg5gQo5jEvQCafBEiABEiABCjmrAMkQAIkQAIkEHMCFPOYFyCTTwIkQAIkQAIUc9YBEiABEiABEog5AYp5zAuQyScBEiABEiABijnrAAmQAAmQAAnEnADFPOYFyOSTAAmQAAmQAMWcdYAESIAESIAEYk6AYh7zAmTySYAESIAESIBizjpAAiRAAiRAAjEnQDGPeQEy+SRAAiRAAiRAMWcdIAESIAESIIGYE6CYx7wAmXwSIAESIAESoJizDpAACZAACZBAzAlQzGNegEw+CZAACZAACVDMWQdIgARIgARIIOYEKOYxL0AmnwRIgARIgAQo5qwDJEACJEACJBBzAhTzmBcgk08CJEACJEACFHPWARIgARIgARKIOQGKecwLkMknARIgARIgAYo56wAJkAAJkAAJxJwAxTzmBcjkkwAJkAAJkADFnHWABEiABEiABGJOgGIe8wJk8kmABEiABEiAYs46QAIkQAIkQAIxJ0Axj3kBMvkkQAIkQAIkQDFnHSABEiABEiCBmBOgmMe8AJl8EiABEiABEqCYsw6QAAmQAAmQQMwJUMxjXoBMPgmQAAmQAAlQzFkHSIAESIAESCDmBCjmMS9AJp8ESIAESIAEKOasAyRAAiRAAiQQcwIU85gXIJNPAiRAAiRAAhRz1gESIAESIAESiDkBinnMC5DJJwESIAESIAGKOesACZAACZAACcScAMU85gXI5JMACZAACZAAxZx1gARIgARIgARiToBiHvMCZPJJgARIgARIgGLOOkACJEACJEACMSdAMY95ATL5JEACJEACJEAxZx0gARIgARIggZgToJjHvACZfBIgARIgARKgmLMOkAAJkAAJkEDMCVDMY16ATD4JkAAJkAAJUMxZB0iABEiABEgg5gQo5jEvQCafBEiABEiABCjmrAMkQAIkQAIkEHMCFPOYFyCTTwIkQAIkQAIUc9YBEiABEiABEog5AYp5zAuQyScBEiABEiABijnrAAmQAAmQAAnEnADFPOYFyOSTAAmQAAmQAMWcdYAESIAESIAEYk6AYh7zAmTySYAESIAESIBizjpAAiRAAiRAAjEnQDGPeQEy+SRAAiRAAiRAMWcdIAESIAESIIGYE6CYx7wAmXwSIAESIAESoJizDpAACZAACZBAzAlQzGNegEw+CZAACZAACVDMWQdIgARIgARIIOYEKOYxL0AmnwRIgARIgAQo5qwDJEACJEACJBBzAhTzmBcgk08CJEACJEACFHPWARIgARIgARKI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",
      },
    };
    const printer = new PDFPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(`static/${cpf}${mes}${ano}.pdf`));
    const chunks: any = [];

    pdfDoc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    pdfDoc.end();

    pdfDoc.on("end", () => {
      //const result = Buffer.concat(chunks);
      //return res.end(result);
      return res.json({ url: `static/${cpf}${mes}${ano}.pdf` });
    });
  }
}

export default new PPOController();
