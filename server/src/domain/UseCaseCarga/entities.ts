import { RotasPendentesRepository } from "../../repositories/RotasPendentesRepository";
import { IPaginationResult } from "../../repositories/CargaRepository";
import { IEventSocket } from "../../socketsRoutes";
import { ICarga } from "../../models/ICargas";
import { factoryCargaValidator } from "../../validations/CargaValidator";
import AppError from "../../models/AppError";
import { ServiceDistanceLocations } from "../../services/ServiceDistanceLocations";
import TokenAd from "../../models/TokenAd";
import TextUtils from "../../Utils/text";

import xlsx from "xlsx";

export interface IRepositoryAddCarga {
  create(carga: ICarga): Promise<ICarga>;
  index(id: string): Promise<ICarga | undefined>;
  search(
    query: Record<string, any>,
    page?: number,
    pageSize?: number
  ): Promise<IPaginationResult<ICarga>>;
  bulkCreate(cargas: ICarga[]): Promise<any>;
}
export class UseCaseAddCarga {
  constructor(
    private cargaRepository: IRepositoryAddCarga,
    private notifyAll: (event: IEventSocket) => void
  ) {}
  async run(cargaDTO: Record<string, any>) {
    const validator = factoryCargaValidator();
    const carga: ICarga = await validator.validate(cargaDTO, {
      abortEarly: false,
      stripUnknown: true,
    });

    const currentDate = new Date();
    carga.data_atualizacao = currentDate;
    carga.data_cadastro = currentDate;
    carga.quantidade_atual = carga.quantidade_atual || carga.quantidade;

    const cargasCadastrada = await this.cargaRepository.index(carga.id);
    if (cargasCadastrada) {
      throw new AppError("Uma carga com esse Código já foi cadastrada", 400);
    }

    // Esse bloco funciona para a importacao de cargas
    if (carga.documento_transporte) {
      const cargaImportada = await this.cargaRepository.search({
        documento_transporte: carga.documento_transporte,
        tipo_carga: carga.tipo_carga,
      });

      if (cargaImportada.results.length > 0) {
        console.log(cargaImportada, "duplicada com ", carga);
        throw new AppError(
          "A carga já foi cadastrada com o conjunto documento de transporte + tipo de carga",
          409
        );
      }
    }
    //////////////////////////////////////////////////

    carga.fk_situacao = 1;
    if (Number(carga.placa_veiculo?.length) > 5) {
      carga.fk_situacao = 2;
    }
    await this.cargaRepository.create(carga);
    this.notifyAll({
      name: "@carga-create",
      details: await this.cargaRepository.index(carga.id),
    });
    return carga;
  }
}

export interface IRepositoryUpdateCarga extends IRepositoryAddCarga {
  update(id: string, carga: ICarga): Promise<ICarga>;
}
export class UseCaseAddCargaDerivada {
  constructor(
    private cargaRepository: IRepositoryUpdateCarga,
    private notifyAll: (event: IEventSocket) => void
  ) {}
  async run(cargaDTO: Record<string, any>) {
    const validator = factoryCargaValidator();
    const carga: ICarga = await validator.validate(cargaDTO, {
      abortEarly: false,
      stripUnknown: true,
    });

    const currentDate = new Date();
    carga.data_atualizacao = currentDate;
    carga.data_cadastro = currentDate;
    carga.quantidade_atual = carga.quantidade_atual || carga.quantidade;
    carga.e_lote = false;

    const lotePai = await this.cargaRepository.index(cargaDTO.fk_lote_pai);
    if (!lotePai) {
      throw new AppError("O lote pai informado não existe", 400);
    }

    const cargasCadastrada = await this.cargaRepository.index(carga.id);
    if (cargasCadastrada) {
      throw new AppError("Uma carga com esse Código já foi cadastrada", 400);
    }

    const quantidadeRestante =
      Number(lotePai.quantidade_atual) - Number(carga.quantidade);
    if (quantidadeRestante < 0) {
      throw new AppError(
        "A quantidade informada para a carga ultrapassa os limites do lote",
        400
      );
    }

    const novoPai = validator.cast(lotePai, { stripUnknown: true }) as ICarga;
    carga.fk_situacao = 1;
    if (Number(carga.placa_veiculo?.length) > 5) {
      carga.fk_situacao = 2;
    }
    await this.cargaRepository.create(carga);
    await this.cargaRepository.update(lotePai.id, {
      ...novoPai,
      quantidade_atual: quantidadeRestante,
    });
    this.notifyAll({
      name: "@carga-create",
      details: await this.cargaRepository.index(carga.id),
    });
    this.notifyAll({
      name: "@carga-update",
      details: await this.cargaRepository.index(lotePai.id),
    });
    return carga;
  }
}

