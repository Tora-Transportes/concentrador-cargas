import api from "../api";

class ServiceGMNotificacoes {
	async list(query) {
		return await api.get("/gestao-multas/notificacoes", { params: query });
	}
	async index(ait) {
		return await api.get(`/gestao-multas/notificacoes/${ait}`);
	}
}

export default new ServiceGMNotificacoes();
