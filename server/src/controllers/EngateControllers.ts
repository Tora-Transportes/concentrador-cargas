import { Request, Response } from "express";
import UseCase from "../domain/UseCaseEngate";
import TokenAd from "../models/TokenAd";
import zlib from "zlib";
import fs from "fs";
import AppError from "../models/AppError";

interface IEngateController {
  create(req: Request, res: Response): Promise<Response>;
  searchAll(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
}
class EngateController implements IEngateController {
  async create(req: Request, res: Response): Promise<Response> {
    if (!req.file || !req.file.path) {
      throw new AppError("O pdf é obrigatório", 400);
    }
    const { path } = req.file; //
    const { info } = req.body;

    const dataFormatJson = JSON.parse(info);
    const pdfBuffer = fs.readFileSync(path);
    const compressedPdfBuffer = zlib.deflateSync(pdfBuffer);
    if (!compressedPdfBuffer) throw new AppError("Erro ao salvar pdf", 500);
    dataFormatJson.PDF = compressedPdfBuffer;

    const { name } = TokenAd.getClaims(String(req.headers.authorization));

    dataFormatJson.RESPONSAVEL_CADASTRO = name;
    dataFormatJson.USUARIO = name;
    await UseCase.useCaseCreateProcessEngate.run(dataFormatJson, path);
    return res
      .status(201)
      .json({ data: { message: "Processo do engate criado com sucesso." } });
  }

  async searchAll(req: Request, res: Response): Promise<Response> {
    const result = await UseCase.useCaseSearchAllProcessEngate.run();
    return res.json({ data: result });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { name } = TokenAd.getClaims(String(req.headers.authorization));
    const { id } = req.params;
    req.body.USUARIO = name;
    await UseCase.useCaseUpdateProcessEngate.run(req.body, Number(id));
    return res.status(204).send();
  }
}

export default new EngateController();
