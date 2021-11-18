import database from "../database";

export interface IQueryOrganizacao {
  nome?: string;
  uf?: string;
  cidade?: string;
}

class ServiceAutocomplete {
  async recommendOrganizacao(search: IQueryOrganizacao) {
    const query = database("ORGANIZACAO as ORG")
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
      .limit(20);

    if (search?.nome) {
      query.andWhere(
        "ORG.ORG_RAZAO_SOCIAL",
        "like",
        `%${search.nome.toUpperCase()}%`
      );
    }
    if (search?.uf) {
      query.andWhere("EST.UF_SIGLA", search.uf.toUpperCase());
    }
    if (search?.cidade) {
      query.andWhere("CID.CID_NOM", "like", `%${search.cidade.toUpperCase()}%`);
    }
    return query;
  }
}

export default ServiceAutocomplete;
