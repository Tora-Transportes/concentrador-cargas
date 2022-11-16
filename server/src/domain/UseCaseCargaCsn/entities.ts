import { CargaCsnRepository } from "./../../repositories/CargaCsnRepository";
import { factoryCargaCsnValidator } from "../../validations/CargaCsnValidation";
import AppError from "../../models/AppError";
import { IEventSocket } from "../../socketsRoutes";
import ICargasCsn from "../../models/ICargasCsn";
import { PontoParadaRepository } from "../../repositories/PontoParadaRepository";

const dataAtual = new Date();

export class UseCaseAddRouter {
  constructor(private readonly cargaCsnRepository: CargaCsnRepository) {}

  async run(dataRota: ICargasCsn) {
    const validator = factoryCargaCsnValidator();
    const rota: ICargasCsn = await validator.validate(dataRota, {
      abortEarly: false,
      stripUnknown: true,
    });
    const dadosRota = { ...dataRota, DATA_CADASTRO: dataAtual };
    await this.cargaCsnRepository.create(dadosRota);

    return rota;
  }
}

export class UseCaseSearchRouter {
  constructor(private readonly cargaCsnRepository: CargaCsnRepository) {}
  async run() {
    //async run(filter: Record<string, any>) {
    // return await this.cargaCsnRepository.search(
    //   filter,
    //   filter.page,
    //   filter.limit || 5
    // );
    return await this.cargaCsnRepository.search();
  }
}

export class UseCaseUpdateRouter {
  constructor(
    private readonly cargaCsnRepository: CargaCsnRepository,
    private readonly notifyAll: (event: IEventSocket) => void
  ) {}

  async run(id: number, dataRota: Record<string, any>) {
    const existeRota = await this.cargaCsnRepository.index(id);
    if (!existeRota) throw new AppError("A rota informada não existe", 400);
    const validator = factoryCargaCsnValidator();
    const rota: ICargasCsn = await validator.validate(dataRota, {
      abortEarly: false,
      stripUnknown: true,
    });

    const dadosRota = { ...rota, DATA_ATUALIZACAO: dataAtual };
    return await this.cargaCsnRepository.update(id, dadosRota);
  }
}

export class UseCaseDeleteRouter {
  constructor(
    private readonly cargaCsnRepository: CargaCsnRepository,
    private readonly pontoParadaRepository: PontoParadaRepository,
    private readonly notifyAll: (event: IEventSocket) => void
  ) {}
  async run(id: number) {
    const existeRota = await this.cargaCsnRepository.index(id);
    if (!existeRota) throw new AppError("A rota informada não existe", 400);
    const existPontoParada = await this.pontoParadaRepository.getOfIdRotasCsn(
      Number(existeRota.ID)
    );

    if (existPontoParada) throw new AppError("", 204);

    await this.cargaCsnRepository.delete(id);
    return "Rota deletada com sucesso.";
  }
}
