import { Request, Response } from "express";
import domainAviso from "../domain/UseCaseAvisos";
import TokenAd from "../models/TokenAd";

interface IAvisosController {
  create(req: Request, res: Response): Promise<Response>;
  index(req: Request, res: Response): Promise<Response>;
  search(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
  pathUpdate(req: Request, res: Response): Promise<Response>;
}

class AvisosController implements IAvisosController {
  async create(req: Request, res: Response): Promise<Response> {
    const result = await domainAviso.useCaseAddAvisos.run(req.body);
    return res.status(201).json({ data: result });
  }
  async index(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await domainAviso.useCaseIndexAvisos.run(Number(id));
    return res.json({ data: result });
  }
  async search(req: Request, res: Response): Promise<Response> {
    const result = await domainAviso.useCaseAllAvisos.run(req.query);
    return res.json({ data: result });
  }
  async lastIdAviso(_req: Request, res: Response): Promise<Response> {
    const result = await domainAviso.useCaseLastIdAviso.run();
    return res.json({ data: result });
  }
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name } = TokenAd.getClaims(String(req.headers.authorization));
    req.body.RESPONSAVEL_EDICAO = name;
    await domainAviso.useCaseUpdateAvisos.run(Number(id), req.body);
    return res.status(204).send();
  }

  async pathUpdate(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await domainAviso.useCasePathUpdateAvisos.run(
      Number(id),
      req.body
    );
    return res.json({ data: result });
  }
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await domainAviso.useCaseDeleteAvisos.run(Number(id));
    return res.json({ data: result });
  }
}

export default new AvisosController();
