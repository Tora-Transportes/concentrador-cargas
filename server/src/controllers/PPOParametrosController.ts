import { Request, Response } from "express";
import { PPOParametrosRepository } from "../repositories/PPOParametrosRepository";

interface IPPOParametrosController {
  index(req: Request, res: Response): Promise<Response>;
  create(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
}

class PPOParametrosController implements IPPOParametrosController {
  async index(req: Request, res: Response): Promise<Response> {
    const ppoParametrosRepository = new PPOParametrosRepository();
    const result = await ppoParametrosRepository.search(req.query);
    return res.json({ data: result });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const ppoParametrosRepository = new PPOParametrosRepository();
    const result = await ppoParametrosRepository.create(
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const ppoParametrosRepository = new PPOParametrosRepository();
    const { id } = req.params;
    const result = await ppoParametrosRepository.update(
      Number(id),
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const ppoParametrosRepository = new PPOParametrosRepository();
    const { id } = req.params;
    const result = await ppoParametrosRepository.delete(Number(id));
    return res.json({ data: result });
  }
}

export default new PPOParametrosController();
