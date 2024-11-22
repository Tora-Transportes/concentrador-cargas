import api from "../api";

class ServiceGMNotificacoes {
	async list(query) {
		return await api.get("/gestao-multas/notificacoes", { params: query });
	}
	async index(ait) {
		return await api.get(`/gestao-multas/notificacoes/${ait}`);
	}

	async indicarInfrator(values) {
		return api.post("/gestao-multas/notificacoes/infrator", values);
	}

	async excluirInfrator(values) {
		return api.post(`/gestao-multas/notificacoes/infrator:excluir`, values);
	}

	async regerarInfratores(values) {
		return api.post(`/gestao-multas/notificacoes/infrator/regerar`, values);
	}
}

export default new ServiceGMNotificacoes();
