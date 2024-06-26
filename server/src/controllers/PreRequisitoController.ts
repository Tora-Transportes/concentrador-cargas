import { Request, Response } from "express";
import { PreRequisitosRepository } from "../repositories/PreRequisitosRepository";

class PreRequisitoController {
  async create(req: Request, res: Response) {
    const PRR = new PreRequisitosRepository();
    const result = await PRR.create(
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const PRR = new PreRequisitosRepository();
    const result = await PRR.update(
      Number(id),
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const PRR = new PreRequisitosRepository();
    const result = await PRR.update(
      Number(id),
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async enable(req: Request, res: Response) {
    const { id } = req.params;
    const PRR = new PreRequisitosRepository();
    const result = await PRR.update(
      Number(id),
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async list(req: Request, res: Response) {
    const PRR = new PreRequisitosRepository();
    const result = await PRR.search(req.query);
    return res.json({ data: result });
  }
}

export default new PreRequisitoController();
