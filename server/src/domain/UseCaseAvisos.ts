import {
  dateAtualMoment,
  verificarDataStringValida,
} from "./../Utils/formatData";
import AppError from "../models/AppError";
import IModelAvisos from "../models/Avisos";
import { factoryAvisos } from "../validations/AvisosValidator";
import { AvisosRepository } from "./../repositories/AvisosRepository";
import { notifyAll } from "../socketsRoutes";
class VerificacaoExisteAviso {
  async run(id: number, avisosRepository: AvisosRepository) {
    const existeAviso = await avisosRepository.index(id);
    if (!existeAviso) throw new AppError("O Aviso selecionado não existe", 404);
    return existeAviso;
  }
}
class UseCaseAddAvisos {
  private readonly avisosRepository: AvisosRepository;
  private readonly notifyAllAviso: typeof notifyAll;
  constructor() {
    this.avisosRepository = new AvisosRepository();
    this.notifyAllAviso = notifyAll;
  }

  async run(dataAviso: IModelAvisos): Promise<string> {
    const validator = factoryAvisos();
    dataAviso.DATA_CADASTRO = new Date(dateAtualMoment());
    await validator.validate(dataAviso, {
      abortEarly: false,
      stripUnknown: true,
    });
    await this.avisosRepository.create(dataAviso);
    const { ID } = await this.avisosRepository.lastIdAviso();
    this.notifyAllAviso({
      name: "@aviso-create",
      details: await this.avisosRepository.index(Number(ID)),
    });
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
  async run(filter: any) {
    if (filter.data) {
      if (!verificarDataStringValida(filter.data))
        throw new AppError("Formato de data inválido", 400);
    }
    return await this.avisosRepository.search(
      filter,
      filter.page,
      filter.limit || 10
    );
  }
}
export class UseCaseLastIdAviso {
  private readonly avisosRepository: AvisosRepository;
  constructor() {
    this.avisosRepository = new AvisosRepository();
  }
  async run() {
    return await this.avisosRepository.lastIdAviso();
  }
}

export class UseCaseUpdateAvisos {
  private readonly avisosRepository: AvisosRepository;
  private readonly verificaExisteAviso: VerificacaoExisteAviso;
  private readonly notifyAllAviso: typeof notifyAll;
  constructor() {
    this.avisosRepository = new AvisosRepository();
    this.verificaExisteAviso = new VerificacaoExisteAviso();
    this.notifyAllAviso = notifyAll;
  }

  async run(id: number, dataAviso: IModelAvisos): Promise<void> {
    await this.verificaExisteAviso.run(id, this.avisosRepository);
    const validator = factoryAvisos();
    dataAviso.DATA_ATUALIZACAO = new Date(dateAtualMoment());
    await validator.validate(dataAviso, {
      abortEarly: false,
      stripUnknown: true,
    });
    await this.avisosRepository.update(id, dataAviso);
    const { ID } = await this.avisosRepository.lastIdAviso();
    this.notifyAllAviso({
      name: "@aviso-update",
      details: await this.avisosRepository.index(Number(ID)),
    });
  }
}
export class UseCasePathUpdateAvisos {
  private readonly avisosRepository: AvisosRepository;
  private readonly verificaExisteAviso: VerificacaoExisteAviso;
  constructor() {
    this.avisosRepository = new AvisosRepository();
    this.verificaExisteAviso = new VerificacaoExisteAviso();
  }

  async run(id: number, dataAviso: IModelAvisos): Promise<IModelAvisos> {
    await this.verificaExisteAviso.run(id, this.avisosRepository);
    dataAviso.DATA_ATUALIZACAO = new Date(dateAtualMoment());
    await this.avisosRepository.pathUpdate(id, dataAviso);
    return dataAviso;
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
  useCaseLastIdAviso: new UseCaseLastIdAviso(),
  useCaseAllAvisos: new UseCaseAllAvisos(),
  useCaseUpdateAvisos: new UseCaseUpdateAvisos(),
  useCasePathUpdateAvisos: new UseCasePathUpdateAvisos(),
  useCaseDeleteAvisos: new UseCaseDeleteAvisos(),
};

export default instancias;
