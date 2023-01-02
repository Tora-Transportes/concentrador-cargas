import IPontosParada from "../../models/IPontosDeParada";

export interface IInfoCarga {
  id: number;
  placa_veiculo: string;
  VEI_REFERENCIA: number;
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
  ENTREGA_FINAL?: number | null;
  fk_situacao?: number;
}

export interface IdadosEntrega {
  ID: number;
  ID_CON_CARGAS: number;
}
