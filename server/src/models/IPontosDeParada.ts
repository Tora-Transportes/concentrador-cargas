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
  ENTREGA_FINAL?: number | null;
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
  ENTREGA_FINAL?: number | null;
}

type TStringOrString = string | string;
type TDateOrString = Date | string;
type TNumbeOrString = number | string;
export interface IInfo_passagemFormatFront {
  client: TStringOrString;
  coletaEfetiva: TDateOrString;
  coletaEfetiva_mundo: TDateOrString;
  coletaEfetiva_peacao: TDateOrString;
  coletaEfetiva_posto30: TDateOrString;
  coletaEfetivaSaida: TDateOrString;
  entregaEfetiva: TDateOrString;
  entregaEfetivaSaida: TDateOrString;
  id: number;
  id_carga: number;
  idRotaCsn: TNumbeOrString;
  latitude: TNumbeOrString;
  longitude: TNumbeOrString;
  ponto: TStringOrString | undefined;
  previsao: TDateOrString;
  previsaoSaida: TDateOrString;
  tempServicoLocal: TStringOrString;
  tempServicoLocalEntrega: TStringOrString;
  tipoServico: TStringOrString;
}
export interface IInfo_passagem {
  ponto_passagem: IInfo_passagemFormatFront;
  ponto_passagem2: IInfo_passagemFormatFront;
  ponto_passagem3: IInfo_passagemFormatFront;
  ponto_passagem4: IInfo_passagemFormatFront;
  ponto_passagem5: IInfo_passagemFormatFront;
  ponto_passagem6: IInfo_passagemFormatFront;
  ponto_passagem7: IInfo_passagemFormatFront;
  id_carga: string;
}
