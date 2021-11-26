import {
  AddCargaRepository,
  UpdateCargaRepository,
  ViewCargaRepository,
} from "../repositories/CargaRepository";
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

    const cargasCadastradas = (
      await new ViewCargaRepository().run({
        id: carga.id,
      })
    ).results;
    if (cargasCadastradas.length > 0) {
      throw new AppError("Uma carga com esse Código já foi cadastrada", 400);
    }

    await new AddCargaRepository().save(carga);
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

    const cargasCadastradas = (
      await new ViewCargaRepository().run({
        id: carga.id,
      })
    ).results;
    if (cargasCadastradas.length === 0) {
      throw new AppError(
        `Nenhuma carga foi encontrada com o código ${carga.id}`,
        404
      );
    } else if (cargasCadastradas[0].ativo === 0) {
      throw new AppError(
        `A carga foi desativada pelo usuario ${cargasCadastradas[0].usuario}`,
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

    await new UpdateCargaRepository().save(cargaOficial.id, cargaOficial);
    return carga;
  }
}

export class UseCaseViewCargas {
  async run(filter: Record<string, any>) {
    return new ViewCargaRepository().run({ ...filter, ativo: 1 }, filter.page);
  }

  async index(id: string) {
    const cargas = (await new ViewCargaRepository().run({ id })).results;
    if (cargas.length === 0) {
      throw new AppError("A carga solicitada não existe", 404);
    }

    if (cargas[0].ativo === 0) {
      throw new AppError(
        `A carga solicitada foi excluída pelo usuário ${cargas[0].usuario}`,
        403
      );
    }

    return cargas[0];
  }
}

export class UseCaseDeleteCarga {
  async run(id: string, usuario: string) {
    const viewRepository = new ViewCargaRepository();
    if (!id) {
      throw new AppError("Id inválido", 400);
    }
    const carga = (await viewRepository.run({ id })).results;
    if (carga.length === 0) {
      throw new AppError("Carga não encontrada", 404);
    }

    return new UpdateCargaRepository().save(carga[0].id, {
      ...carga[0],
      ativo: 0,
      usuario,
    });
  }
}
