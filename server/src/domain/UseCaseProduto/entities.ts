import { ProdutoRepository } from "../../repositories/ProdutoRepository";
import AppError from "../../models/AppError";
import IProduto from "../../models/IProduto";
import TokenAd from "../../models/TokenAd";

export interface IRepositoryAddProduto {
  getNextId(): Promise<number>;
  findByName(nome: string): Promise<IProduto | undefined>;
  create(produto: IProduto): Promise<any>;
}

export class UseCaseAddProduto {
  constructor(private produtoRepository: IRepositoryAddProduto) {}

  async run(produto: Record<string, unknown>) {
    console.log("teste prod", produto);
    if (!produto || !produto?.nome) {
      throw new AppError("O produto deve ter um nome", 400);
    }

    const nome = String(produto.nome).trim().toUpperCase();
    const nomeEmUso = await this.produtoRepository.findByName(nome);
    if (nomeEmUso) {
      throw new AppError("Esse nome já se encontra em uso", 400);
    }

    const id = await this.produtoRepository.getNextId();
    const produtoCompleto: IProduto = {
      ativo: 1,
      nome,
      id,
      observacao: null,
      usuario: TokenAd.getClaims(String(produto.usuario)).name,
    };
    await this.produtoRepository.create(produtoCompleto);
    return produtoCompleto;
  }
}

export interface IRepositoryUpdadeProduto {
  findByName(nome: string): Promise<IProduto | undefined>;
  update(id: number, produto: IProduto): Promise<any>;
  index(id: string): Promise<IProduto | undefined>;
}
export class UseCaseUpdateProduto {
  constructor(private produtoRepository: IRepositoryUpdadeProduto) {}
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
    const nomeEmUso = await this.produtoRepository.findByName(nome);

    if (nomeEmUso && nomeEmUso.id !== Number(id)) {
      throw new AppError("Esse nome já se encontra em uso", 400);
    }

    const produtoCompleto = await this.produtoRepository.index(String(id));
    if (!produtoCompleto) {
      throw new AppError(`Produto com id '${id}' não existe`, 404);
    }

    produtoCompleto.ativo =
      ativo === undefined ? produtoCompleto.ativo : Number(ativo);
    produtoCompleto.nome = nome;
    produtoCompleto.observacao = Number(ativo) === 1 ? null : observacao;
    produtoCompleto.usuario = TokenAd.getClaims(String(produto.usuario)).name;

    await this.produtoRepository.update(Number(id), produtoCompleto);
    return produtoCompleto;
  }
}

export class UseCaseDisableProduto {
  constructor(private produtoRepository: IRepositoryUpdadeProduto) {}
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

    const produtoCadastrado = await this.produtoRepository.index(String(id));

    if (!produtoCadastrado) {
      throw new AppError("O produto informado não existe", 400);
    }

    const produtoCompleto: IProduto = produtoCadastrado;
    produtoCompleto.ativo = 0;
    produtoCompleto.observacao = observacao;
    produtoCompleto.usuario = TokenAd.getClaims(String(produto.usuario)).name;

    await this.produtoRepository.update(id, produtoCompleto);
    return produtoCompleto;
  }
}

export class UseCaseEnableProduto {
  constructor(private produtoRepository: IRepositoryUpdadeProduto) {}
  async run(produto: Record<string, unknown>) {
    const id = Number(produto?.id);

    if (isNaN(id)) {
      throw new AppError("O Id informado é inválido", 400);
    }

    const produtoCadastrado = await this.produtoRepository.index(String(id));

    if (!produtoCadastrado) {
      throw new AppError("O produto informado não existe", 400);
    }

    const produtoCompleto: IProduto = produtoCadastrado;
    produtoCompleto.ativo = 1;
    produtoCompleto.observacao = null;
    produtoCompleto.usuario = TokenAd.getClaims(String(produto.usuario)).name;

    await this.produtoRepository.update(id, produtoCompleto);
    return produtoCompleto;
  }
}

export interface IRepositoryViewProduto {
  search(filter: Record<string, any>): Promise<any[]>;
}
export class UseCaseViewProduto {
  constructor(private produtoRepository: IRepositoryViewProduto) {}
  async run(filter: Record<string, any>) {
    return this.produtoRepository.search(filter);
  }
}
