export default interface IPontosParada {
  ID?: number;
  ID_CON_CARGAS: number;
  ID_ROTAS_CSN?: number | null;
  STATUS_SERVICO: string;
  PREVISAO?: Date | null;
  LATITUDE?: string | null;
  LONGITUDE?: string | null;
  DATA_CADASTRO?: Date;
  DATA_ATUALIZACAO?: Date | null;
  CLIENTE?: string | null;
  COLETA_EFETIVA?: Date | null;
  COLETA_EFETIVA_POSTO30?: Date | null;
  COLETA_EFETIVA_MUNDO?: Date | null;
  COLETA_EFETIVA_PEACAO?: Date | null;
  ENTREGA_EFETIVA?: Date | null;
  PREVISAO_SAIDA?: Date | null;
  TEMP_SERV_LOCAL_COLETA?: string | null;
  SAIDA_EFETIVA_COLETA?: Date | null;
  TEMP_SERV_LOCAL_ENTREGA?: string | null;
  SAIDA_EFETIVA_ENTREGA?: Date | null;
}
export interface IPontosParadaPath {
  ID?: number;
  ID_ROTAS_CSN?: number | null;
  PREVISAO?: Date | null;
  LATITUDE?: string | null;
  LONGITUDE?: string | null;
  DATA_CADASTRO?: Date;
  DATA_ATUALIZACAO?: Date | null;
  CLIENTE?: string | null;
  COLETA_EFETIVA?: Date | null;
  COLETA_EFETIVA_POSTO30?: Date | null;
  COLETA_EFETIVA_MUNDO?: Date | null;
  COLETA_EFETIVA_PEACAO?: Date | null;
  ENTREGA_EFETIVA?: Date | null;
  PREVISAO_SAIDA?: Date | null;
  TEMP_SERV_LOCAL_COLETA?: string | null;
  SAIDA_EFETIVA_COLETA?: Date | null;
  TEMP_SERV_LOCAL_ENTREGA?: string | null;
  SAIDA_EFETIVA_ENTREGA?: Date | null;
}
