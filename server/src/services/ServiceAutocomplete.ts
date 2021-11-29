import database from "../database";
import { LocaisRepository } from "../repositories/LocaisRepository";

export interface IQueryOrganizacao {
  nome?: string;
  uf?: string;
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
    return query;
  }

  async recomendarLocalizacao(search: IQueryCidadeEstado) {
    // pais/estado/cidade

    const localRepository = new LocaisRepository();
    const [pais, estado, cidade] = String(search.query)
      .toUpperCase()
      .split("/");

    const todosPaisesEstados = await localRepository.getPaisesEstados();

    if (estado === undefined) {
      // filtra apenas por pais
      return todosPaisesEstados
        .filter(
          (p: Record<string, any>) =>
            p?.name?.toUpperCase().indexOf(pais) !== -1
        )
        .slice(0, 10)
        .map((i: Record<string, any>) => i.name.toUpperCase() + "/");
    }

    if (cidade === undefined) {
      // filtra pais + estado
      const country = todosPaisesEstados.find(
        (i: Record<string, any>) => i.name.toUpperCase() === pais
      );

      if (!country) {
        return [];
      }

      return country.states
        .filter((i: Record<string, any>) =>
          i.state_code.toUpperCase().startsWith(estado)
        )
        .slice(0, 10)
        .map(
          (i: Record<string, any>) =>
            `${country.name.toUpperCase()}/${i.state_code.toUpperCase()}/`
        );
    }

    const nomeEstado = todosPaisesEstados
      ?.find((i: Record<string, any>) => i.name.toUpperCase() === pais)
      ?.states?.find((i: Record<string, any>) => i.state_code === estado)?.name;

    if (!nomeEstado) {
      return [];
    }

    // filtra por todos
    const todasCidades = await localRepository.getCidades(pais, nomeEstado);

    const retorno = todasCidades
      .filter((i: Record<string, any>) => i.toUpperCase().startsWith(cidade))
      .slice(0, 10)
      .map((i: Record<string, any>) => `${pais}/${estado}/${i.toUpperCase()}`);

    return retorno;
  }
}

export default ServiceAutocomplete;
