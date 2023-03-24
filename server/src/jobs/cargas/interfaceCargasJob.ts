import IPontosParada from "../../models/IPontosDeParada";

export interface IInfoCarga {
  id: number;
  placa_veiculo?: string;
  rastreador: string;
  ponto_parada?: IPontosParada[];
}

export interface ILastLocations {
  LAT: string;
  LON: string;
}
export interface IDadosUpdate {
  ID?: number;
  ID_CON_CARGAS?: string;
  ID_ROTAS_CSN?: string;
  COLETA_EFETIVA?: Date;
  ENTREGA_EFETIVA?: Date;
  COLETA_EFETIVA_PEACAO?: Date;
  COLETA_EFETIVA_MUNDO?: Date;
  COLETA_EFETIVA_POSTO30?: Date;
  SAIDA_EFETIVA_ENTREGA?: Date | undefined;
  SAIDA_EFETIVA_COLETA?: Date | undefined;
  STATUS_SERVICO?: string | null;
  ENTREGA_FINAL?: number | null;
  fk_situacao?: number;
  CALCULO_DISTANCIA?: string | null;
  HORAS_ENTRADA?: Date | null;
  HORAS_SAIDA?: Date | null;
  entradaOrSaida?: string;
  TEMP_SERV_LOCAL_COLETA?: string | null;
  TEMP_SERV_LOCAL_ENTREGA?: string | null;
  DESCRICAO?: string | null;
}

export interface IdadosEntrega {
  ID: number;
  ID_CON_CARGAS: number;
}
