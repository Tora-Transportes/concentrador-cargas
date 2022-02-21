import AppError from "../models/AppError";
import EPermissions from "../models/EPermissions";
import { CoordenadaRepository } from "../repositories/CoordenadaRepository";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
export class UseCaseViewCoordenada {
  private coordenadaRepository: CoordenadaRepository;
  constructor() {
    this.coordenadaRepository = new CoordenadaRepository();
  }

  async run(filter: Record<string, any>, pageSize = 10) {
    return this.coordenadaRepository.list(filter, pageSize);
  }
}

export class UseCaseUpdateDadosCoordenada {
  private coordenadaRepository: CoordenadaRepository;
  private userRepository: UsuarioRepository;
  constructor() {
    this.userRepository = new UsuarioRepository();
    this.coordenadaRepository = new CoordenadaRepository();
  }

  async run(
    placa: string,
    { observacao, responsavel_placa, data_janela }: Record<string, string>,
    oid: string
  ) {
    const usuarioLogado = await this.userRepository.index(oid);
    if (!usuarioLogado) {
      throw new AppError("O usuário informado não existe", 400);
    }

    const usuarioResponsavelPlaca = await this.userRepository.index(
      responsavel_placa || ""
    );
    if (responsavel_placa) {
      if (!usuarioResponsavelPlaca) {
        throw new AppError("O usuário reponsável pela placa não existe", 400);
      }
    }

    const usuarioResponsavelPelaPlaca = [null, ""].includes(responsavel_placa)
      ? null
      : responsavel_placa === undefined
      ? undefined
      : responsavel_placa;
    const dataJanela = [null, ""].includes(data_janela)
      ? null
      : data_janela === undefined
      ? undefined
      : data_janela;

    if (usuarioResponsavelPelaPlaca !== undefined) {
      if (!usuarioLogado.permissoes.includes(EPermissions.VINCULAR_PLACA)) {
        throw new AppError(
          "O usuário atual não possui a permissão 'VINCULAR_PLACA'",
          403
        );
      }
    }

    const usuario = usuarioLogado.nome;
    const coordenadas = await this.coordenadaRepository.list({ placa });
    if (coordenadas.results.length === 0) {
      throw new AppError(
        "A placa registrada não existe na listagem das coordenadas",
        400
      );
    }

    const atualizacao = {
      observacao: [null, ""].includes(observacao) ? null : observacao,
      responsavel_placa: usuarioResponsavelPelaPlaca,
      usuario_placa: [null, ""].includes(responsavel_placa)
        ? undefined
        : usuario,
      usuario_observacao: [null, ""].includes(observacao) ? undefined : usuario,
      data_janela: dataJanela,
    };

    await this.coordenadaRepository.update(placa, atualizacao);
    return {
      ...atualizacao,
      responsavel_placa_nome: usuarioResponsavelPlaca?.nome,
      responsavel_placa_email: usuarioResponsavelPlaca?.email,
    };
  }
}

const instancias = {
  UseCaseViewCoordenada: new UseCaseViewCoordenada(),
  UseCaseUpdateDadosCoordenada: new UseCaseUpdateDadosCoordenada(),
};
export default instancias;
