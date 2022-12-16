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
}
