import { Request, Response } from "express";
import { PPOEventosAprovacaoRepository } from "../../repositories/PPO/PPOEventosAprovacaoRepository";

interface IPPOEventosAprovacaoController {
  index(req: Request, res: Response): Promise<Response>;
  detalhes(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
}

class PPOEventosAprovacaoController implements IPPOEventosAprovacaoController {
  async index(req: Request, res: Response): Promise<Response> {
    const PEAR = new PPOEventosAprovacaoRepository();
    const result = await PEAR.index(req.query);
    return res.json({ data: result });
  }
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const PEAR = new PPOEventosAprovacaoRepository();
    const result = await PEAR.update(
      req.body,
      id,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }
  async detalhes(req: Request, res: Response): Promise<Response> {
    const PEAR = new PPOEventosAprovacaoRepository();
    const result = await PEAR.detalhes(req.query);
    return res.json({ data: result });
  }
}

export default new PPOEventosAprovacaoController();
