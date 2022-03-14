import { IPaginationResult } from "../../repositories/CargaRepository";
import { IEventSocket } from "../../socketsRoutes";
import { ICarga } from "../../models/ICargas";
import ECargaStatus from "../../models/ECargaStatus";
import { factoryCargaValidator } from "../../validations/CargaValidator";
import AppError from "../../models/AppError";
import TokenAd from "../../models/TokenAd";
import TextUtils from "../../Utils/text";
import DateUtils from "../../Utils/date";

import xlsx from "xlsx";
import { IVeiculoRepository } from "../../repositories/VeiculoRepository";
import EPermissions from "../../models/EPermissions";

export interface IUserRepository {
  index(oid: string): Promise<any>;
}
export interface IRepositoryAddCarga {
  create(carga: ICarga): Promise<ICarga>;
  index(id: number): Promise<ICarga | undefined>;
  search(
    query: Record<string, any>,
    page?: number,
    pageSize?: number
  ): Promise<IPaginationResult<ICarga>>;
  bulkCreate(cargas: ICarga[]): Promise<any>;
  nextId(): Promise<number>;
}
export class UseCaseAddCarga {
  constructor(
    private cargaRepository: IRepositoryAddCarga,
    private notifyAll: (event: IEventSocket) => void,
    private userRepository: IUserRepository
  ) {}
  async run(
    cargaDTO: Record<string, any>,
    oid: string | null | undefined = null
  ) {
    cargaDTO.id = await this.cargaRepository.nextId();

    const validator = factoryCargaValidator();
    const carga: ICarga = await validator.validate(cargaDTO, {
      abortEarly: false,
      stripUnknown: true,
    });

    const currentDate = DateUtils.getCurrentDate();
    carga.data_atualizacao = currentDate;
    carga.data_cadastro = currentDate;
    carga.quantidade_atual = carga.quantidade_atual || carga.quantidade;

    if (carga.placa_veiculo) {
      // Caso o oid nao esteja definido o bot de scraping é quem está enviando as cargas
      if (oid) {
        const usuario = await this.userRepository.index(oid);
        if (!usuario?.permissoes?.includes(EPermissions.VINCULAR_PLACA)) {
          throw new AppError(
            "O usuário atual não possui a permissão 'VINCULAR_PLACA'",
            403
          );
        }
      }
      if (!carga.codigo_motorista) {
        throw new AppError(
          "A placa informada não possui nenhum motorista cadastrado",
          400
        );
      }
    }

    const cargasCadastrada = await this.cargaRepository.index(carga.id);

    if (cargasCadastrada) {
      throw new AppError("Uma carga com esse Código já foi cadastrada", 400);
    }

    // Esse bloco funciona para a importacao de cargas
    if (carga.documento_transporte) {
      const cargaImportada = await this.cargaRepository.search({
        documento_transporte: carga.documento_transporte,
      });

      if (cargaImportada.results.length > 0) {
        console.log(cargaImportada, "duplicada com ", carga);
        throw new AppError(
          "A carga já foi cadastrada com o documento de transporte",
          409
        );
      }
    }
    //////////////////////////////////////////////////

    carga.fk_situacao = ECargaStatus.AGUARDANDO_ALOCACAO;
    if (Number(carga.placa_veiculo?.length) > 5) {
      carga.fk_situacao = ECargaStatus.AGUARDANDO_GR;
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
  update(id: number, carga: ICarga): Promise<ICarga>;
}
export class UseCaseAddCargaDerivada {
  constructor(
    private cargaRepository: IRepositoryUpdateCarga,
    private notifyAll: (event: IEventSocket) => void
  ) {}
  async run(cargaDTO: Record<string, any>) {
    cargaDTO.id = await this.cargaRepository.nextId();
    const validator = factoryCargaValidator();
    const carga: ICarga = await validator.validate(cargaDTO, {
      abortEarly: false,
      stripUnknown: true,
    });

    const currentDate = DateUtils.getCurrentDate();
    carga.data_atualizacao = currentDate;
    carga.data_cadastro = currentDate;
    carga.quantidade_atual = carga.quantidade_atual || carga.quantidade;
    carga.e_lote = false;

    const lotePai = await this.cargaRepository.index(cargaDTO.fk_lote_pai);
    if (!lotePai) {
      throw new AppError("O lote pai informado não existe", 400);
    }
    carga.unidade_medida = lotePai.unidade_medida;

    const cargasCadastrada = await this.cargaRepository.index(carga.id);
    if (cargasCadastrada) {
      throw new AppError("Uma carga com esse Código já foi cadastrada", 400);
    }

    if (carga.placa_veiculo) {
      if (!carga.codigo_motorista) {
        throw new AppError(
          "A placa informada não possui nenhum motorista cadastrado",
          400
        );
      }
    }

    const quantidadeRestante =
      Number(lotePai.quantidade_atual) - Number(carga.quantidade);
    if (quantidadeRestante < 0) {
      throw new AppError(
        "A quantidade informada para a carga ultrapassa os limites do lote",
        400
      );
    }
    const novoPai = (await validator.validate(lotePai, {
      stripUnknown: true,
    })) as ICarga;
    carga.fk_situacao = ECargaStatus.AGUARDANDO_ALOCACAO;
    if (Number(carga.placa_veiculo?.length) > 5) {
      carga.fk_situacao = ECargaStatus.AGUARDANDO_GR;
    }
    await this.cargaRepository.create(carga);
    await this.cargaRepository.update(lotePai.id, {
      ...novoPai,
      quantidade_atual: quantidadeRestante,
      data_atualizacao: DateUtils.getCurrentDate(),
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

export interface IServiceSit {
  migrar(cargas: ICarga[]): Promise<any>;
  cancelar(cargas: ICarga[]): Promise<any>;
}
export interface IServiceLogTime {
  create(obj: Record<string, any>): Promise<any>;
}

export class UseCaseUpdateCarga {
  constructor(
    private cargaRepository: IRepositoryUpdateCarga,
    private userRepository: IUserRepository,
    private notifyAll: (event: IEventSocket) => void,
    private serviceSit: IServiceSit,
    private serviceLogTime: IServiceLogTime
  ) {}
  async run(cargaDTO: Record<string, any>, oid: string) {
    const validator = factoryCargaValidator();
    const carga: ICarga = await validator.validate(cargaDTO, {
      abortEarly: false,
      stripUnknown: true,
    });

    const currentDate = DateUtils.getCurrentDate();
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
    if (cargaCadastrada.fk_situacao === ECargaStatus.CARGA_CANCELADA) {
      throw new AppError(
        "A carga não pode ser movimentada após ser cancelada",
        400
      );
    }

    if (cargaCadastrada.fk_situacao === ECargaStatus.DOCUMENTO_EMITIDO) {
      throw new AppError(
        "A carga não pode ser movimentada após ter seu documento emitido",
        400
      );
    }

    if (
      cargaCadastrada.fk_situacao === ECargaStatus.APROVADO_PELO_GR &&
      ![ECargaStatus.CARGA_CANCELADA, ECargaStatus.DOCUMENTO_EMITIDO].includes(
        Number(carga.fk_situacao)
      )
    ) {
      throw new AppError(
        "Após a carga ser aprovada pelo gr ela só pode ser cancelada ou ter seu documento emitido e não editada",
        400
      );
    }

    const user = await this.userRepository.index(oid);

    if (carga.fk_situacao === ECargaStatus.DOCUMENTO_EMITIDO) {
      if (user?.permissoes.includes("APROVAR_VIAGEM")) {
        Object.assign(carga, cargaCadastrada);
        carga.fk_situacao = ECargaStatus.DOCUMENTO_EMITIDO;
      } else {
        throw new AppError(
          "O usuário não possui a permissão 'APROVAR_VIAGEM'",
          403
        );
      }
    }

    if (carga.fk_situacao === ECargaStatus.CARGA_CANCELADA) {
      if (!user?.permissoes.includes("DELETAR_CARGAS")) {
        throw new AppError(
          "O usuário informado não possui a permissão 'DELETAR_CARGAS'",
          403
        );
      }
      const observacaoCancelamento = carga.observacao_cancelamento;
      Object.assign(carga, cargaCadastrada);
      carga.observacao_cancelamento = observacaoCancelamento;
      carga.fk_situacao = ECargaStatus.CARGA_CANCELADA;
      if (!carga.observacao_cancelamento) {
        throw new AppError(
          "Ao cancelar uma carga a observação deve ser preenchida",
          400
        );
      }
    } else {
      const TeveMudancaPlaca = (placaAntiga: any, placaNova: any) => {
        return placaAntiga ? placaNova !== placaAntiga : !!placaNova;
      };
      if (
        !user?.permissoes?.includes(EPermissions.VINCULAR_PLACA) &&
        TeveMudancaPlaca(cargaCadastrada.placa_veiculo, carga.placa_veiculo)
      ) {
        throw new AppError(
          "O usuário atual não possui a permissão 'VINCULAR_PLACA'",
          403
        );
      }
      if (carga.placa_veiculo) {
        if (!carga.codigo_motorista) {
          throw new AppError(
            "A placa informada não possui nenhum motorista cadastrado",
            400
          );
        }
      }
    }

    if (carga.e_lote === false && cargaCadastrada.e_lote === true) {
      throw new AppError(
        "Não é possível transformar um lote em uma carga",
        400
      );
    }

    // O usuario deve ter permissao para aprovar o status da carga para 3 - Aprovado pelo GR ou 4 - veiculo reprovado
    if (
      [ECargaStatus.APROVADO_PELO_GR, ECargaStatus.VEICULO_REPROVADO].includes(
        Number(carga.fk_situacao)
      ) &&
      Number(cargaCadastrada.fk_situacao) === ECargaStatus.AGUARDANDO_GR
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
      [
        ECargaStatus.AGUARDANDO_ALOCACAO,
        ECargaStatus.VEICULO_REPROVADO,
      ].includes(Number(cargaCadastrada.fk_situacao)) &&
      carga.placa_veiculo
    ) {
      carga.fk_situacao = ECargaStatus.AGUARDANDO_GR;
    }

    if (
      [ECargaStatus.APROVADO_PELO_GR, ECargaStatus.VEICULO_REPROVADO].includes(
        Number(carga.fk_situacao)
      ) &&
      !carga.observacao_gr
    ) {
      throw new AppError(
        "Observação deve ser especificada ao aprovar ou reprovar veículos",
        400
      );
    }

    if (
      carga.fk_situacao === ECargaStatus.AGUARDANDO_ALOCACAO &&
      carga.placa_veiculo
    ) {
      carga.fk_situacao = cargaCadastrada.fk_situacao;
    }

    // Caso o veículo não possua uma placa cadastrada sua situação vai voltar para "aguardando alocação" ou "veiculo reprovado"
    if (
      !carga.placa_veiculo &&
      carga.fk_situacao !== ECargaStatus.CARGA_CANCELADA
    ) {
      carga.fk_situacao = ECargaStatus.AGUARDANDO_ALOCACAO;
    }

    // Os lotes nao podem ter sua unidade de medida e quantidade alterados
    if (cargaCadastrada.e_lote) {
      carga.unidade_medida = cargaCadastrada.unidade_medida;
      carga.quantidade = cargaCadastrada.quantidade;
    }

    // ao atualizar o lote nao se deve resetar a contagem da quantidade_atual
    if (cargaCadastrada.e_lote) {
      carga.quantidade_atual =
        carga.quantidade_atual === undefined
          ? cargaCadastrada.quantidade_atual
          : carga.quantidade_atual;
    }

    carga.placa_veiculo = carga.placa_veiculo
      ? carga.placa_veiculo.trim().toUpperCase()
      : carga.placa_veiculo;

    const { janela_entrega, janela_coleta, e_lote } = carga;
    const cargaOficial = validator.cast(
      {
        ...carga,
        documento_transporte: cargaCadastrada.documento_transporte,
        janela_entrega: e_lote ? null : janela_entrega,
        janela_coleta: e_lote ? null : janela_coleta,
      },
      { stripUnknown: true }
    ) as ICarga;

    if (cargaOficial.fk_situacao === ECargaStatus.APROVADO_PELO_GR) {
      // aqui eu populo a tabela con_cargas_logs_aprovacao para mostrar quanto tempo demora pelas mãos da GR
      let time = -1;
      const currentDateLog = DateUtils.getCurrentDate();
      if (cargaCadastrada.data_atualizacao instanceof Date) {
        time = Math.ceil(
          (currentDateLog.getTime() -
            cargaCadastrada.data_atualizacao.getTime()) /
            1000
        );
      }
      await this.serviceSit.migrar([cargaOficial]);
      await this.serviceLogTime.create({
        fk_carga: cargaOficial.id,
        segundos: time,
        fk_usuario: oid,
        data_criacao: currentDateLog,
      });
    }
    if (cargaOficial.fk_situacao === ECargaStatus.CARGA_CANCELADA) {
      await this.serviceSit.cancelar([cargaOficial]);
    }

    await this.cargaRepository.update(cargaOficial.id, {
      ...cargaOficial,
      data_atualizacao: currentDate,
    });
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

  async index(id: number) {
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
  async run(
    id: number,
    usuario: string,
    observacaoExclusao: string | null | undefined = ""
  ) {
    if (!id) {
      throw new AppError("Id inválido", 400);
    }
    if (!observacaoExclusao) {
      throw new AppError(
        "Ao excluir uma carga a observação da exclusão deve ser preenchida",
        400
      );
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
      data_atualizacao: DateUtils.getCurrentDate(),
      observacao_exclusao: observacaoExclusao,
    };

    await this.cargaRepository.update(carga.id, cargaAtualizada as ICarga);
    this.notifyAll({
      name: "@carga-delete",
      details: { id },
    });
    return cargaAtualizada;
  }
}

export interface IClientRepository {
  searchBatch(cpnjs: string[]): Promise<any>;
}
export class UseCaseImportCarga {
  constructor(
    private cargaRepository: IRepositoryAddCarga,
    private notifyAll: (event: IEventSocket) => void,
    private clientRepository: IClientRepository
  ) {}
  async run(file: Buffer | undefined, usuario: string | undefined) {
    if (!file || !file?.buffer) {
      throw new AppError("O arquivo não foi enviado", 400);
    }
    const nomeUsuario = TokenAd.getClaims(String(usuario)).name;
    const workbook = xlsx.read(file.buffer);
    const worksheet = workbook.Sheets["Planilha1"];
    const jsonSheet = <Record<string, any>[]>(
      xlsx.utils.sheet_to_json(worksheet).map((i: any) => {
        const tmp: Record<string, any> = {};
        for (const oldKey of Object.keys(i)) {
          const newKey = TextUtils.normalize(oldKey)
            .toLowerCase()
            .replace(" ", "_");
          tmp[newKey] = i[oldKey];
        }
        return tmp;
      })
    );

    const normalizeLocation = (location: string) => {
      let output =
        "BRASIL/" +
        TextUtils.normalize(location.split(",").reverse().join(",")).replace(
          ",",
          "/"
        );
      while (output.indexOf(" /") !== -1) {
        output = output.replace(" /", "/");
      }
      while (output.indexOf("/ ") !== -1) {
        output = output.replace("/ ", "/");
      }
      return output;
    };

    const cnpjs = new Set<string>();
    for (const i of jsonSheet) {
      const cleanText = TextUtils.normalize(i.cnpj).replace(/\D/g, "");
      cnpjs.add(cleanText);
      i.cnpj = cleanText;
    }

    const uniqueCnpjs = Array.from<string>(cnpjs);
    const clients = await this.clientRepository.searchBatch(uniqueCnpjs);
    const tokensCnpj = new Map();
    for (const i of clients) {
      tokensCnpj.set(
        i.documento_federal,
        `${i.organizacao_fantasia} - ${i.documento_federal} - ${i.cidade}/${i.uf}`
      );
    }

    const validator = factoryCargaValidator();
    const timestamp = DateUtils.getCurrentDate();
    const cargas = await Promise.all(
      jsonSheet.map(async (row: Record<string, any>): Promise<ICarga> => {
        if (!tokensCnpj.get(row.cnpj)) {
          throw new AppError(
            `Verifique os fornecedores pois o cnpj ${row.cnpj} não foi encontrado no SIT`,
            400
          );
        }
        const clone: ICarga = {
          e_lote: true,
          cliente: tokensCnpj.get(row.cnpj),
          observacao: row.observacao,
          local_entrega: row.destinatario,
          quantidade: Number(row.quantidade),
          quantidade_atual: Number(row.quantidade),
          origem_carga: normalizeLocation(row.origem),
          destino_carga: normalizeLocation(row.destino),
          unidade_medida: TextUtils.normalize(row.unidade),
          canal_comunicacao: "manual",
          usuario: nomeUsuario,
          responsavel_cadastro: nomeUsuario,
          id: await this.cargaRepository.nextId(),
          data_cadastro: timestamp,
          data_atualizacao: timestamp,
          ativo: 1,
        };

        await validator.validate(clone, { abortEarly: false });

        return clone;
      })
    );

    if (cargas.length > 0) {
      await this.cargaRepository.bulkCreate(cargas);
      for (const carga of cargas) {
        this.notifyAll({
          name: "@carga-create",
          details: carga,
        });
      }
    }
    return cargas;
  }
}
