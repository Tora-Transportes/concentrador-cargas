import { Request, Response } from "express";

import {
  UseCaseGetDistanceBetween,
  UseCaseListPendentRoutes,
} from "../domain/UseCaseCarga";

class RotasController {
  async distanceBetweenLocations(req: Request, res: Response) {
    const distance = await new UseCaseGetDistanceBetween().run(req.params);
    return res.json({ data: distance });
  }

  async listPendentRoutes(req: Request, res: Response) {
    const routes = await new UseCaseListPendentRoutes().run(req.query);
    return res.json({ data: routes });
  }
}

export default new RotasController();
