import api from "./api";
class ServiceRecomendacoes {
	async organizacoes({ nome, cidade, uf }) {
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

		return api.get("/recomendacoes/organizacoes", { params: filter });
	}

	async locais({ query }) {
		return api.get("/recomendacoes/locais", { params: { query } });
	}
}

export default new ServiceRecomendacoes();
