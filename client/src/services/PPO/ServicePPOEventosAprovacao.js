import api from "../api";

class ServicePPOEventosAprovacao {
	async list(status_aprovacao = 0) {
		const result = await api.get(
			`/ppo_eventos/aprovacoes?status_aprovacao=${status_aprovacao}`
		);
		return result.data.data;
	}

	async detalhes(id_pacote_ini, id_pacote_fim) {
		const result = await api.get(
			`/ppo_eventos/aprovacoes/detalhes?id_pacote_ini=${id_pacote_ini}&id_pacote_fim=${id_pacote_fim}`
		);
		return result.data.data;
	}

	async update(id, data) {
		return api.put(`/ppo_eventos/aprovacoes/${id}`, data);
	}
}

export default new ServicePPOEventosAprovacao();