export interface IUserRepository {
  index(oid: string): Promise<any>;
}
export class UseCaseUpdateCarga {
  constructor(
    private cargaRepository: IRepositoryUpdateCarga,
    private userRepository: IUserRepository,
    private notifyAll: (event: IEventSocket) => void
  ) {}
  async run(cargaDTO: Record<string, any>, oid: string) {
    const validator = factoryCargaValidator();
    const carga: ICarga = await validator.validate(cargaDTO, {
      abortEarly: false,
      stripUnknown: true,
    });

    const currentDate = new Date();
    carga.data_atualizacao = currentDate;
    carga.quantidade_atual = carga.quantidade_atual || carga.quantidade;

    const cargaCadastrada = await this.cargaRepository.index(carga.id);
    if (!cargaCadastrada) {
      throw new AppError(
        `Nenhuma carga foi encontrada com o código ${carga.id}`,
        404
      );
    } else if (cargaCadastrada.ativo === 0) {
      throw new AppError(
        `A carga foi desativada pelo usuario ${cargaCadastrada.usuario}`,
        403
      );
    }

    // O usuario deve ter permissao para aprovar o status da carga para 3 - Aprovado pelo GR ou 4 - veiculo reprovado
    const user = await this.userRepository.index(oid);
    if (
      [3, 4].includes(Number(carga.fk_situacao)) &&
      Number(cargaCadastrada.fk_situacao) === 2
    ) {
      if (!user?.permissoes.includes("APROVAR_VEICULOS")) {
        throw new AppError(
          "O usuário informado não possui a permissão 'APROVAR_VEICULOS'",
          403
        );
      }
    }

    // O status passa a ser "Veículo atribuido" caso a placa seja definida e a situação seja 1 ou 4
    if (
      [1, 4].includes(Number(cargaCadastrada.fk_situacao)) &&
      carga.placa_veiculo
    ) {
      carga.fk_situacao = 2;
    }

    if ([3, 4].includes(Number(carga.fk_situacao)) && !carga.observacao_gr) {
      throw new AppError(
        "Observação deve ser especificada ao aprovar ou reprovar veículos",
        400
      );
    }

    if (carga.fk_situacao === 1 && carga.placa_veiculo) {
      carga.fk_situacao = cargaCadastrada.fk_situacao;
    }

    // Caso o veículo não possua uma placa cadastrada sua situação vai voltar para "aguardando alocação" ou "veiculo reprovado"
    if (!carga.placa_veiculo) {
      carga.fk_situacao = 1;
    }

    // lotes nao podem virar cargas, porem cargas podem virar lotes
    if (carga.e_lote === false && cargaCadastrada.e_lote === true) {
      carga.e_lote = true;
    }

    // Os lotes nao podem ter sua unidade de medida e quantidade alterados
    if (carga.unidade_medida && cargaCadastrada.e_lote) {
      carga.unidade_medida = cargaCadastrada.unidade_medida;
    }
    if (carga.quantidade && cargaCadastrada.e_lote) {
      carga.quantidade = cargaCadastrada.quantidade;
    }
    // ao atualizar o lote nao se deve resetar a contagem da quantidade_atual
    if (cargaCadastrada.e_lote) {
      carga.quantidade_atual = cargaCadastrada.quantidade_atual;
    }

    carga.placa_veiculo = carga.placa_veiculo
      ? carga.placa_veiculo.trim().toUpperCase()
      : carga.placa_veiculo;

    const { janela_entrega, janela_coleta, e_lote } = carga;
    const cargaOficial = validator.cast(
      {
        ...carga,
        data_atualizacao: currentDate,
        janela_entrega: e_lote ? null : janela_entrega,
        janela_coleta: e_lote ? null : janela_coleta,
      },
      { stripUnknown: true }
    ) as ICarga;
    await this.cargaRepository.update(cargaOficial.id, cargaOficial);
    this.notifyAll({
      name: "@carga-update",
      details: await this.cargaRepository.index(carga.id),
    });
    return cargaOficial;
  }
}

export class UseCaseViewCargas {
  constructor(private cargaRepository: IRepositoryUpdateCarga) {}
  async run(filter: Record<string, any>) {
    return this.cargaRepository.search(
      { ...filter, ativo: 1 },
      filter.page,
      filter.limit || 5
    );
  }

