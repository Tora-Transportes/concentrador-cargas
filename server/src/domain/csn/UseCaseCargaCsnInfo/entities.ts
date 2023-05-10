import { PontoParadaRepository } from "./../../../repositories/PontoParadaRepository";
import AppError from "../../../models/AppError";
import { ICarga } from "../../../models/ICargas";
import {
  IPaginationResult,
  IResultExcel,
} from "../../../repositories/CargaRepository";
import { UseCaseUpdateCarga } from "../../UseCaseCarga/entities";
import { UseCaseUpdatePontoParada } from "../../UseCasePontoParadas";
import { calculateDiffDate } from "../../../Utils/formatData";

export interface IRepositorySearchCsn {
  search(
    query: Record<string, any>,
    page?: number,
    pageSize?: number
  ): Promise<IPaginationResult<ICarga>>;
  index(id: number): Promise<ICarga | undefined>;
  indexOfSituacaoEndPlaca(
    placa: string
  ): Promise<IResultExcel<ICarga> | undefined>;
}

export class UseCaseViewCargasCsnInfo {
  constructor(private cargaCsnInfoRepository: IRepositorySearchCsn) {}

  async run(filter: Record<string, any>) {
    let { busca_inicio, busca_fim } = filter;

    if (Date.parse(busca_inicio) && Date.parse(busca_fim)) {
      const diff = await calculateDiffDate(busca_inicio, busca_fim);

      if (diff > 30) {
        throw new AppError(
          "O período entre as datas não pode ser maior que 30 dias.",
          400
        );
      }

      busca_inicio = new Date(busca_inicio);
      busca_fim = new Date(busca_fim);

      const dateObject = busca_fim;
      dateObject.setHours(23);
      dateObject.setMinutes(59);
      filter.busca_inicio = busca_inicio;
      filter.busca_fim = dateObject;
    } else {
      const dataAtual = new Date();
      dataAtual.setDate(dataAtual.getDate() - 30);
      filter.busca_inicio = new Date(new Date(dataAtual.toISOString()));
      filter.busca_fim = new Date();
    }

    const busca = { ...filter, ativo: 1, carga_csn: 1 };
    return await this.cargaCsnInfoRepository.search(
      busca,
      filter.page,
      filter.limit ?? 5
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
  async indexOfSituacaoEndPlaca(placa: string) {
    const carga = await this.cargaCsnInfoRepository.indexOfSituacaoEndPlaca(
      placa
    );
    return carga;
  }
}

export class UseCaseUpdateInfoCarga {
  constructor(
    private useCaseUpdatePontoParada: UseCaseUpdatePontoParada,
    private useCaseUpdateCargaPadrao: UseCaseUpdateCarga,
    private pontoParadaRepository: PontoParadaRepository
  ) {}
  async run(cargaDTO: Record<string, any>, oid: string) {
    const { info_passagem, ...dataPadrao } = cargaDTO;
    const id_carga = dataPadrao.id;
    await this.useCaseUpdatePontoParada.run({ ...info_passagem, id_carga });

    if (dataPadrao?.fk_situacao === 6) {
      const existePontoParada =
        await this.pontoParadaRepository.getOfIdConCarga(id_carga);

      const dataDiffExistente: boolean[] = [];
      existePontoParada?.forEach((elem) => {
        if (elem.COLETA_EFETIVA_POSTO30 !== null) dataDiffExistente.push(true);
        if (elem.COLETA_EFETIVA_MUNDO !== null) dataDiffExistente.push(true);
        if (elem.COLETA_EFETIVA_PEACAO !== null) dataDiffExistente.push(true);
        if (elem.SAIDA_EFETIVA_COLETA !== null) dataDiffExistente.push(true);
        if (elem.ENTREGA_EFETIVA !== null) dataDiffExistente.push(true);
        if (elem.SAIDA_EFETIVA_ENTREGA !== null) dataDiffExistente.push(true);
      });

      if (dataDiffExistente.length < 8)
        throw new AppError(
          "Não foi possível registrar as informações, verifique se todos campos estão prenchidos e tente novamente.",
          400
        );
    }

    const resultUpdateCarga = await this.useCaseUpdateCargaPadrao.run(
      dataPadrao,
      oid
    );

    return resultUpdateCarga;
  }
}
