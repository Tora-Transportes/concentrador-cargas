import { Request, Response } from "express";
import { PPORepository } from "../../repositories/PPO/PPORepository";
import xlsx from "xlsx";
import fs from "fs";
import AppError from "../../models/AppError";
import { formataCPF } from "../../Utils/utlis";
import ServiceDemonstrativo from "../../services/ServiceDemonstrativo";
import ServiceAutentique from "../../services/ServiceAutentique";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

interface Position {
  x: string;
  y: string;
  z: string;
}

interface DocumentData {
  name: string;
  cpf: string;
  document_name: string;
  mes: string;
  ano: string;
  url_file: string;
  base64_file: string;
  positions: Position;
}

interface IPPOController {
  avaliacoes(req: Request, res: Response): Promise<Response>;
  protheus(req: Request, res: Response): Promise<Response>;
  protheusTxt(req: Request, res: Response): Promise<Response>;
  distancia(req: Request, res: Response): Promise<Response>;
  infracoes(req: Request, res: Response): Promise<Response>;
  interjornada(req: Request, res: Response): Promise<Response>;
  atributos(req: Request, res: Response): Promise<Response>;
  demonstrativo(req: Request, res: Response): Promise<any>;
  demonstrativoAutentique(req: Request, res: Response): Promise<any>;
  relatorio(req: Request, res: Response): Promise<Response>;
  relatorioExcel(req: Request, res: Response): Promise<Response>;
  relatorioDocumentos(req: Request, res: Response): Promise<Response>;
  relatorioDocumentosExcel(req: Request, res: Response): Promise<Response>;
  demonstrativos(req: Request, res: Response): Promise<Response>;
  motorista_by_grupo(req: Request, res: Response): Promise<any>;
}

class PPOController implements IPPOController {
  async demonstrativos(req: Request, res: Response): Promise<Response> {
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.demonstrativos(req.query);
    return res.json({ data: result });
  }

  async relatorioExcel(req: Request, res: Response): Promise<Response> {
    const ppoRepository = new PPORepository();
    const filename = `static/RELATORIO-PPO_${new Date().getTime()}.xlsx`;
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

    stream.once("end", () => {
      // File reading is complete, now delete the file
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

  async relatorioDocumentosExcel(
    req: Request,
    res: Response
  ): Promise<Response> {
    const ppoRepository = new PPORepository();
    const filename = `static/RELATORIO-DOCUMENTOS-PPO_${new Date().getTime()}.xlsx`;
    const searchResult = await ppoRepository.relatorioDocumentosExcel(
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
      // File reading is complete, now delete the file
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
  async relatorio(req: Request, res: Response): Promise<Response> {
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.relatorio_motoristas(
      { ...req.query },
      Number(req.query.page),
      Number(req.query.limit) || 5
    );
    return res.json({ data: result });
  }

  async relatorioDocumentos(req: Request, res: Response): Promise<Response> {
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.relatorioDocumentos(
      { ...req.query },
      Number(req.query.page),
      Number(req.query.limit) || 5
    );
    return res.json({ data: result });
  }

  async avaliacoes(req: Request, res: Response): Promise<Response> {
    const { cpf, data_inicio, data_fim } = req.query;
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.avaliacoes(
      String(cpf),
      String(data_inicio),
      String(data_fim)
    );
    return res.json({ data: result });
  }

  async protheus(req: Request, res: Response): Promise<Response> {
    const { mes, ano, cpf, grupo_id } = req.query;
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.exporta_protheus(
      String(mes),
      String(ano),
      String(cpf),
      String(grupo_id)
    );
    return res.json({ data: result });
  }

  async protheusTxt(req: Request, res: Response): Promise<any> {
    const { mes, ano, cpf, grupo_id } = req.query;
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.exporta_protheus(
      String(mes),
      String(ano),
      String(cpf),
      String(grupo_id)
    );
    const data: any[] = [];
    result.forEach((element: any) => {
      data.push(element["exporta_final"]);
    });
    const dataAsString = data.join("\n") + "\n";
    const filePath = "static/exported_protheus.txt";
    fs.writeFile(filePath, dataAsString, (err) => {
      if (err) {
        console.error(err);
        throw new AppError("Erro ao gerar txt", 400);
      } else {
        console.log("Data exported successfully");
        return res.download(filePath, "exported_data.txt", () => {
          fs.unlink(filePath, (err) => {
            if (err) throw new AppError("Erro ao gerar txt", 400);
            else console.log("File deleted successfully");
          });
        });
      }
    });
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

    const result = await ppoRepository.resultado_ppo(
      formataCPF(String(cpf)),
      String(mes),
      String(ano)
    );

    const serviceDemonstrativo = new ServiceDemonstrativo();

    const url = await serviceDemonstrativo.createDocument(
      result,
      String(cpf),
      String(mes),
      String(ano)
    );

    return res.json({ url: url });
  }

  async demonstrativoAutentique(req: Request, res: Response): Promise<any> {
    const { cpf, mes, ano } = req.query;
    const ppoRepository = new PPORepository();
    const dados = await ppoRepository.resultado_ppo(
      formataCPF(String(cpf)),
      String(mes),
      String(ano)
    );
    const serviceDemonstrativo = new ServiceDemonstrativo();
    const url = await serviceDemonstrativo.createDocument(
      dados,
      String(cpf),
      String(mes),
      String(ano)
    );
    const base64String = await serviceDemonstrativo.pdfToBase64(url);
    let x_position = "";
    if (dados["dados_motorista"]["cancelado"] == "Sim") {
      // cancelado
      x_position = "73.0";
    }
    if (dados["valores"].length == 1) {
      // cancelado com complementar
      x_position = "76.0";
    }
    if (dados["valores"].length == 4) {
      //normal
      x_position = "86.0";
    }
    if (dados["valores"].length == 5) {
      //com complementar
      x_position = "90.0";
    }

    const body: DocumentData = {
      name: dados["dados_motorista"]["nome"],
      cpf: String(cpf),
      document_name: "Demonstrativo PPO",
      mes: String(mes),
      ano: String(ano),
      positions: {
        x: "20.0",
        y: x_position,
        z: "1",
      },
      url_file: "xpto",
      base64_file: base64String,
    };

    const serviceAutentique = new ServiceAutentique();
    const response = await serviceAutentique.createDocument(body);
    return res.status(response.status).send(response.data.data);
  }

  async motorista_by_grupo(req: Request, res: Response): Promise<any> {
    const { cpf, permissoes } = req.query;
    if (!cpf || !permissoes) {
      throw new AppError("query parms cpf ou permissoes ausente", 400);
    }
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.motorista_by_grupo(
      String(cpf),
      String(permissoes)
    );
    return res.json(result);
  }
}

export default new PPOController();
