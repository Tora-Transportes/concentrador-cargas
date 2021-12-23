import {
  UseCaseAddProduto,
  UseCaseDisableProduto,
  UseCaseEnableProduto,
  UseCaseUpdateProduto,
  UseCaseViewProduto,
} from "./entities";

import { ProdutoRepository } from "../../repositories/ProdutoRepository";

const produtoRepository = new ProdutoRepository();

const modules = {
  UseCaseAddProduto: new UseCaseAddProduto(produtoRepository),
  UseCaseDisableProduto: new UseCaseDisableProduto(produtoRepository),
  UseCaseEnableProduto: new UseCaseEnableProduto(produtoRepository),
  UseCaseUpdateProduto: new UseCaseUpdateProduto(produtoRepository),
  UseCaseViewProduto: new UseCaseViewProduto(produtoRepository),
};

export default modules;
