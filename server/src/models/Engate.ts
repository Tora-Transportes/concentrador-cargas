export default interface IEngate {
  ID: number;
  ENGATE_DESENGATE: number;
  PLACA_VEICULO: string;
  PLACA_CARRETA_UM: string;
  PLACA_CARRETA_DOIS: string;
  PLACA_CARRETA_TRES: string;
  STATUS: string;
  DATA_ATUALIZACAO: Date;
  DATA_CADASTRO: Date;
  RESPONSAVEL_CADASTRO: string;
  USUARIO: string;
  FK_SITUACAO: number;
  PDF: Blob | string;
}
