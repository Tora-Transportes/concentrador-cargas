import { Request, Response } from "express";
import { LogsAppConcentradorRepository } from "../../repositories/LogsAppConcentrador/LogsAppConcentradorRepository";

interface IPPOCalculadorController {
  relatorio(req: Request, res: Response): Promise<Response>;
  create(req: Request, res: Response): Promise<Response>;
}

class PPOCalculadorController implements IPPOCalculadorController {
  async create(req: Request, res: Response): Promise<Response> {
    const logsRepository = new LogsAppConcentradorRepository();
    const result = await logsRepository.create(
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async relatorio(req: Request, res: Response): Promise<Response> {
    const logsRepository = new LogsAppConcentradorRepository();
    const result = await logsRepository.relatorio(
      { ...req.query },
      Number(req.query.page),
      Number(req.query.limit) || 5
    );
    return res.json({ data: result });
  }
}

export default new PPOCalculadorController();
