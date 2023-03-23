import { ICargaCTE } from "./../../models/ICargas";
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
//import EPermissions from "../../models/EPermissions";
import { CargaValidationOperation } from "../../validations/CargaValidationOperation";

export interface IParadasRepository {
  clear(codigoCarga: number): Promise<void>;
  insert(codigoCarga: number, locais: string[]): Promise<void>;
}
export interface IUserRepository {
  index(oid: string): Promise<any>;
}
export interface IRepositoryAddCarga {
  create(carga: ICarga): Promise<ICarga>;
  index(id: number): Promise<ICarga | undefined>;
  indexPlate(plate: string): Promise<ICarga | undefined>;
  search(
    query: Record<string, any>,
    page?: number,
    pageSize?: number
  ): Promise<IPaginationResult<ICarga>>;
  bulkCreate(cargas: ICarga[]): Promise<any>;
  nextId(): Promise<number>;
}

export interface IRepositoryCargaCsnInfoRepository {
  index(id: number): Promise<ICarga | undefined>;
}
export class UseCaseAddCarga {
  constructor(
    private cargaRepository: IRepositoryAddCarga,
    private notifyAll: (event: IEventSocket) => void,
    private userRepository: IUserRepository,
    private locaisRepository: IParadasRepository,
    private cargaCsnInfoRepository: IRepositoryCargaCsnInfoRepository
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

    if (Array.isArray(carga.locais)) {
      const locais = carga.locais;

      await this.locaisRepository.clear(carga.id);
      await this.locaisRepository.insert(carga.id, locais);
    }
    carga.locais = undefined;

    const currentDate = DateUtils.getCurrentDate();
    carga.data_atualizacao = currentDate;
    carga.data_cadastro = currentDate;
    carga.quantidade_atual = carga.quantidade_atual || carga.quantidade;

    const operation = new CargaValidationOperation({
      has: () => {
        return true;
      },
    });
    //Regra de negócio comentada pois  não se aplica a cadastro de carga
    //if (carga.placa_veiculo) {
    // Caso o oid nao esteja definido o bot de scraping é quem está enviando as cargas
    // if (oid) {
    //   const usuario = await this.userRepository.index(oid);
    //   if (!usuario?.permissoes?.includes("DELETAR_CARGAS")) {
    //     throw new AppError(
    //       "O usuário atual não possui a permissão para Cadastrar cargas.",
    //       403
    //     );
    //   }
    // }
    //}

    // Esse bloco funciona para a importacao de cargas
    if (carga.documento_transporte) {
      const cargaImportada = await this.cargaRepository.search({
        documento_transporte: carga.documento_transporte,
      });

      if (
        cargaImportada.results.length > 0 &&
        cargaDTO.canal_comunicacao !== "manual"
      ) {
        throw new AppError(
          "A carga já foi cadastrada com o documento de transporte",
          409
        );
      }
    }

    const cargaOficial = operation.validate(null, carga);

    await this.cargaRepository.create(cargaOficial);
    if (cargaOficial.carga_csn !== 1) {
      this.notifyAll({
        name: "@carga-create",
        details: await this.cargaRepository.index(cargaOficial.id),
      });
    } else {
      this.notifyAll({
        name: "@carga-create-csn",
        details: await this.cargaCsnInfoRepository.index(cargaOficial.id),
      });
    }
    return carga;
  }
}
export interface IRepositoryUpdateCarga extends IRepositoryAddCarga {
  update(id: number, carga: ICarga): Promise<ICarga>;
  updatePatch(id: number, dadosCarga: Partial<ICarga>): Promise<void>;
}
export class UseCaseAddCargaDerivada {
  constructor(
    private cargaRepository: IRepositoryUpdateCarga,
    private notifyAll: (event: IEventSocket) => void,
    private locaisRepository: IParadasRepository
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
      throw new AppError(" Já foi cadastrada uma carga com esse código", 400);
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

    const operation = new CargaValidationOperation({ has: () => true });
    const cargaOficial = operation.validate(null, carga);
    await this.cargaRepository.create(cargaOficial);

    if (Array.isArray(novoPai.locais)) {
      const locais = novoPai.locais;

      await this.locaisRepository.clear(cargaOficial.id);
      await this.locaisRepository.insert(cargaOficial.id, locais);
    }
    novoPai.locais = undefined;

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
    private serviceLogTime: IServiceLogTime,
    private locaisRepository: IParadasRepository,
    private cargaCsnInfoRepository: IRepositoryCargaCsnInfoRepository
  ) {}
  async run(cargaDTO: Record<string, any>, oid: string) {
    const validator = factoryCargaValidator();
    const carga: ICarga = await validator.validate(cargaDTO, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (Array.isArray(carga.locais)) {
      const locais = carga.locais;

      await this.locaisRepository.clear(carga.id);
      await this.locaisRepository.insert(carga.id, locais);
    }
    carga.locais = undefined;

    const currentDate = DateUtils.getCurrentDate();
    carga.data_atualizacao = currentDate;
    carga.quantidade_atual = carga.quantidade_atual || carga.quantidade;

    const cargaCadastrada = await this.cargaRepository.index(carga.id);
    const user = await this.userRepository.index(oid);
    const operation = new CargaValidationOperation({
      has: (permission: string) => {
        return user.permissoes.includes(permission);
      },
    });

    if (!cargaCadastrada) {
      throw new AppError(
        `Nenhuma carga encontrada com o código ${carga.id}.`,
        404
      );
    } else if (cargaCadastrada.ativo === 0) {
      throw new AppError(
        `A carga foi desativada pelo usuário ${cargaCadastrada.usuario}.`,
        403
      );
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

    const cargaOperation = operation.validate(cargaCadastrada, carga);

    const { janela_entrega, janela_coleta, e_lote } = carga;
    const cargaOficial = validator.cast(
      {
        ...cargaOperation,
        documento_transporte:
          carga.canal_comunicacao === "manual"
            ? carga.documento_transporte
            : cargaCadastrada.documento_transporte,
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

    if (cargaOficial.carga_csn !== 1) {
      this.notifyAll({
        name: "@carga-update",
        details: await this.cargaRepository.index(carga.id),
      });
    } else {
      this.notifyAll({
        name: "@carga-update-csn",
        details: await this.cargaCsnInfoRepository.index(carga.id),
      });
    }
    return cargaOficial;
  }
}
type TResultUpdatePath = {
  mensagem: string;
};
export class UseCaseUpdateCargaPath {
  constructor(
    private readonly cargaRepository: IRepositoryUpdateCarga,
    private readonly cargaCsnInfoRepository: IRepositoryCargaCsnInfoRepository,
    private notifyAll: (event: IEventSocket) => void
  ) {}

  async run(
    id: number,
    dadosCarga: Partial<ICarga>
  ): Promise<TResultUpdatePath> {
    const existeCarga = await this.cargaRepository.index(id);
    if (!existeCarga) throw new AppError("A carga seleionada não existe", 404);
    const carga = { ...dadosCarga, data_atualizacao: new Date() };
    await this.cargaRepository.updatePatch(id, carga);
    this.notifyAll({
      name: "@carga-update-csn",
      details: await this.cargaCsnInfoRepository.index(id),
    });
    return { mensagem: "Carga editado com sucesso!" };
  }
}

export class UseCaseViewCargas {
  constructor(private cargaRepository: IRepositoryAddCarga) {}

  async run(filter: Record<string, any>) {
    return this.cargaRepository.search(
      { ...filter, ativo: 1, carga_csn: 0 },
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

  async indexPlate(plate: string) {
    const carga = await this.cargaRepository.indexPlate(plate);
    if (!carga) {
      throw new AppError(" ", 204);
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

export interface IVeiwsDataCTE {
  searchCET(id: string): Promise<ICargaCTE>;
}
export class UseCaseViewCargasCTE {
  constructor(private cargaRepoitory: IVeiwsDataCTE) {}
  async run(id: string) {
    const resultCET = await this.cargaRepoitory.searchCET(id);
    return resultCET;
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
      locais: undefined,
    };

    await this.cargaRepository.update(carga.id, cargaAtualizada as ICarga);
    if (cargaAtualizada.carga_csn !== 1) {
      this.notifyAll({
        name: "@carga-delete-csn",
        details: { id },
      });
    } else {
      this.notifyAll({
        name: "@carga-delete-csn",
        details: { id },
      });
    }
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
