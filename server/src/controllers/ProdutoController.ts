import { Request, Response } from "express";
import {
  UseCaseAddProduto,
  UseCaseDisableProduto,
  UseCaseEnableProduto,
  UseCaseUpdateProduto,
  UseCaseViewProduto,
} from "../domain/UseCaseProduto";

class ProdutoController {
  async create(req: Request, res: Response) {
    const produto = {
      nome: req.body.nome,
      usuario: String(req.headers.authorization),
    };
    const produtoCadastrado = await new UseCaseAddProduto().run(produto);
    return res.json({ data: produtoCadastrado });
  }

  async update(req: Request, res: Response) {
    const { nome, ativo } = req.body;
    const { id } = req.params;
    const produto = {
      id: Number(id),
      nome,
      usuario: String(req.headers.authorization),
      ativo,
    };
    const produtoCadastrado = await new UseCaseUpdateProduto().run(produto);
    return res.json({ data: produtoCadastrado });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { observacao } = req.body;
    const produto = {
      id: Number(id),
      usuario: String(req.headers.authorization),
      observacao,
    };
    const produtoCadastrado = await new UseCaseDisableProduto().run(produto);
    return res.json({ data: produtoCadastrado });
  }

  async enable(req: Request, res: Response) {
    const { id } = req.params;
    const produto = {
      id: Number(id),
      usuario: String(req.headers.authorization),
    };
    const produtoCadastrado = await new UseCaseEnableProduto().run(produto);
    return res.json({ data: produtoCadastrado });
  }

  async list(req: Request, res: Response) {
    return res.json({ data: await new UseCaseViewProduto().run(req.query) });
  }
}

export default new ProdutoController();
