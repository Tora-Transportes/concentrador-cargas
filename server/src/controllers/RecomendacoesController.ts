import { Request, Response } from "express";
import ServiceAutocomplete from "../services/ServiceAutocomplete";

class RecomendacoesController {
  async organizacoes(req: Request, res: Response) {
    const service = new ServiceAutocomplete();
    const orgs = await service.recommendOrganizacao(req.query);
    return res.json({ data: orgs });
  }
}

export default new RecomendacoesController();
