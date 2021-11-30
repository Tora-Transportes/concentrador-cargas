import { Request, Response } from "express";
import TokenAd from "../models/TokenAd";

import {
  UseCaseAddCarga,
  UseCaseDeleteCarga,
  UseCaseUpdateCarga,
  UseCaseViewCargas,
  UseCaseGetDistanceBetween,
} from "../domain/UseCaseCarga";
import AppError from "../models/AppError";

class CargaController {
  async create(req: Request, res: Response) {
    const cargaDTO = { ...req.body };
    cargaDTO.usuario = TokenAd.getClaims(
      String(req.headers.authorization)
    ).name;

    const carga = await new UseCaseAddCarga().run(cargaDTO);
    return res.json({
      data: carga,
    });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const input = { ...req.body };
    input.id = id;
    input.usuario = TokenAd.getClaims(String(req.headers.authorization)).name;

    const updateResult = await new UseCaseUpdateCarga().run(input);

    return res.json({ data: updateResult });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await new UseCaseDeleteCarga().run(
      id,
      TokenAd.getClaims(String(req.headers.authorization)).name
    );

    return res.send();
  }

  async index(req: Request, res: Response) {
    const { id } = req.params;
    const result = await new UseCaseViewCargas().index(id);
    return res.json({ data: result });
  }

  async search(req: Request, res: Response) {
    const result = await new UseCaseViewCargas().run(req.query);
    return res.json({ data: result });
  }
}

export default new CargaController();
