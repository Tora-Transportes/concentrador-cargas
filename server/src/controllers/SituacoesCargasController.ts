import { Request, Response } from "express";

import { UseCaseStatusCarga } from "../domain/UseCaseStatusCarga";

class SituacoesCargasController {
  async search(req: Request, res: Response) {
    const result = await new UseCaseStatusCarga().run(req.query);
    return res.json({ data: result });
  }
}

export default new SituacoesCargasController();
