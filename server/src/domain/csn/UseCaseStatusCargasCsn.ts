import { StatusCargaCsnRepository } from "../../repositories/csn/StatusCargaCsnRepository";

export class UseCaseStatusCargaCsn {
  async run(filter: Record<string, unknown>) {
    const statusRepository = new StatusCargaCsnRepository();
    return statusRepository.search(filter);
  }
}
