import api from "../api";

class ServiceGMNotificacoes {
	async list(query) {
		return await api.get("/gestao-multas/notificacoes", { params: query });
	}
}

export default new ServiceGMNotificacoes();
