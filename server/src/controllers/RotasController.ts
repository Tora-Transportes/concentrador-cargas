import { Request, Response } from "express";

import {
  UseCaseGetDistanceBetween,
  UseCaseListPendentRoutes,
} from "../domain/UseCaseCarga/entities";
import ServiceAutocomplete from "../services/ServiceAutocomplete";

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
}

export default new RotasController();
