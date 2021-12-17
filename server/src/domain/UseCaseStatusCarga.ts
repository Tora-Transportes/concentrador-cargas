import { StatusCargaRepository } from "../repositories/StatusCargaRepository";

export class UseCaseStatusCarga {
  async run(filter: Record<string, unknown>) {
    const statusRepository = new StatusCargaRepository();
    return statusRepository.search(filter);
  }
}
