import api from "./api";

class ServicePPO {
	async avaliacoes(cpf, data_inicio, data_fim) {
		return api.get(
			`/ppo/avaliacoes?cpf=${cpf}&data_inicio=${data_inicio}&data_fim=${data_fim}`
		);
	}

	async distancia(cpf, data_inicio, data_fim) {
		return api.get(
			`/ppo/distancia?cpf=${cpf}&data_inicio=${data_inicio}&data_fim=${data_fim}`
		);
	}

	async infracoes(cpf, data_inicio, data_fim) {
		return api.get(
			`/ppo/infracoes?cpf=${cpf}&data_inicio=${data_inicio}&data_fim=${data_fim}`
		);
	}

	async interjornadas(cpf, data_inicio, data_fim) {
		return api.get(
			`/ppo/interjornadas?cpf=${cpf}&data_inicio=${data_inicio}&data_fim=${data_fim}`
		);
	}

	async atributos() {
		return api.get(`/ppo/atributos`);
	}

	async downloadDemonstrativos({ cpf, mes_avaliacao, ano_avaliacao }) {
		return api.get(`/ppo/demonstrativo`, {
			params: {
				cpf,
				mes: mes_avaliacao,
				ano: ano_avaliacao,
			},
		});
	}

	async demonstrativos({ cpf, mes_avaliacao, ano_avaliacao }) {
		return api.get(`/ppo/motoristas/demonstrativos`, {
			params: {
				cpf,
				mes_avaliacao,
				ano_avaliacao,
			},
		});
	}

	async search({
		page,
		order_column,
		order_direction,
		nome_motorista,
		cpf,
		matricula,
		mes_avaliacao,
		ano_avaliacao,
		ppo_cancelado,
	}) {
		return api.get("/ppo/relatorios/motoristas", {
			params: {
				page,
				order_column,
				order_direction,
				nome_motorista,
				cpf,
				matricula,
				mes_avaliacao,
				ano_avaliacao,
				ppo_cancelado,
			},
		});
	}

	async exportToXlsx({
		nome_motorista,
		cpf,
		matricula,
		mes_avaliacao,
		ano_avaliacao,
		ppo_cancelado,
		date_execel_inicio,
		date_execel_fim,
	}) {
		return await api.get("/ppo/relatorios/excel", {
			responseType: "arraybuffer",
			params: {
				nome_motorista,
				cpf,
				matricula,
				mes_avaliacao,
				ano_avaliacao,
				ppo_cancelado,
				date_execel_inicio,
				date_execel_fim,
			},
		});
	}
}

export default new ServicePPO();
