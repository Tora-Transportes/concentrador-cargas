import api from "./api";
class ServiceRecomendacoes {
	async organizacoes({ nome, cidade, uf, cnpj }) {
		const filter = {};
		if (nome) {
			filter.nome = nome;
		}
		if (cidade) {
			filter.cidade = cidade;
		}
		if (uf) {
			filter.uf = uf;
		}
		if (cnpj) {
			filter.cnpj = cnpj;
		}

		return api.get("/recomendacoes/organizacoes", { params: filter });
	}

	async locais({ query }) {
		return api.get("/recomendacoes/locais", { params: { query } });
	}

	async locaisPorUf({ uf, cidade }) {
		return api.get("/recomendacoes/locais/estado", { params: { uf, cidade } });
	}
}

export default new ServiceRecomendacoes();
