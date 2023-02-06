export default interface IModelAvisos {
  ID?: number;
  TITULO: string;
  MENSAGEM: string;
  AUTOR: string;
  DATA_CADASTRO: string;
  DATA_ATUALIZACAO?: string | null;
}
