import { ICarga } from "../models/ICargas";
import { Request, Response } from "express";
import { factoryCargaValidator } from "../validations/CargaValidator";
import { ServiceCargas } from "../services/ServiceCargas";
import TokenAd from "../models/TokenAd";

class CargaController {
  async create(req: Request, res: Response) {
    const validator = factoryCargaValidator();
    const carga: ICarga = await validator.validate(req.body, {
      abortEarly: false,
    });
    carga.usuario = TokenAd.getClaims(String(req.headers.authorization)).name;

    const service = new ServiceCargas();
    const id = await service.insert(carga);

    return res.json({
      data: { id },
    });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const input = { ...req.body };
    input.id = id;

    const validator = factoryCargaValidator();
    const carga: ICarga = await validator.validate(input, {
      abortEarly: false,
    });
    carga.usuario = TokenAd.getClaims(String(req.headers.authorization)).name;

    const service = new ServiceCargas();
    const updateResult = await service.update(carga);

    return res.json({ data: updateResult });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const service = new ServiceCargas();
    await service.delete(id, String(req.headers.authorization));

    return res.send();
  }

  async index(req: Request, res: Response) {
    const { id } = req.params;
    const service = new ServiceCargas();
    const carga: ICarga | undefined = await service.index(id);
    return res.json({ data: carga });
  }

  async search(req: Request, res: Response) {
    const service = new ServiceCargas();
    const searchResult = await service.search(req.query);

    return res.json({ data: searchResult });
  }

  async distanceBetweenLocations(req: Request, res: Response) {
    const { cidade_origem, cidade_destino, estado_origem, estado_destino } =
      req.params;
    const service = new ServiceCargas();
    const distance = await service.distanceBetweenLocations({
      cidade_origem,
      cidade_destino,
      estado_origem,
      estado_destino,
    });

    return res.json({ data: distance });
  }
}

export default new CargaController();
