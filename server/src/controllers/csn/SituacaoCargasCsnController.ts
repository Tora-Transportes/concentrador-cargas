import { Request, Response } from "express";
import { UseCaseStatusCargaCsn } from "../../domain/csn/UseCaseStatusCargasCsn";

class SituacoesCargasCsnController {
  async search(req: Request, res: Response) {
    const result = await new UseCaseStatusCargaCsn().run(req.query);
    return res.json({ data: result });
  }
}

export default new SituacoesCargasCsnController();
