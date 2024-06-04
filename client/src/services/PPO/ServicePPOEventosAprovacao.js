import api from "../api";

class ServicePPOEventosAprovacao {
	async list(status_aprovacao = 0) {
		const result = await api.get(
			`/ppo_eventos/aprovacoes?status_aprovacao=${status_aprovacao}`
		);
		return result.data.data;
	}

	async update(id, data) {
		return api.put(`/ppo_eventos/aprovacoes/${id}`, data);
	}
}

export default new ServicePPOEventosAprovacao();
