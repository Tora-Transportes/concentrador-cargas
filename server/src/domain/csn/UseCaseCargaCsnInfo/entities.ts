import AppError from "../../../models/AppError";
import { ICarga } from "../../../models/ICargas";
import { IPaginationResult } from "../../../repositories/CargaRepository";
export interface IRepositorySearchCsn {
  search(
    query: Record<string, any>,
    page?: number,
    pageSize?: number
  ): Promise<IPaginationResult<ICarga>>;
  index(id: number): Promise<ICarga | undefined>;
}

export class UseCaseViewCargasCsnInfo {
  constructor(private cargaCsnInfoRepository: IRepositorySearchCsn) {}

  async run(filter: Record<string, any>) {
    return this.cargaCsnInfoRepository.search(
      { ...filter, ativo: 1, carga_csn: 1 },
      filter.page,
      filter.limit || 5
    );
  }
}

export class UseCaseViewCargasCsn {
  constructor(private cargaCsnInfoRepository: IRepositorySearchCsn) {}
  async index(id: number) {
    const carga = await this.cargaCsnInfoRepository.index(id);
    if (!carga) {
      throw new AppError("A carga solicitada não existe", 404);
    }

    if (carga.ativo === 0) {
      throw new AppError(
        `A carga solicitada foi excluída pelo usuário ${carga.usuario}`,
        403
      );
    }

    return carga;
  }
}
