import { Request, Response } from "express";
import { PPOMotoristasGruposRepository } from "../../repositories/PPO/PPOMotoristasGruposRepository";

interface IPPOMotoristasGruposController {
  index(req: Request, res: Response): Promise<Response>;
  create(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
  motoristasAtivos(req: Request, res: Response): Promise<Response>;
  relatorioHistoricoMovimentacoes(
    req: Request,
    res: Response
  ): Promise<Response>;
}

class PPOMotoristasGruposController implements IPPOMotoristasGruposController {
  async index(req: Request, res: Response): Promise<Response> {
    const pmg = new PPOMotoristasGruposRepository();
    const result = await pmg.search(req.query);
    return res.json({ data: result });
  }

  async motoristasAtivos(req: Request, res: Response): Promise<Response> {
    const pmg = new PPOMotoristasGruposRepository();
    const result = await pmg.motoristasAtivos();
    return res.json({ data: result });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const pmg = new PPOMotoristasGruposRepository();
    const result = await pmg.create(
      req.body,
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const pmg = new PPOMotoristasGruposRepository();
    const { id } = req.params;
    const result = await pmg.delete(
      Number(id),
      String(req.headers.authorization)
    );
    return res.json({ data: result });
  }

  async driverLiked(req: Request, res: Response): Promise<Response> {
    const pmg = new PPOMotoristasGruposRepository();
    const { cpf } = req.params;
    const result = await pmg.driverIsLinked(cpf);
    return res.json({ data: result });
  }

  async relatorioHistoricoMovimentacoes(
    req: Request,
    res: Response
  ): Promise<Response> {
    const pmg = new PPOMotoristasGruposRepository();
    const result = await pmg.relatorioHistoricoMovimentacoes(
      { ...req.query },
      Number(req.query.page),
      Number(req.query.limit) || 5
    );
    return res.json({ data: result });
  }
}

export default new PPOMotoristasGruposController();
