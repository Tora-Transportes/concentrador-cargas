import { Request, Response } from "express";
import TokenAd from "../models/TokenAd";

import {
  UseCaseAddCarga,
  UseCaseDeleteCarga,
  UseCaseUpdateCarga,
  UseCaseViewCargas,
  UseCaseImportCarga,
  UseCaseAddCargaDerivada,
} from "../domain/UseCaseCarga";

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

  async createByImport(req: Request, res: Response) {
    const { cargas } = req.body;

    const useCase = new UseCaseAddCarga();
    const cargasToInsert = await Promise.all(
      cargas.map(async (i: any) => {
        try {
          return await useCase.run({
            usuario: "BOT IMPORTACAO",
            ...i,
          });
        } catch (error) {
          console.log(error, i);
          return null;
        }
      })
    );
    return res.json({
      data: cargasToInsert.filter((i) => !!i),
    });
  }

  async createDerivada(req: Request, res: Response) {
    const fk_lote_pai = req.params.fk_lote_pai;
    const cargaDTO = { ...req.body, fk_lote_pai };
    cargaDTO.usuario = TokenAd.getClaims(
      String(req.headers.authorization)
    ).name;

    const carga = await new UseCaseAddCargaDerivada().run(cargaDTO);
    return res.json({
      data: carga,
    });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const input = { ...req.body };
    const claims = TokenAd.getClaims(String(req.headers.authorization));
    input.id = id;
    input.usuario = claims.name;

    const updateResult = await new UseCaseUpdateCarga().run(input, claims.oid);

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

  async importSheet(req: Request, res: Response) {
    const { file } = req;
    const usuario = req.headers.authorization;
    const response = await new UseCaseImportCarga().run(file?.buffer, usuario);
    return res.json({ data: response });
  }
}

export default new CargaController();
