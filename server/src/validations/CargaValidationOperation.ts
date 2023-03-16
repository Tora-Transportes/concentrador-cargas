import { ICarga } from "../models/ICargas";

export interface IHasPermissions {
  has(permission: string): boolean;
}

export class CargaValidationOperation {
  constructor(private hasPermission: IHasPermissions) {}
  validate(cargaAnterior: ICarga | null, cargaAtual: ICarga): ICarga {
    const cargaSaida = { ...cargaAtual };

    if (!cargaAtual.placa_veiculo) {
      cargaSaida.fk_situacao = 1;
    }

    if (
      cargaAtual.placa_veiculo &&
      cargaAnterior?.carga_csn !== 1 &&
      (cargaAtual.fk_situacao == 1 || !cargaAtual.fk_situacao)
    ) {
      cargaSaida.fk_situacao = 2;
    } else if (
      cargaAnterior?.fk_situacao === 6 &&
      cargaAtual.fk_situacao !== 5
    ) {
      cargaSaida.fk_situacao = 9;
    }

    if (cargaAnterior === null && cargaAtual.placa_veiculo) {
      if (!this.hasPermission.has("VINCULAR_PLACA")) {
        throw new Error(
          "O usuário deve possuir a permissao VINCULAR_PLACA para vincular a placa na carga."
        );
      }
    }

    if (cargaAnterior) {
      if (
        cargaAtual.ativo === 0 &&
        (cargaAnterior.ativo === 1 || cargaAnterior.ativo === 2)
      ) {
        if (!this.hasPermission.has("DELETAR_CARGAS")) {
          throw new Error(
            "Não é possível excluir uma carga sem a permissão DELETAR_CARGAS"
          );
        }
      }

      if (cargaAnterior.fk_situacao === 5) {
        throw new Error(
          "Não é possível movimentar a carga após o cancelamento da mesma"
        );
      }

      if (cargaAnterior.fk_situacao === 6 && cargaAnterior.carga_csn !== 1) {
        throw new Error(
          "Não é possível movimentar a carga após o documento ser emitido"
        );
      }

      if (cargaAnterior.e_lote === true) {
        if (cargaAtual.e_lote === false) {
          throw new Error("Lote não pode ser convertido para carga");
        }
        if (cargaAnterior.unidade_medida !== cargaAtual.unidade_medida) {
          throw new Error(
            "Não é possível modificar a unidade de medida de um lote"
          );
        }
        if (cargaAtual.quantidade !== cargaAnterior.quantidade) {
          throw new Error(
            "Não é possível modificar a quantidade total de um lote"
          );
        }
      }

      if (cargaAnterior.placa_veiculo !== cargaAtual.placa_veiculo) {
        cargaSaida.fk_situacao = cargaAtual.placa_veiculo ? 2 : 1;
      }

      if (cargaAnterior.fk_situacao === 2 && cargaAtual.fk_situacao === 3) {
        if (
          cargaAtual.fk_filial === undefined ||
          cargaAtual.fk_filial === null
        ) {
          throw new Error(
            "Não é possível aprovar veículo sem preencher a filial"
          );
        }
        if (!cargaAtual.observacao_gr) {
          throw new Error(
            "Não é possível aprovar veículo sem preencher a observacao_gr"
          );
        }
        //if (cargaAtual.carga_csn !== 1) {
        if (
          !cargaAtual.origem_carga ||
          !cargaAtual.destino_carga ||
          cargaAtual.destino_carga.split("/").length !== 3 ||
          cargaAtual.origem_carga.split("/").length !== 3
        ) {
          throw new Error(
            "Não é possível aprovar veículo sem preencher origem e destino da carga corretamente"
          );
        }
        //}

        if (
          !cargaAtual.cliente ||
          cargaAtual.cliente.split(" - ").length !== 3
        ) {
          throw new Error(
            "Não é possível aprovar veículo sem preencher o cliente da carga corretamente"
          );
        }

        if (!this.hasPermission.has("APROVAR_VEICULOS")) {
          throw new Error(
            'Não é possível aprovar ou reprovar uma carga sem a permissão "APROVAR_VEICULOS"'
          );
        }
      }

      if (cargaAnterior.fk_situacao === 2 && cargaAtual.fk_situacao === 4) {
        if (!this.hasPermission.has("APROVAR_VEICULOS")) {
          throw new Error(
            'Não é possível aprovar ou reprovar uma carga sem a permissão "APROVAR_VEICULOS"'
          );
        }
      }

      if (cargaAnterior.fk_situacao === 4 && cargaAtual.placa_veiculo) {
        if (!this.hasPermission.has("VINCULAR_PLACA")) {
          throw new Error(
            'Não é possível reaplicar a placa sem a permissao "VINCULAR_PLACA"'
          );
        } else {
          cargaSaida.fk_situacao = 2;
        }
      }

      if (cargaAnterior.fk_situacao === 3) {
        if (![3, 5, 6].includes(Number(cargaAtual.fk_situacao))) {
          throw new Error(
            "A carga não pode ter seus dados alterados após ser aprovada"
          );
        }

        if (Number(cargaAtual.fk_situacao) === 6) {
          if (
            cargaAtual.carga_csn === 1 &&
            !this.hasPermission.has("FINALIZAR_CARGAS_CSN")
          ) {
            throw new Error(
              "Não é possível finalizar carga sem a permissão 'FINALIZAR_CARGAS_CSN'"
            );
          } else if (
            cargaAtual.carga_csn !== 1 &&
            !this.hasPermission.has("APROVAR_VIAGEM")
          ) {
            throw new Error(
              "Não é possível mudar o status da carga para DOCUMENTO EMITIDO sem a permissão 'APROVAR_VIAGEM'"
            );
          }
        }
        if (Number(cargaAtual.fk_situacao) === 5) {
          if (!this.hasPermission.has("DELETAR_CARGAS")) {
            throw new Error(
              'Não é possível cancelar uma carga sem a permissão "DELETAR_CARGAS"'
            );
          }
        }

        if (Number(cargaAtual.fk_situacao) !== 5) {
          const camposPermitidosMudanca = [
            "fk_situacao",
            "observacao_cancelamento",
            "carga_csn",
            "locais",
            "data_atualizacao",
            "data_entrega",
            "data_coleta",
            "usuario",
            "rastreador",
            "canal_comunicacao",
          ];
          for (const i in cargaAtual) {
            if ({ ...cargaAnterior }[i] != { ...cargaAtual }[i]) {
              if (!camposPermitidosMudanca.includes(i)) {
                throw new Error(
                  "A carga não pode ter seus dados alterados após ser aprovada"
                );
              }
            }
          }
        }
      }

      if (cargaAtual.placa_veiculo && cargaAtual.fk_situacao === 1) {
        cargaSaida.fk_situacao = 2;
      }
    }
    if (cargaAtual.placa_veiculo && !cargaAtual.codigo_motorista) {
      throw new Error("Não é possível ter uma placa vinculada sem motorista");
    }
    if (
      cargaAtual.quantidade <= 0 ||
      Number(cargaAtual.quantidade_atual) <= 0
    ) {
      throw new Error(
        "Não é possível registrar uma carga com quantidade vazia ou negativa."
      );
    }

    return cargaSaida;
  }
}
