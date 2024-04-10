import { Request, Response } from "express";
import { PPOPermissoesVisualizacaoRepository } from "../repositories/PPOPermissoesVisualizacaoRepository";

interface IPPOPermissoesVisualizacaoController {
  getAllUsers(req: Request, res: Response): Promise<Response>;
  create(req: Request, res: Response): Promise<Response>;
  index(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
  deleteUser(req: Request, res: Response): Promise<Response>;
  updateUser(req: Request, res: Response): Promise<Response>;
}

class PPOPermissoesVisualizacaoController
  implements IPPOPermissoesVisualizacaoController
{
  async getAllUsers(req: Request, res: Response) {
    const PVR = new PPOPermissoesVisualizacaoRepository();
    const result = await PVR.getUsers();
    return res.json({ data: result });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const PVR = new PPOPermissoesVisualizacaoRepository();
    const result = await PVR.create(
      req.body,
      String(req.headers.authorization)
    );
    return res.status(201).json({ data: result });
  }

  async index(req: Request, res: Response): Promise<Response> {
    const PVR = new PPOPermissoesVisualizacaoRepository();
    const result = await PVR.index();
    return res.json({ data: result });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id, uid } = req.params;
    const PVR = new PPOPermissoesVisualizacaoRepository();
    const result = await PVR.delete(id, uid);
    return res.json({ data: result });
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    const { uid } = req.params;
    const PVR = new PPOPermissoesVisualizacaoRepository();
    const result = await PVR.deleteUser(uid);
    return res.json({ data: result });
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    const { uid } = req.params;
    const PVR = new PPOPermissoesVisualizacaoRepository();
    const result = await PVR.updateUser(
      req.body,
      uid,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }
}

export default new PPOPermissoesVisualizacaoController();
