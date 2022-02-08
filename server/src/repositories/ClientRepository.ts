import database from "../database";
import { IClientRepository } from "../domain/UseCaseCarga/entities";
export class ClientRepository implements IClientRepository {
  async searchBatch(cnpjs: Array<string>) {
    return database("ORGANIZACAO as ORG")
      .join("PRACA as PRA", "PRA.ORG_COD", "ORG.ORG_COD")
      .join("CIDADE as CID", "CID.CID_COD", "PRA.CID_COD")
      .join("ESTADO as EST", "EST.UF_COD", "CID.UF_COD")
      .whereRaw("LENGTH(PRA.PCA_DOC_FEDERAL) = 14")
      .select([
        "ORG.ORG_RAZAO_SOCIAL AS organizacao",
        "ORG.ORG_FANTASIA AS organizacao_fantasia",
        "PRA.PCA_DOC_FEDERAL as documento_federal",
        "PRA.PCA_END as endereco",
        "CID.CID_NOM as cidade",
        "EST.UF_SIGLA as uf",
      ])
      .whereIn("PRA.PCA_DOC_FEDERAL", cnpjs);
  }
}
