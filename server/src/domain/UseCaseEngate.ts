import { EngateRepository } from "../repositories/csn/EngateRepository";
import IEngate from "../models/Engate";
import { factoryEngate } from "../validations/EngateValidator";
import AppError from "../models/AppError";
import { Buffer } from "buffer";

interface IUseCaseCreateProcessEngate {
  run(dados: Omit<IEngate, "ID">, path: string): Promise<void>;
}

interface IUseCaseSearchAllProcessEngate {
  run(): Promise<IEngate[]>;
}

interface IUseCaseUpdateProcessEngate {
  run(dados: IEngate, id: number): Promise<void>;
}

class UseCaseCreateProcessEngate implements IUseCaseCreateProcessEngate {
  private readonly engateRepository: EngateRepository;
  constructor(engateRepository: EngateRepository) {
    this.engateRepository = engateRepository;
  }
  async run(dados: Omit<IEngate, "ID">, path: string): Promise<void> {
    const validator = factoryEngate();
    await validator.validate(dados, {
      abortEarly: false,
      stripUnknown: true,
    });

    await this.engateRepository.create(
      { ...dados, DATA_CADASTRO: new Date() },
      path
    );
  }
}

class UseCaseSearchAllProcessEngate implements IUseCaseSearchAllProcessEngate {
  private readonly engateRepository: EngateRepository;
  constructor(engateRepository: EngateRepository) {
    this.engateRepository = engateRepository;
  }
  async run(): Promise<IEngate[]> {
    const results: IEngate[] = await this.engateRepository.searchAll();

    const responseList = results.map((objeto: IEngate) => {
      if (objeto.PDF && objeto.PDF instanceof Buffer) {
        const base64String = objeto.PDF.toString("base64");
        objeto.PDF = base64String;
      }
      return objeto;
    });

    return responseList;
  }
}

class UseCaseUpdateProcessEngate implements IUseCaseUpdateProcessEngate {
  private readonly engateRepository: EngateRepository;
  constructor(engateRepository: EngateRepository) {
    this.engateRepository = engateRepository;
  }
  async run(dados: IEngate, id: number): Promise<void> {
    if (isNaN(Number(id))) {
      throw new AppError("O ID do engate deve ser um número.", 400);
    }

    const existeInfo = this.engateRepository.searchIndex(Number(dados.ID));
    if (!existeInfo) throw new AppError("Id do engate não existe.", 404);
    const validator = factoryEngate();
    await validator.validate(dados, {
      abortEarly: false,
      stripUnknown: true,
    });

    await this.engateRepository.update(
      {
        ...dados,
        DATA_ATUALIZACAO: new Date(),
      },
      id
    );
  }
}

const engateRepository = new EngateRepository();
export default {
  useCaseCreateProcessEngate: new UseCaseCreateProcessEngate(engateRepository),
  useCaseSearchAllProcessEngate: new UseCaseSearchAllProcessEngate(
    engateRepository
  ),
  useCaseUpdateProcessEngate: new UseCaseUpdateProcessEngate(engateRepository),
};
