import api from "./api";

class ServicePPO {
	async avaliacoes(cpf, data_inicio, data_fim) {
		return api.get(
			`/ppo/avaliacoes?cpf=${cpf}&data_inicio=${data_inicio}&data_fim=${data_fim}`
		);
	}
}

export default new ServicePPO();
