import { Request, Response } from "express";
import useCasesCargaCsn from "../../domain/csn/UseCaseCargaCsnInfo";

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
}

export default new CargaCsnInfoController();
