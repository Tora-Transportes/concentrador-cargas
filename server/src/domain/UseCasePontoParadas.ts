import AppError from "../models/AppError";
import IPontosParada from "../models/IPontosDeParada";
import { factoryPontoParada } from "../validations/PontoParadasValidation";
import { PontoParadaRepository } from "./../repositories/PontoParadaRepository";
const dataAtual = new Date();

export class UseCaseAddPontoParadas {
  constructor(
    private readonly pontoParadaRepository = new PontoParadaRepository()
  ) {}

  async run(dataParada: IPontosParada) {
    const validator = factoryPontoParada();
    const pontoParada: IPontosParada = await validator.validate(dataParada, {
      abortEarly: false,
      stripUnknown: true,
    });
    const dadosParada = { ...dataParada, DATA_CADASTRO: dataAtual };
    const previsao = dadosParada.PREVISAO;
    dadosParada.PREVISAO = new Date(String(previsao));
    await this.pontoParadaRepository.create(dadosParada);

    return pontoParada;
  }
}

export class UseCaseUpdatePontoParada {
  constructor(
    private readonly pontoParadaRepository = new PontoParadaRepository()
  ) {}

  async run(id: number, dataParada: IPontosParada) {
    const existeRota = await this.pontoParadaRepository.index(id);
    if (!existeRota) throw new AppError("O Ponto de parada não existe", 400);
    const validator = factoryPontoParada();
    const pontoParada: IPontosParada = await validator.validate(dataParada, {
      abortEarly: false,
      stripUnknown: true,
    });

    const previsao = dataParada.PREVISAO;
    dataParada.PREVISAO = new Date(String(previsao));
    const dadosParada = { ...pontoParada, DATA_ATUALIZACAO: dataAtual };
    return await this.pontoParadaRepository.update(id, dadosParada);
  }
}

const instancias = {
  useCaseAddPontoParadas: new UseCaseAddPontoParadas(),
  useCaseUpdatePontoParadas: new UseCaseUpdatePontoParada(),
};
export default instancias;
