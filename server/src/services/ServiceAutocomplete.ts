import database from "../database";
import { LocaisRepository } from "../repositories/LocaisRepository";

export interface IQueryOrganizacao {
  nome?: string;
  uf?: string;
  cnpj?: string;
  cidade?: string;
}

export interface IQueryCidadeEstado {
  query?: string;
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
    if (search?.cnpj) {
      query.andWhere(
        "PRA.PCA_DOC_FEDERAL",
        "like",
        `%${search.cnpj.replace(/\D/g, "")}%`
      );
    }

    query.orderBy("ORG.ORG_RAZAO_SOCIAL");
    return query;
  }

  async recomendarLocalizacao(search: IQueryCidadeEstado) {
    const localRepository = new LocaisRepository();
    const query = String(search.query);

    return localRepository.search(query);
  }
}

export default ServiceAutocomplete;
