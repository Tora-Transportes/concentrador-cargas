export default interface ICsnLogs {
  ID?: number;
  ID_CARGA: number;
  ID_ROTAS_CSN?: number | null;
  DATA_CADASTRO: Date;
  STATUS_SERVICO: string | null;
  OID: string;
  URL: string;
  METODO: string;
  CALCULO_DISTANCIA: string | null;
  TOKEN?: string | null;
}
