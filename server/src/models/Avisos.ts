export default interface IModelAvisos {
  ID?: number;
  TITULO: string;
  MENSAGEM: string;
  AUTOR: string;
  DATA_CADASTRO?: Date;
  DATA_ATUALIZACAO?: Date | null;
  LIKE_ON: number;
  LIKE_OF: number;
}
