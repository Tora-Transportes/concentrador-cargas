import { Request, Response } from "express";
import useCasesCargaCsn from "../../domain/csn/UseCaseCargaCsnInfo";
import AppError from "../../models/AppError";
import TokenAd from "../../models/TokenAd";

class CargaCsnInfoController {
  async search(req: Request, res: Response) {
    const result = await useCasesCargaCsn.UseCaseAddCargaCsn.run(req.query);
    return res.json({ data: result });
  }

  async index(req: Request, res: Response) {
    const { id } = req.params;
    const result = await useCasesCargaCsn.UseCaseViewCargasCsn.index(
      Number(id)
    );
    return res.json({ data: result });
  }

  async indexOfSituacaoEndPlaca(req: Request, res: Response) {
    const { placa } = req.query;
    if (!placa) throw new AppError("Query placa é obrigatório.", 400);
    const result =
      await useCasesCargaCsn.UseCaseViewCargasCsn.indexOfSituacaoEndPlaca(
        String(placa)
      );
    return res.json({ data: result });
  }

  async updateCsn(req: Request, res: Response) {
    const { id } = req.params;
    const input = { ...req.body };
    const claims = TokenAd.getClaims(String(req.headers.authorization));
    input.id = id;
    input.usuario = claims.name;

    const updateResult = await useCasesCargaCsn.UseCaseUpdateInfoCarga.run(
      input,
      claims.oid
    );

    return res.json({ data: updateResult });
  }
}

export default new CargaCsnInfoController();
