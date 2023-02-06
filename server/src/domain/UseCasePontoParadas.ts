import AppError from "../models/AppError";
import IPontosParada, {
  IInfo_passagem,
  IPontosParadaPath,
} from "../models/IPontosDeParada";
import { formatDateObject } from "../Utils/formatData";
import {
  factoryPontoParada,
  factoryPontoParadaPatch,
} from "../validations/PontoParadasValidation";
import { PontoParadaRepository } from "./../repositories/PontoParadaRepository";
const dataAtual = new Date();

export class UseCaseAddPontoParadas {
  constructor(
    private readonly pontoParadaRepository = new PontoParadaRepository()
  ) {}

  async run(dataParada: IPontosParada) {
    const validator = factoryPontoParada();
    const pontoParada: IPontosParada = await validator.validate(dataParada, {
      abortEarly: false,
      stripUnknown: true,
    });
    const dadosParada = { ...dataParada, DATA_CADASTRO: dataAtual };
    dadosParada.PREVISAO = new Date(String(dadosParada.PREVISAO));
    dadosParada.PREVISAO_SAIDA = new Date(String(dadosParada.PREVISAO_SAIDA));
    await this.pontoParadaRepository.create(dadosParada);

    return pontoParada;
  }
}

export class UseCaseSearchPontoParada {
  constructor(
    private readonly pontoParadaRepository = new PontoParadaRepository()
  ) {}
  async run() {
    return await this.pontoParadaRepository.search();
  }
}
export class UseCaseSearchPontoParadaIdCarga {
  constructor(
    private readonly pontoParadaRepository = new PontoParadaRepository()
  ) {}
  async run(idCarga: number) {
    if (!idCarga)
      throw new AppError("Id da carga é um parâmetro obrigatório!", 400);
    return await this.pontoParadaRepository.searchOfIdCarga(idCarga);
  }
}

export class UseCaseUpdatePontoParadaRota {
  constructor(
    private readonly pontoParadaRepository = new PontoParadaRepository()
  ) {}

  async run(id: number, dataParada: IPontosParada) {
    const existeRota = await this.pontoParadaRepository.index(id);
    if (!existeRota) throw new AppError("O Ponto de parada não existe", 400);
    const validator = factoryPontoParada();
    const pontoParada: IPontosParada = await validator.validate(dataParada, {
      abortEarly: false,
      stripUnknown: true,
    });

    const previsao = dataParada.PREVISAO;
    dataParada.PREVISAO = new Date(String(previsao));
    const dadosParada = { ...pontoParada, DATA_ATUALIZACAO: dataAtual };
    return await this.pontoParadaRepository.update(id, dadosParada);
  }
}

export class UseCaseUpdatePontoParadaPartial {
  constructor(
    private readonly pontoParadaRepository = new PontoParadaRepository()
  ) {}

  async run(id: number, bodyParada: IPontosParadaPath) {
    const existeRota = await this.pontoParadaRepository.index(id);
    if (!existeRota) throw new AppError("O Ponto de parada não existe", 400);
    const validator = factoryPontoParadaPatch();
    const pontoParada: IPontosParadaPath = await validator.validate(
      bodyParada,
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );
    // if (bodyParada.COLETA_EFETIVA_POSTO30) {
    //   bodyParada.COLETA_EFETIVA_POSTO30 = new Date(
    //     bodyParada.COLETA_EFETIVA_POSTO30
    //   );
    // }
    const dadosParada = { ...pontoParada, DATA_ATUALIZACAO: dataAtual };
    await this.pontoParadaRepository.updatePatch(id, dadosParada);
    return { mensagem: "Editado com sucesso!" };
  }
}
export class UseCaseUpdatePontoParada {
  constructor(
    private readonly pontoParadaRepository = new PontoParadaRepository()
  ) {}

