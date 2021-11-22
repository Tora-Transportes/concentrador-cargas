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

  async update(req: Request, res: Response) {
    const { nome, ativo } = req.body;
    const { id } = req.params;
    const service = new ServiceProdutos();
    const produto = await service.update({
      id: Number(id),
      nome,
      usuario: String(req.headers.authorization),
      ativo,
    });
    return res.json({ data: produto });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const service = new ServiceProdutos();
    await service.delete({
      id: Number(id),
      usuario: String(req.headers.authorization),
    });

    return res.send();
  }

  async enable(req: Request, res: Response) {
    const { id } = req.params;
    const service = new ServiceProdutos();
    await service.enable({
      id: Number(id),
      usuario: String(req.headers.authorization),
    });

    return res.send();
  }

  async list(req: Request, res: Response) {
    const service = new ServiceProdutos();
    const produtos = await service.list();
    return res.json({ data: produtos });
  }
}

export default new ProdutoController();
