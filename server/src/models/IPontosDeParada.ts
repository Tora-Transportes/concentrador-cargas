export default interface IPontosParada {
  ID?: number;
  ID_CON_CARGAS: number;
  ID_ROTAS_CSN?: number | null;
  STATUS_SERVICO: string;
  PREVISAO?: Date;
  LATITUDE?: number | null;
  LONGITUDE?: number | null;
  DATA_CADASTRO?: Date;
  DATA_ATUALIZACAO?: Date;
}
