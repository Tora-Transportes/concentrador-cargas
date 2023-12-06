import { Request, Response } from "express";
import { PPOParametrosGPRepository } from "../repositories/PPOParametrosGrupoRepository";

interface IPPOParametrosGrupoController {
  index(req: Request, res: Response): Promise<Response>;
  create(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
}

class PPOParametrosGrupoController implements IPPOParametrosGrupoController {
  async index(req: Request, res: Response): Promise<Response> {
    const ppoParametrosRepository = new PPOParametrosGPRepository();
    const result = await ppoParametrosRepository.search(req.query);
    return res.json({ data: result });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const ppoParametrosRepository = new PPOParametrosGPRepository();
    const result = await ppoParametrosRepository.create(
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const ppoParametrosRepository = new PPOParametrosGPRepository();
    const { id } = req.params;
    const result = await ppoParametrosRepository.update(
      Number(id),
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const ppoParametrosRepository = new PPOParametrosGPRepository();
    const { id } = req.params;
    const result = await ppoParametrosRepository.delete(Number(id));
    return res.json({ data: result });
  }
}

export default new PPOParametrosGrupoController();
