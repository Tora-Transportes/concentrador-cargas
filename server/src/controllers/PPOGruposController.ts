import { Request, Response } from "express";
import { PPOGruposRepository } from "../repositories/PPOGruposRepository";

interface IPPOGruposController {
  index(req: Request, res: Response): Promise<Response>;
  create(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
}

class PPOGruposController implements IPPOGruposController {
  async index(req: Request, res: Response): Promise<Response> {
    const ppoGruposRepository = new PPOGruposRepository();
    const result = await ppoGruposRepository.search(req.query);
    return res.json({ data: result });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const ppoGruposRepository = new PPOGruposRepository();
    const result = await ppoGruposRepository.create(
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const ppoGruposRepository = new PPOGruposRepository();
    const { id } = req.params;
    const result = await ppoGruposRepository.update(
      Number(id),
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const ppoGruposRepository = new PPOGruposRepository();
    const { id } = req.params;
    const result = await ppoGruposRepository.delete(Number(id));
    return res.json({ data: result });
  }
}

export default new PPOGruposController();
