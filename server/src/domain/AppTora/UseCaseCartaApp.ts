import CargaAppRepository from "./../../repositories/AppTora/CargasAppRespository";
import AppError from "../../models/AppError";
import { VeiculoRepository } from "../../repositories/VeiculoRepository";
import { notifyAll } from "../../socketsRoutes";
import { CargaCsnInfoRepository } from "../../repositories/csn/CargaCsnInfoRepository";
import DateUtils from "../../Utils/date";
import { CargaRepository } from "../../repositories/CargaRepository";
import AppToraValidator from "../../validations/AppToraValidator";

interface IBodyAprovaCarga {
  placa: string;
  idCarga: number;
}

class UseCaseAppAprovacaoCarga {
  private cargaCsnInfoRepository: CargaCsnInfoRepository;
  private cargaRepository: CargaRepository;
  private veiculoRepository: VeiculoRepository;
  constructor() {
    this.cargaCsnInfoRepository = new CargaCsnInfoRepository();
    this.cargaRepository = new CargaRepository();
    this.veiculoRepository = new VeiculoRepository();
  }
  async run({ placa, idCarga }: IBodyAprovaCarga): Promise<string> {
    const {
      ativo,
      fk_situacao: fk_situacaoAtual,
      carga_csn,
    } = await AppToraValidator.validatorAprovacao(placa, idCarga);

    const existPlacaCadastrada = await this.veiculoRepository.search(placa);
    if (!existPlacaCadastrada)
      throw new AppError(
        "A placa informada não esta registrada em nosso sistema!",
        404
      );

    if (!existPlacaCadastrada.codigo_motorista) {
      throw new AppError(
        "Não é possível ter uma placa vinculada sem motorista!",
        422
      );
    }

    if (ativo === 0 || fk_situacaoAtual === 5)
      throw new AppError(
        `Carga com id: ${idCarga} foi cancelada ou excluida!`,
        409
      );

    const fk_situacao = 3;
    const { placa_bitrem, placa_carreta, codigo_motorista } =
      existPlacaCadastrada;

    const bodyUpdate = {
      data_atualizacao: DateUtils.getCurrentDate(),
      usuario: "App_tora",
      placa_veiculo: placa,
      codigo_motorista,
      placa_carreta,
      placa_bitrem,
      fk_situacao,
    };

    const resultRepository = await CargaAppRepository.updateFk_situacao(
      idCarga,
      bodyUpdate
    );
    if (resultRepository === 0)
      throw new AppError("Erro interno do servidor!", 500);

    if (carga_csn !== 1) {
      notifyAll({
        name: "@carga-update",
        details: await this.cargaRepository.index(idCarga),
      });
    } else {
      notifyAll({
        name: "@carga-update-csn",
        details: await this.cargaCsnInfoRepository.index(idCarga),
      });
    }

    return "Carga atualizada com sucesso!";
  }
}
class UseCaseAppCancelarCarga {
  private cargaCsnInfoRepository: CargaCsnInfoRepository;
  private cargaRepository: CargaRepository;
  constructor() {
    this.cargaCsnInfoRepository = new CargaCsnInfoRepository();
    this.cargaRepository = new CargaRepository();
  }

  async run({ placa, idCarga }: IBodyAprovaCarga): Promise<string> {
    const { carga_csn, fk_situacao: fk_situacaoAtual } =
      await AppToraValidator.validatorCancelamento(placa, idCarga);
    if (fk_situacaoAtual === 5)
      throw new AppError("Carga já se encontra cancelada!", 409);
    const fk_situacao = 5;
    const bodyUpdate = {
      data_atualizacao: DateUtils.getCurrentDate(),
      usuario: "App_tora",
      fk_situacao,
    };

    const resultRepository = await CargaAppRepository.updateFk_situacao(
      idCarga,
      bodyUpdate
    );
    if (resultRepository === 0)
      throw new AppError("Erro interno do servidor!", 500);

    if (carga_csn !== 1) {
      notifyAll({
        name: "@carga-update",
        details: await this.cargaRepository.index(idCarga),
      });
    } else {
      notifyAll({
        name: "@carga-update-csn",
        details: await this.cargaCsnInfoRepository.index(idCarga),
      });
    }

    return "Carga cancelada com sucesso!";
  }
}

const instancias = {
  useCaseAprovacaoCargaApp: new UseCaseAppAprovacaoCarga(),
  useCaseAppCancelarCarga: new UseCaseAppCancelarCarga(),
};

export default instancias;
