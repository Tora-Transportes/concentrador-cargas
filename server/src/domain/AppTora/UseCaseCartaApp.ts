import CargaAppRepository from "./../../repositories/AppTora/CargasAppRespository";
import AppError from "../../models/AppError";
import { VeiculoRepository } from "../../repositories/VeiculoRepository";
import { notifyAll } from "../../socketsRoutes";
import { CargaCsnInfoRepository } from "../../repositories/csn/CargaCsnInfoRepository";
import DateUtils from "../../Utils/date";
import { CargaRepository } from "../../repositories/CargaRepository";

interface IBodyAprovaCarga {
  placa: string;
  idCarga: number;
}

class UseCaseAppAprovacaoCarga {
  async run({ placa, idCarga }: IBodyAprovaCarga): Promise<string> {
    const cargaCsnInfoRepository = new CargaCsnInfoRepository();
    const cargaRepository = new CargaRepository();
    if (!placa || !idCarga)
      throw new AppError("placa e idCarga parametros são obrigatórios!", 400);

    if (placa.length !== 7)
      throw new AppError("Placa com formato invalido!", 400);

    const veiculoRepository = new VeiculoRepository();
    const existPlacaCadastrada = await veiculoRepository.search(placa);
    if (!existPlacaCadastrada)
      throw new AppError(
        "A placa informada não esta registrada em nosso sistema!",
        404
      );

    const existeCargaId = await CargaAppRepository.indexId(idCarga);
    if (!existeCargaId)
      throw new AppError("A carga com id informado não existe!", 404);

    if (
      existeCargaId.ativo === 0 ||
      existeCargaId.fk_situacao === 4 ||
      existeCargaId.fk_situacao === 5
    )
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

    if (existeCargaId.carga_csn !== 1) {
      notifyAll({
        name: "@carga-update",
        details: await cargaRepository.index(idCarga),
      });
    } else {
      notifyAll({
        name: "@carga-update-csn",
        details: await cargaCsnInfoRepository.index(idCarga),
      });
    }

    return "Carga atualizada com sucesso!";
  }
}

const instancias = {
  useCaseAprovacaoCargaApp: new UseCaseAppAprovacaoCarga(),
};

export default instancias;
