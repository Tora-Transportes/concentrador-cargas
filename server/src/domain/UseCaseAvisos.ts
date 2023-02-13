import { dateAtualMoment } from "./../Utils/formatData";
import AppError from "../models/AppError";
import IModelAvisos from "../models/Avisos";
import { factoryAvisos } from "../validations/AvisosValidator";
import { AvisosRepository } from "./../repositories/AvisosRepository";
class VerificacaoExisteAviso {
  async run(id: number, avisosRepository: AvisosRepository) {
    const existeAviso = await avisosRepository.index(id);
    if (!existeAviso) throw new AppError("O Aviso selecionado não existe", 404);
    return existeAviso;
  }
}
class UseCaseAddAvisos {
  private readonly avisosRepository: AvisosRepository;
  constructor() {
    this.avisosRepository = new AvisosRepository();
  }

  async run(dataAviso: IModelAvisos): Promise<string> {
    const validator = factoryAvisos();
    dataAviso.DATA_CADASTRO = new Date(dateAtualMoment());
    await validator.validate(dataAviso, {
      abortEarly: false,
      stripUnknown: true,
    });
    await this.avisosRepository.create(dataAviso);
    return "Aviso criado com sucesso!";
  }
}

export class UseCaseIndexAvisos {
  private readonly avisosRepository: AvisosRepository;
  private readonly verificaExisteAviso: VerificacaoExisteAviso;
  constructor() {
    this.avisosRepository = new AvisosRepository();
    this.verificaExisteAviso = new VerificacaoExisteAviso();
  }
  async run(id: number) {
    const aviso = await this.verificaExisteAviso.run(id, this.avisosRepository);
    return aviso;
  }
}

export class UseCaseAllAvisos {
  private readonly avisosRepository: AvisosRepository;
  constructor() {
    this.avisosRepository = new AvisosRepository();
  }
  async run() {
    return await this.avisosRepository.search();
  }
}

export class UseCaseUpdateAvisos {
  private readonly avisosRepository: AvisosRepository;
  private readonly verificaExisteAviso: VerificacaoExisteAviso;
  constructor() {
    this.avisosRepository = new AvisosRepository();
    this.verificaExisteAviso = new VerificacaoExisteAviso();
  }

  async run(id: number, dataAviso: IModelAvisos): Promise<IModelAvisos> {
    await this.verificaExisteAviso.run(id, this.avisosRepository);
    const validator = factoryAvisos();
    dataAviso.DATA_ATUALIZACAO = new Date(dateAtualMoment());
    const aviso = await validator.validate(dataAviso, {
      abortEarly: false,
      stripUnknown: true,
    });
    await this.avisosRepository.update(id, aviso);
    return aviso;
  }
}

export class UseCaseDeleteAvisos {
  private readonly avisosRepository: AvisosRepository;
  private readonly verificaExisteAviso: VerificacaoExisteAviso;
  constructor() {
    this.avisosRepository = new AvisosRepository();
    this.verificaExisteAviso = new VerificacaoExisteAviso();
  }
  async run(id: number) {
    await this.verificaExisteAviso.run(id, this.avisosRepository);
    await this.avisosRepository.delete(id);
    return "Aviso deletado com sucesso!";
  }
}

const instancias = {
  useCaseAddAvisos: new UseCaseAddAvisos(),
  useCaseIndexAvisos: new UseCaseIndexAvisos(),
  useCaseAllAvisos: new UseCaseAllAvisos(),
  useCaseUpdateAvisos: new UseCaseUpdateAvisos(),
  useCaseDeleteAvisos: new UseCaseDeleteAvisos(),
};

export default instancias;
