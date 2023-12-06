import { Request, Response } from "express";
import { PPORepository } from "../repositories/PPORepository";

interface IPPOController {
  avaliacoes(req: Request, res: Response): Promise<Response>;
  distancia(req: Request, res: Response): Promise<Response>;
  infracoes(req: Request, res: Response): Promise<Response>;
  interjornada(req: Request, res: Response): Promise<Response>;
  atributos(req: Request, res: Response): Promise<Response>;
}

class PPOController implements IPPOController {
  async avaliacoes(req: Request, res: Response): Promise<Response> {
    const { cpf } = req.query;
    const ppoRepository = new PPORepository();
    //const { id } = req.params;
    const result = await ppoRepository.avaliacoes(String(cpf));
    return res.json({ data: result });
  }

  async distancia(req: Request, res: Response): Promise<Response> {
    //const { id } = req.params;
    const result = {};
    return res.json({ data: result });
  }

  async infracoes(req: Request, res: Response): Promise<Response> {
    //const { id } = req.params;
    const result = {};
    return res.json({ data: result });
  }

  async interjornada(req: Request, res: Response): Promise<Response> {
    // const { id } = req.params;
    const result = {};
    return res.json({ data: result });
  }

  async atributos(req: Request, res: Response): Promise<Response> {
    const ppoRepository = new PPORepository();
    const result = await ppoRepository.atributos();
    return res.json({ data: result });
  }
}

export default new PPOController();
