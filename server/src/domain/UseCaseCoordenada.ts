import AppError from "../models/AppError";
import { CoordenadaRepository } from "../repositories/CoordenadaRepository";
export class UseCaseViewCoordenada {
  private coordenadaRepository: CoordenadaRepository;
  constructor() {
    this.coordenadaRepository = new CoordenadaRepository();
  }

  async run(filter: Record<string, any>, pageSize = 10) {
    return this.coordenadaRepository.list(filter, pageSize);
  }
}

export class UseCaseUpdateDadosCoordenada {
  private coordenadaRepository: CoordenadaRepository;
  constructor() {
    this.coordenadaRepository = new CoordenadaRepository();
  }

  async run(
    placa: string,
    { observacao }: Record<string, string>,
    usuario: string
  ) {
    const coordenadas = await this.coordenadaRepository.list({ placa });
    if (coordenadas.results.length === 0) {
      throw new AppError(
        "A placa registrada não existe na listagem das coordenadas",
        400
      );
    }
    return this.coordenadaRepository.update(placa, {
      observacao,
      usuario_observacao: usuario,
    });
  }
}

const instancias = {
  UseCaseViewCoordenada: new UseCaseViewCoordenada(),
  UseCaseUpdateDadosCoordenada: new UseCaseUpdateDadosCoordenada(),
};
export default instancias;
