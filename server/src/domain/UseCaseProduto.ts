import {
  AddProdutoRepo,
  UpdateProdutoRepo,
  ViewProdutoRepo,
} from "../repositories/ProdutoRepository";
import AppError from "../models/AppError";
import IProduto from "../models/IProduto";
import TokenAd from "../models/TokenAd";

export class UseCaseAddProduto {
  async run(produto: Record<string, unknown>) {
    if (!produto || !produto?.nome) {
      throw new AppError("O produto deve ter um nome", 400);
    }

    const nome = String(produto.nome).trim().toUpperCase();
    const nomeEmUso =
      (
        await new ViewProdutoRepo().get({
          nome,
        })
      ).length > 0;
    if (nomeEmUso) {
      throw new AppError("Esse nome já se encontra em uso", 400);
    }

    const repository = new AddProdutoRepo();
    const id = await repository.getNextId();
    const produtoCompleto: IProduto = {
      ativo: 1,
      nome,
      id,
      observacao: null,
      usuario: TokenAd.getClaims(String(produto.usuario)).name,
    };
    await repository.save(produtoCompleto);
    return produtoCompleto;
  }
}

export class UseCaseUpdateProduto {
  async run(produto: Record<string, unknown>) {
    const { ativo, id } = produto;
    const observacao =
      produto?.observacao === null || produto.observacao === undefined
        ? null
        : String(produto?.observacao);

    if (!produto?.nome) {
      throw new AppError("O produto deve ter um nome", 400);
    }

    if (Number(ativo) === 0 && !observacao) {
      throw new AppError(
        "Ao desativar o produto ele deve possuir uma observação",
        400
      );
    }

    const nome = String(produto.nome).trim().toUpperCase();
    const viewRepository = new ViewProdutoRepo();
    const nomeEmUso = await viewRepository.get({
      nome,
    });
    if (nomeEmUso.length > 0 && nomeEmUso[0].id !== Number(id)) {
      throw new AppError("Esse nome já se encontra em uso", 400);
    }

    const produtoCompleto: IProduto = (await viewRepository.get({ id }))[0];
    produtoCompleto.ativo =
      ativo === undefined ? produtoCompleto.ativo : Number(ativo);
    produtoCompleto.nome = nome;
    produtoCompleto.observacao = Number(ativo) === 1 ? null : observacao;
    produtoCompleto.usuario = TokenAd.getClaims(String(produto.usuario)).name;

    const repository = new UpdateProdutoRepo();
    await repository.save(Number(id), produtoCompleto);
    return produtoCompleto;
  }
}

export class UseCaseDisableProduto {
  async run(produto: Record<string, unknown>) {
    const id = Number(produto?.id);
    const observacao =
      produto?.observacao === null ? null : String(produto?.observacao);

    if (!observacao) {
      throw new AppError(
        "Ao desabilitar um produto deve ser incluída uma observação",
        400
      );
    }

    if (isNaN(id)) {
      throw new AppError("O Id informado é inválido", 400);
    }

    const produtosCadastrados = await new ViewProdutoRepo().get({
      id,
    });

    if (produtosCadastrados.length === 0) {
      throw new AppError("O produto informado não existe", 400);
    }

    const produtoCompleto: IProduto = produtosCadastrados[0];
    produtoCompleto.ativo = 0;
    produtoCompleto.observacao = observacao;
    produtoCompleto.usuario = TokenAd.getClaims(String(produto.usuario)).name;

    const repository = new UpdateProdutoRepo();
    await repository.save(id, produtoCompleto);
    return produtoCompleto;
  }
}

export class UseCaseEnableProduto {
  async run(produto: Record<string, unknown>) {
    const id = Number(produto?.id);

    if (isNaN(id)) {
      throw new AppError("O Id informado é inválido", 400);
    }

    const produtosCadastrados = await new ViewProdutoRepo().get({
      id,
    });

    if (produtosCadastrados.length === 0) {
      throw new AppError("O produto informado não existe", 400);
    }

    const produtoCompleto: IProduto = produtosCadastrados[0];
    produtoCompleto.ativo = 1;
    produtoCompleto.observacao = null;
    produtoCompleto.usuario = TokenAd.getClaims(String(produto.usuario)).name;

    const repository = new UpdateProdutoRepo();
    await repository.save(id, produtoCompleto);
    return produtoCompleto;
  }
}

export class UseCaseViewProduto {
  async run(filter: Record<string, any>) {
    return new ViewProdutoRepo().get(filter);
  }
}
