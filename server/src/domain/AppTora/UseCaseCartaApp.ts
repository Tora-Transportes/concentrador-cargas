import CargaAppRepository from "./../../repositories/AppTora/CargasAppRespository";
import AppError from "../../models/AppError";
import { VeiculoRepository } from "../../repositories/VeiculoRepository";
import { notifyAll } from "../../socketsRoutes";
import { CargaCsnInfoRepository } from "../../repositories/csn/CargaCsnInfoRepository";
import DateUtils from "../../Utils/date";
import { CargaRepository } from "../../repositories/CargaRepository";
import AppToraValidator from "../../validations/AppToraValidator";
import ServiceMigrarSIT from "../../services/ServiceMigrarSIT";
import { LogsAppConcentradorRepository } from "../../repositories/LogsAppConcentrador/LogsAppConcentradorRepository";
import ILogConcentradorApp from "../../models/ILogConcentradorApp";

interface IBodyAprovaCarga {
  placa: string;
  idCarga: number;
}

interface IBodyCancelaCarga {
  idCarga: number;
}

class UseCaseAppAprovacaoCarga {
  private cargaCsnInfoRepository: CargaCsnInfoRepository;
  private cargaRepository: CargaRepository;
  private veiculoRepository: VeiculoRepository;
  private logsAppConcentradorRepository: LogsAppConcentradorRepository;
  constructor() {
    this.cargaCsnInfoRepository = new CargaCsnInfoRepository();
    this.cargaRepository = new CargaRepository();
    this.veiculoRepository = new VeiculoRepository();
    this.logsAppConcentradorRepository = new LogsAppConcentradorRepository();
  }
  async run(
    { placa, idCarga }: IBodyAprovaCarga,
    user: string
  ): Promise<string> {
    const cargaAtual = await AppToraValidator.validatorAprovacao(
      placa,
      idCarga
    );

    const Carga = await CargaAppRepository.indexId(idCarga);

    if (cargaAtual?.fk_situacao === 3) {
      const bodyLog = {
        metodo: "PUT - APROVACAO | INICIAR FRETE",
        status: "409",
        json_envio: JSON.stringify({ requestCode: idCarga, placa: placa }),
        json_retorno: JSON.stringify({
          message: `Carga com id: ${idCarga} já se encontra aprovada em nossos sistemas!`,
        }),
        erro: 1,
        fk_filial: String(cargaAtual.fk_filial),
      };

      await this.logsAppConcentradorRepository.create(bodyLog, user);

      throw new AppError(
        `Carga com id: ${idCarga} já se encontra aprovada em nossos sistemas!`,
        409
      );
    }

    const existPlacaCadastrada = await this.veiculoRepository.search(placa);

    if (!existPlacaCadastrada) {
      const bodyLog = {
        metodo: "PUT - APROVACAO | INICIAR FRETE",
        status: "404",
        json_envio: JSON.stringify({ requestCode: idCarga, placa: placa }),
        json_retorno: JSON.stringify({
          message: "A placa informada não esta registrada em nosso sistema!",
        }),
        erro: 1,
        fk_filial: String(cargaAtual.fk_filial),
      };

      await this.logsAppConcentradorRepository.create(bodyLog, user);

      throw new AppError(
        "A placa informada não esta registrada em nosso sistema!",
        404
      );
    }

    if (!existPlacaCadastrada.codigo_motorista) {
      const bodyLog = {
        metodo: "PUT - APROVACAO | INICIAR FRETE",
        status: "422",
        json_envio: JSON.stringify({ requestCode: idCarga, placa: placa }),
        json_retorno: JSON.stringify({
          message: "Não é possível ter uma placa vinculada sem motorista!",
        }),
        erro: 1,
        fk_filial: String(cargaAtual.fk_filial),
      };

      await this.logsAppConcentradorRepository.create(bodyLog, user);

      throw new AppError(
        "Não é possível ter uma placa vinculada sem motorista!",
        422
      );
    }

    if (cargaAtual.ativo === 0 || cargaAtual.fk_situacao === 5) {
      const bodyLog = {
        metodo: "PUT - APROVACAO | INICIAR FRETE",
        status: "409",
        json_envio: JSON.stringify({ requestCode: idCarga, placa: placa }),
        json_retorno: JSON.stringify({
          message: `Carga com id: ${idCarga} foi cancelada ou excluida!`,
        }),
        erro: 1,
        fk_filial: String(cargaAtual.fk_filial),
      };

      await this.logsAppConcentradorRepository.create(bodyLog, user);

      throw new AppError(
        `Carga com id: ${idCarga} foi cancelada ou excluida!`,
        409
      );
    }

    const fk_situacao = 3;
    const { placa_bitrem, placa_carreta, codigo_motorista } =
      existPlacaCadastrada;

    const bodyUpdate = {
      data_atualizacao: DateUtils.getCurrentDate(),
      usuario: Carga.responsavel_cadastro,
      placa_veiculo: placa,
      observacao_gr: "Aprovação App Tora. ",
      e_lote: false,
      locais: undefined,
      codigo_motorista,
      placa_carreta,
      placa_bitrem,
      fk_situacao,
    };

    const cargaCompleta = { ...cargaAtual, ...bodyUpdate };
    const resultRepository = await CargaAppRepository.updateFk_situacao(
      idCarga,
      bodyUpdate
    );
    if (resultRepository === 0) {
      const bodyLog = {
        metodo: "PUT - APROVACAO | INICIAR FRETE",
        status: "500",
        json_envio: JSON.stringify({ requestCode: idCarga, placa: placa }),
        json_retorno: JSON.stringify({
          message: "Erro interno do servidor! A Carga não foi atualizada",
        }),
        erro: 1,
        fk_filial: String(cargaAtual.fk_filial),
      };

      await this.logsAppConcentradorRepository.create(bodyLog, user);

      throw new AppError("Erro interno do servidor!", 500);
    } else {
      await ServiceMigrarSIT.migrar([cargaCompleta]);
    }

    if (cargaAtual.carga_csn !== 1) {
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

    const bodyLog = {
      metodo: "PUT - APROVACAO | INICIAR FRETE",
      status: "200",
      json_envio: JSON.stringify({ requestCode: idCarga, placa: placa }),
      json_retorno: JSON.stringify({
        message:
          "Carga atualizada com sucesso! Carga foi aprovada | frete iniciado",
      }),
      erro: 1,
      fk_filial: String(cargaAtual.fk_filial),
    };

    await this.logsAppConcentradorRepository.create(bodyLog, user);

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

  async run({ idCarga }: IBodyCancelaCarga): Promise<string> {
    const cargaAtual = await AppToraValidator.validatorCancelamento(idCarga);
    if (cargaAtual.fk_situacao === 5)
      throw new AppError("Carga já se encontra cancelada!", 409);
    const fk_situacao = 5;
    const bodyUpdate = {
      data_atualizacao: DateUtils.getCurrentDate(),
      usuario: "App_tora",
      fk_situacao,
    };
    await ServiceMigrarSIT.cancelar([cargaAtual]);
    const resultRepository = await CargaAppRepository.updateFk_situacao(
      idCarga,
      bodyUpdate
    );
    if (resultRepository === 0)
      throw new AppError("Erro interno do servidor!", 500);

    if (cargaAtual.carga_csn !== 1) {
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
