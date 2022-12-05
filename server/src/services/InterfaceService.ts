export interface IPonto_parada {
  ID: number;
  ID_ROTAS_CSN: number | null;
  ID_CON_CARGAS: number;
  STATUS_SERVICO: string;
  DATA_CADASTRO: Date;
  DATA_ATUALIZACAO: Date | null;
  PREVISAO: Date;
  LATITUDE: number | null;
  LONGITUDE: number | null;
  CLIENTE?: string | null;
}