  async run({
    ponto_passagem,
    ponto_passagem2,
    ponto_passagem3,
    ponto_passagem4,
    ponto_passagem5,
    ponto_passagem6,
    ponto_passagem7,
    id_carga,
  }: IInfo_passagem): Promise<void> {
    for (const [, value] of Object.entries({
      ponto_passagem,
      ponto_passagem2,
      ponto_passagem3,
      ponto_passagem4,
      ponto_passagem5,
      ponto_passagem6,
      ponto_passagem7,
    })) {
      if (
        (value.ponto &&
          value.ponto.length > 0 &&
          value.previsao !== "string") ||
        (typeof value.latitude !== "string" &&
          typeof value.longitude !== "string")
      ) {
        const existeRota = await this.pontoParadaRepository.index(value.id);
        if (!existeRota)
          throw new AppError("O Ponto de parada não existe", 400);
        const {
          id,
          idRotaCsn,
          client,
          ponto,
          tipoServico,
          previsao,
          latitude,
          longitude,
          coletaEfetiva,
          coletaEfetiva_posto30,
          coletaEfetiva_mundo,
          coletaEfetivaSaida,
          coletaEfetiva_peacao,
          tempServicoLocal,
          tempServicoLocalEntrega,
          entregaEfetivaSaida,
          entregaEfetiva,
          previsaoSaida,
        } = value;

        const dataDefault = {
          ID_ROTAS_CSN: idRotaCsn === null ? null : Number(idRotaCsn),
          ID_CON_CARGAS: Number(id_carga),
          PREVISAO: formatDateObject(new Date(previsao)),
          PREVISAO_SAIDA: formatDateObject(new Date(previsaoSaida)),
          STATUS_SERVICO: tipoServico.toUpperCase(),
          LATITUDE: latitude ? latitude : null,
          LONGITUDE: longitude ? longitude : null,
          CLIENTE: ponto === "" ? client : ponto,
          COLETA_EFETIVA:
            coletaEfetiva === null || coletaEfetiva === "Invalid date"
              ? null
              : formatDateObject(new Date(coletaEfetiva)),
          COLETA_EFETIVA_POSTO30:
            coletaEfetiva_posto30 === null ||
            coletaEfetiva_posto30 === "Invalid date"
              ? null
              : formatDateObject(new Date(coletaEfetiva_posto30)),
          COLETA_EFETIVA_MUNDO:
            coletaEfetiva_mundo === null ||
            coletaEfetiva_mundo === "Invalid date"
              ? null
              : formatDateObject(new Date(coletaEfetiva_mundo)),
          COLETA_EFETIVA_PEACAO:
            coletaEfetiva_peacao === null ||
            coletaEfetiva_peacao === "Invalid date"
              ? null
              : formatDateObject(new Date(coletaEfetiva_peacao)),
          ENTREGA_EFETIVA:
            entregaEfetiva === null || entregaEfetiva === "Invalid date"
              ? null
              : formatDateObject(new Date(entregaEfetiva)),
          SAIDA_EFETIVA_COLETA:
            coletaEfetivaSaida === null || coletaEfetivaSaida === "Invalid date"
              ? null
              : formatDateObject(new Date(coletaEfetivaSaida)),
          SAIDA_EFETIVA_ENTREGA:
            entregaEfetivaSaida === null ||
            entregaEfetivaSaida === "Invalid date"
              ? null
              : formatDateObject(new Date(entregaEfetivaSaida)),
          TEMP_SERV_LOCAL_COLETA: tempServicoLocal,
          TEMP_SERV_LOCAL_ENTREGA: tempServicoLocalEntrega,
        };
        const validator = factoryPontoParada();
        const pontoParada: IPontosParada = await validator.validate(
          dataDefault,
          {
            abortEarly: false,
            stripUnknown: true,
          }
        );

        const dadosParada = { ...pontoParada, DATA_ATUALIZACAO: dataAtual };
        await this.pontoParadaRepository.update(id, dadosParada);
      }
    }
  }
}

export class UseCaseDeletePontoParada {
  constructor(
    private readonly pontoParadaRepository = new PontoParadaRepository()
  ) {}
  async run(id: number) {
    const existePontoParada = await this.pontoParadaRepository.index(id);
    if (!existePontoParada)
      throw new AppError("A Parada informada não existe", 400);
    await this.pontoParadaRepository.delete(id);
    return "Ponto de parada deletada com sucesso.";
  }
}

const instancias = {
  useCaseAddPontoParadas: new UseCaseAddPontoParadas(),
  useCaseSearchPontoParada: new UseCaseSearchPontoParada(),
  useCaseUpdatePontoParadas: new UseCaseUpdatePontoParada(),
  useCaseUpdatePontoParadasRota: new UseCaseUpdatePontoParadaRota(),
  useCaseDeletePontoParada: new UseCaseDeletePontoParada(),
  useCaseUpdatePontoParadaPartial: new UseCaseUpdatePontoParadaPartial(),
  useCaseSearchPontoParadaIdCarga: new UseCaseSearchPontoParadaIdCarga(),
};
export default instancias;
