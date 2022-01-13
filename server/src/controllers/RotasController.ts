import { Request, Response } from "express";

import {
  UseCaseGetDistanceBetween,
  UseCaseListPendentRoutes,
} from "../domain/UseCaseCarga/entities";
import ServiceAutocomplete from "../services/ServiceAutocomplete";
import ServiceDetailsVehicle from "../services/ServiceDetailsVehicle";

class RotasController {
  async distanceBetweenLocations(req: Request, res: Response) {
    const distance = await new UseCaseGetDistanceBetween().run(req.params);
    return res.json({ data: distance });
  }

  async listPendentRoutes(req: Request, res: Response) {
    const routes = await new UseCaseListPendentRoutes().run(req.query);
    return res.json({ data: routes });
  }

  async listVehicles(req: Request, res: Response) {
    const { placa } = req.params;
    const vehicle = await new ServiceAutocomplete().buscarVeiculo(
      String(placa || "")
        .toUpperCase()
        .trim()
    );
    return res.json({ data: vehicle || null });
  }

  async detailsVehicle(req: Request, res: Response) {
    const service = new ServiceDetailsVehicle();
    return res.json({
      data: await service.index(req.params.placa.toUpperCase().trim()),
    });
  }
}

export default new RotasController();
