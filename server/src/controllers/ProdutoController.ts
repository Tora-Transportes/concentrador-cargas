import { Request, Response } from "express";
import { ServiceProdutos } from "../services/ServiceProdutos";

class ProdutoController {
  async create(req: Request, res: Response) {
    const { nome } = req.body;
    const service = new ServiceProdutos();
    const produto = await service.insert({
      nome,
      usuario: String(req.headers.authorization),
    });
    return res.json({ data: produto });
  }

  async list(req: Request, res: Response) {
    const service = new ServiceProdutos();
    const produtos = await service.list();
    return res.json({ data: produtos });
  }
}

export default new ProdutoController();
