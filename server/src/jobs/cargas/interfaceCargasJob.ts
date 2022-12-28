import { number } from "yup";
import IPontosParada from "../../models/IPontosDeParada";

export interface IInfoCarga {
  id: number;
  placa_veiculo: string;
  ponto_parada?: IPontosParada[];
}

export interface ILastLocations {
  LAT: string;
  LON: string;
}

export interface IPosicaoAtual extends ILastLocations {
  id: number;
}

export interface IDadosUpdate {
  ID: number;
  ID_CON_CARGAS?: string;
  COLETA_EFETIVA?: Date;
  ENTREGA_EFETIVA?: Date;
  COLETA_EFETIVA_PEACAO?: Date;
  COLETA_EFETIVA_MUNDO?: Date;
  COLETA_EFETIVA_POSTO30?: Date;
  STATUS_SERVICO?: string;
}

export interface IdadosEntrega {
  ID: number;
  ID_CON_CARGAS: number;
}
