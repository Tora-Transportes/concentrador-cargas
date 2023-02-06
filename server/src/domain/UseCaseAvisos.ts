import IModelAvisos from "../models/Avisos";
import { factoryAvisos } from "../validations/AvisosValidator";
import { AvisosRepository } from "./../repositories/AvisosRepository";

export class UseCaseAddAvisos {
  private readonly avisosRepository: AvisosRepository;
  private readonly dataAtual: Date;
  constructor() {
    this.avisosRepository = new AvisosRepository();
    this.dataAtual = new Date();
  }

  async run(dataAviso: IModelAvisos) {
    const validator = factoryAvisos();
    const dataValidator = await validator.validate(dataAviso, {
      abortEarly: false,
      stripUnknown: true,
    });
    const bodyAviso = { ...dataAviso, DATA_CADASTRO: this.dataAtual };
    await this.avisosRepository.create(bodyAviso);

    return dataValidator;
  }
}
