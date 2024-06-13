import { ICarga } from "./../models/ICargas";
import { CargaRepository } from "./../repositories/CargaRepository";
import AppError from "../models/AppError";
import CargasAppRespository from "../repositories/AppTora/CargasAppRespository";

interface IAppToraValidator {
  validatorCancelamento(idCarga: number): Promise<ICarga>;
  validatorAprovacao(placa: string, idCarga: number): Promise<ICarga>;
}

class AppToraValidator implements IAppToraValidator {
  private cargaRepository: CargaRepository;
  constructor() {
    this.cargaRepository = new CargaRepository();
  }

  public async validatorAprovacao(
    placa: string,
    idCarga: number
  ): Promise<ICarga> {
    if (!placa || !idCarga)
      throw new AppError(
        "Placa e id da Carga são parametros obrigatórios!",
        400
      );

    if (placa.length !== 7)
      throw new AppError("Placa com formato invalido!", 400);

    const existeCarga = await CargasAppRespository.indexId(idCarga);
    if (!existeCarga)
      throw new AppError("A carga com id informado não existe.", 404);

    return existeCarga;
  }

  public async validatorCancelamento(idCarga: number): Promise<ICarga> {
    if (!idCarga)
      throw new AppError("id da Carga é parametro obrigatório!", 400);

    const existeCarga = await CargasAppRespository.indexId(idCarga);

    if (!existeCarga)
      throw new AppError("Não existe carga vinculada ao id informado.", 404);

    return existeCarga;
  }
}

export default new AppToraValidator();
