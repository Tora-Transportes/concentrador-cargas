import { Request, Response } from "express";
import AppError from "../models/AppError";
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

  async filiais(req: Request, res: Response) {
    const service = new ServiceAutocomplete();
    const filiais = await service.buscarFiliais();
    return res.json({ data: filiais });
  }

  async localidadePorEstado(req: Request, res: Response) {
    const { uf, cidade } = req.query;
    if (!uf || !cidade)
      throw new AppError("uf é um parametro obrigatório.", 400);
    const service = new ServiceAutocomplete();
    const infoLocalidade = await service.buscarLocalizacaoPorEstado(
      String(uf),
      String(cidade)
    );
    return res.json({ data: infoLocalidade });
  }
}

export default new RecomendacoesController();
