import { Request, Response } from "express";
import TokenAd from "../models/TokenAd";

import useCasesCarga from "../domain/UseCaseCarga";

class CargaController {
  async create(req: Request, res: Response) {
    const cargaDTO = { ...req.body };
    const { name, oid } = TokenAd.getClaims(String(req.headers.authorization));
    cargaDTO.usuario = name;

    const carga = await useCasesCarga.UseCaseAddCarga.run(cargaDTO, oid);
    return res.json({
      data: carga,
    });
  }

  async createByImport(req: Request, res: Response) {
    const { cargas } = req.body;
    const useCase = useCasesCarga.UseCaseAddCarga;
    const cargasToInsert = await Promise.all(
      cargas.map(async (i: any) => {
        try {
          return await useCase.run({
            usuario: "BOT IMPORTACAO",
            ...i,
          });
        } catch (error) {
          console.log(error);
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

    const carga = await useCasesCarga.UseCaseAddCargaDerivada.run(cargaDTO);
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

    const updateResult = await useCasesCarga.UseCaseUpdateCarga.run(
      input,
      claims.oid,
      String(req.headers.authorization)
    );

    return res.json({ data: updateResult });
  }

  async updatePatch(req: Request, res: Response) {
    const { id } = req.params;
    const body = { ...req.body };
    const claims = TokenAd.getClaims(String(req.headers.authorization));
    body.usuario = claims.name;

    const updateResult = await useCasesCarga.UseCaseUpdateCargaPatch.run(
      Number(id),
      body
    );

    return res.json({ data: updateResult });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { observacao_exclusao } = req.body;
    await useCasesCarga.UseCaseDeleteCarga.run(
      Number(id),
      TokenAd.getClaims(String(req.headers.authorization)).name,
      observacao_exclusao
    );

    return res.send();
  }

  async disable(req: Request, res: Response) {
    const { id } = req.params;
    const { observacao_exclusao } = req.body;
    await useCasesCarga.UseCaseDisableCarga.run(
      Number(id),
      TokenAd.getClaims(String(req.headers.authorization)).name,
      observacao_exclusao
    );

    return res.send();
  }

  async index(req: Request, res: Response) {
    const { id } = req.params;
    const result = await useCasesCarga.UseCaseViewCargas.index(Number(id));
    return res.json({ data: result });
  }

  async indexPlate(req: Request, res: Response) {
    const { plate } = req.params;
    const result = await useCasesCarga.UseCaseViewCargas.indexPlate(plate);
    return res.json({ data: result });
  }

  async search(req: Request, res: Response) {
    const result = await useCasesCarga.UseCaseViewCargas.run(req.query);
    return res.json({ data: result });
  }

  async importSheet(req: Request, res: Response) {
    const { file } = req;
    const usuario = req.headers.authorization;
    const response = await useCasesCarga.UseCaseImportCarga.run(
      file?.buffer,
      usuario
    );
    return res.json({ data: response });
  }
}

export default new CargaController();