  async index(id: string) {
    const carga = await this.cargaRepository.index(id);
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

export class UseCaseDeleteCarga {
  constructor(
    private cargaRepository: IRepositoryUpdateCarga,
    private notifyAll: (event: IEventSocket) => void
  ) {}
  async run(id: string, usuario: string) {
    if (!id) {
      throw new AppError("Id inválido", 400);
    }
    const carga = await this.cargaRepository.index(id);
    if (!carga) {
      throw new AppError("Carga não encontrada", 404);
    }
    const validator = factoryCargaValidator();
    const cargaAtualizada = {
      ...validator.cast(carga, { stripUnknown: true }),
      ativo: 0,
      usuario,
      data_atualizacao: new Date(),
    };

    await this.cargaRepository.update(carga.id, cargaAtualizada as ICarga);
    this.notifyAll({
      name: "@carga-delete",
      details: { id },
    });
    return cargaAtualizada;
  }
}

export class UseCaseGetDistanceBetween {
  async run(search: Record<string, any>) {
    const clone = { ...search };
    for (const i in clone) {
      clone[i] = clone[i]?.toUpperCase();
    }
    const { cidade_origem, cidade_destino, estado_origem, estado_destino } =
      clone;
    if (estado_origem.length !== 2 || estado_destino.length !== 2) {
      throw new AppError("Deve ser informado a sigla dos estados", 400);
    }
    const service = new ServiceDistanceLocations();
    const distance = await service.find({
      cidade_origem,
      cidade_destino,
      estado_origem,
      estado_destino,
    });

    if (distance === null) {
      const rotasRepository = new RotasPendentesRepository();
      const rota = await rotasRepository.findByNames({
        cidade_origem,
        cidade_destino,
        estado_origem,
        estado_destino,
      });

      if (!rota) {
        const id = await rotasRepository.getNextId();
        await rotasRepository.create({
          id,
          cidade_origem,
          cidade_destino,
          estado_origem,
          estado_destino,
        });
      }
      throw new AppError(
        "Não existe nenhuma rota cadastrada entre esses dois pontos",
        404
      );
    }

    return distance;
  }
}

export class UseCaseListPendentRoutes {
  async run(filter: Record<string, any>) {
    const rotasRepository = new RotasPendentesRepository();
    const { page } = filter;
    const clone = { ...filter };
    for (const i in clone) {
      if (clone[i] && isNaN(Number(clone[i]))) {
        clone[i] = String(clone[i]).toUpperCase();
      }
    }
    let currentPage = 1;
    if (!isNaN(Number(page))) {
      currentPage = Number(page);
    }
    const rotas = await rotasRepository.search(
      { ...filter, page: undefined },
      currentPage
    );
    return rotas;
  }
}

export class UseCaseImportCarga {
  constructor(private cargaRepository: IRepositoryAddCarga) {}
  async run(file: Buffer | undefined, usuario: string | undefined) {
    if (!file || !file?.buffer) {
      throw new AppError("O arquivo não foi enviado", 400);
    }
    const nomeUsuario = TokenAd.getClaims(String(usuario)).name;
    const workbook = xlsx.read(file.buffer);
    const worksheet = workbook.Sheets["Planilha1"];
    const jsonSheet = <Record<string, any>[]>(
      xlsx.utils.sheet_to_json(worksheet)
    );

    const validator = factoryCargaValidator();
    const timestamp = new Date();
    let idCounter = 1;
    const cargas = jsonSheet.map((row: Record<string, any>): ICarga => {
      const clone: ICarga = {
        e_lote: true,
        cliente: TextUtils.normalize(row["Destinatário"]),
        observacao: row["OBSERVAÇÃO"],
        quantidade: Number(row["Quantidade"]),
        quantidade_atual: Number(row["Quantidade"]),
        origem_carga:
          "BRASIL/" +
          TextUtils.normalize(row["Origem"]).split(", ").reverse().join("/"),
        destino_carga:
          "BRASIL/" +
          TextUtils.normalize(row["Destino"]).split(", ").reverse().join("/"),
        unidade_medida: TextUtils.normalize(row["Unidade"]),
        canal_comunicacao: "manual",
        usuario: nomeUsuario,
        responsavel_cadastro: nomeUsuario,
        id: `M-${timestamp.getTime()}-${idCounter++}`,
        data_cadastro: timestamp,
        data_atualizacao: timestamp,
        ativo: 1,
      };

      validator.validateSync(clone, { abortEarly: false });

      return clone;
    });

    if (cargas.length > 0) {
      await this.cargaRepository.bulkCreate(cargas);
    }
    return cargas;
  }
}
