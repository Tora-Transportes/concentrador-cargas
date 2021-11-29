import { CargaRepository } from "../repositories/CargaRepository";
import { ICarga } from "../models/ICargas";
import { factoryCargaValidator } from "../validations/CargaValidator";
import AppError from "../models/AppError";

export class UseCaseAddCarga {
  async run(cargaDTO: Record<string, any>) {
    const validator = factoryCargaValidator();
    const carga: ICarga = await validator.validate(cargaDTO, {
      abortEarly: false,
    });

    const currentDate = new Date();
    carga.data_atualizacao = currentDate;
    carga.data_cadastro = currentDate;

    const cargaRepository = new CargaRepository();

    const cargasCadastrada = await cargaRepository.index(carga.id);
    if (cargasCadastrada) {
      throw new AppError("Uma carga com esse Código já foi cadastrada", 400);
    }

    await cargaRepository.create(carga);
    return carga;
  }
}

export class UseCaseUpdateCarga {
  async run(cargaDTO: Record<string, any>) {
    const validator = factoryCargaValidator();
    const carga: ICarga = await validator.validate(cargaDTO, {
      abortEarly: false,
    });

    const currentDate = new Date();
    carga.data_atualizacao = currentDate;

    const cargaRepository = new CargaRepository();
    const cargaCadastrada = await cargaRepository.index(carga.id);
    if (!cargaCadastrada) {
      throw new AppError(
        `Nenhuma carga foi encontrada com o código ${carga.id}`,
        404
      );
    } else if (cargaCadastrada.ativo === 0) {
      throw new AppError(
        `A carga foi desativada pelo usuario ${cargaCadastrada.usuario}`,
        403
      );
    }

    const { janela_entrega, janela_coleta, e_lote } = carga;
    const cargaOficial = {
      ...carga,
      data_atualizacao: currentDate,
      janela_entrega: e_lote ? null : janela_entrega,
      janela_coleta: e_lote ? null : janela_coleta,
    };

    await cargaRepository.update(cargaOficial.id, cargaOficial);
    return cargaOficial;
  }
}

export class UseCaseViewCargas {
  async run(filter: Record<string, any>) {
    const cargaRepository = new CargaRepository();
    return cargaRepository.search({ ...filter, ativo: 1 }, filter.page);
  }

  async index(id: string) {
    const cargaRepository = new CargaRepository();
    const carga = await cargaRepository.index(id);
    if (!carga) {
      throw new AppError("A carga solicitada não existe", 404);
    }

    if (carga.ativo === 0) {
      throw new AppError(
        `A carga solicitada foi excluída pelo usuário ${carga.usuario}`,
        403
      );
    }

    return carga;
  }
}

export class UseCaseDeleteCarga {
  async run(id: string, usuario: string) {
    const cargaRepository = new CargaRepository();
    if (!id) {
      throw new AppError("Id inválido", 400);
    }
    const carga = await cargaRepository.index(id);
    if (!carga) {
      throw new AppError("Carga não encontrada", 404);
    }

    return cargaRepository.update(carga.id, {
      ...carga,
      ativo: 0,
      usuario,
      data_atualizacao: new Date(),
    });
  }
}
