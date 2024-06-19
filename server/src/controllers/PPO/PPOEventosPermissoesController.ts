import { Request, Response } from "express";
import { PPOEventosPermissoesRepository } from "../../repositories/PPO/PPOEventosPermissoesRepository";
import { PPOPermissoesVisualizacaoRepository } from "../../repositories/PPO/PPOPermissoesVisualizacaoRepository";

interface IPPOEventosPermissoesController {
  getAllUsers(req: Request, res: Response): Promise<Response>;
  index(req: Request, res: Response): Promise<Response>;
  create(req: Request, res: Response): Promise<Response>;
  deleteUser(req: Request, res: Response): Promise<Response>;
  updateUser(req: Request, res: Response): Promise<Response>;
}

class PPOEventosPermissoesController
  implements IPPOEventosPermissoesController
{
  async getAllUsers(req: Request, res: Response) {
    const PVR = new PPOPermissoesVisualizacaoRepository();
    const result = await PVR.getUsers();
    return res.json({ data: result });
  }

  async index(req: Request, res: Response): Promise<Response> {
    const PEPR = new PPOEventosPermissoesRepository();
    const result = await PEPR.index();
    return res.json({ data: result });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const PEPR = new PPOEventosPermissoesRepository();
    const result = await PEPR.create(
      req.body,
      String(req.headers.authorization)
    );
    return res.status(201).json({ data: result });
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    const { oid } = req.params;
    const PEPR = new PPOEventosPermissoesRepository();
    const result = await PEPR.deleteUser(oid);
    return res.json({ data: result });
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    const { oid } = req.params;
    const PEPR = new PPOEventosPermissoesRepository();
    const result = await PEPR.updateUser(
      req.body,
      oid,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }
}

export default new PPOEventosPermissoesController();
