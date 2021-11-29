import { Request, Response } from "express";
import ServiceAutocomplete from "../services/ServiceAutocomplete";

class RecomendacoesController {
  async organizacoes(req: Request, res: Response) {
    const service = new ServiceAutocomplete();
    const orgs = await service.recommendOrganizacao(req.query);
    return res.json({ data: orgs });
  }

  async cidadeEstados(req: Request, res: Response) {
    const service = new ServiceAutocomplete();
    const cidadeEstados = await service.recomendarLocalizacao(req.query);
    return res.json({ data: cidadeEstados });
  }
}

export default new RecomendacoesController();
