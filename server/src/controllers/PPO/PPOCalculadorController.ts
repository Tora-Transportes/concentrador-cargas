import { Request, Response } from "express";
import { PPOCalculadorRepository } from "../../repositories/PPO/PPOCalculadorRepository";

interface IPPOCalculadorController {
  index(req: Request, res: Response): Promise<Response>;
  relatorio(req: Request, res: Response): Promise<Response>;
  dash(req: Request, res: Response): Promise<Response>;
  blocos(req: Request, res: Response): Promise<Response>;
  emExecucao(req: Request, res: Response): Promise<Response>;
  create(req: Request, res: Response): Promise<Response>;
  motoristas(req: Request, res: Response): Promise<Response>;
  //delete(req: Request, res: Response): Promise<Response>;
}

class PPOCalculadorController implements IPPOCalculadorController {
  async index(req: Request, res: Response): Promise<Response> {
    const ppoCalculadorRepository = new PPOCalculadorRepository();
    const result = await ppoCalculadorRepository.search(req.query);
    return res.json({ data: result });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const ppoCalculadorRepository = new PPOCalculadorRepository();
    const result = await ppoCalculadorRepository.create(
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async dash(req: Request, res: Response): Promise<Response> {
    const ppoCalculadorRepository = new PPOCalculadorRepository();
    const result = await ppoCalculadorRepository.dash();
    return res.json({ data: result });
  }

  async blocos(req: Request, res: Response): Promise<Response> {
    const ppoCalculadorRepository = new PPOCalculadorRepository();
    const result = await ppoCalculadorRepository.blocos();
    return res.json({ data: result });
  }

  async emExecucao(req: Request, res: Response): Promise<Response> {
    const ppoCalculadorRepository = new PPOCalculadorRepository();
    const result = await ppoCalculadorRepository.emExecucao();
    return res.json({ data: result });
  }

  async relatorio(req: Request, res: Response): Promise<Response> {
    const ppoCalculadorRepository = new PPOCalculadorRepository();
    const result = await ppoCalculadorRepository.relatorio(
      { ...req.query },
      Number(req.query.page),
      Number(req.query.limit) || 5
    );
    return res.json({ data: result });
  }

  async motoristas(req: Request, res: Response): Promise<Response> {
    const ppoCalculadorRepository = new PPOCalculadorRepository();
    const result = await ppoCalculadorRepository.motoristas();
    return res.json({ data: result });
  }
}

export default new PPOCalculadorController();
