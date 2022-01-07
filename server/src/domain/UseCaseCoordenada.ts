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

const instancias = {
  UseCaseViewCoordenada: new UseCaseViewCoordenada(),
};
export default instancias;
