import api from "../api";

class ServicePPOGruposMotoristas {
	async list(grupo_id) {
		return api.get(`/ppo/grupos/motoristas?grupo_id=${grupo_id}&active=true`);
	}

	async motoristasAtivos() {
		return api.get(`/ppo/grupos/motoristas-ativos`);
	}

	async create(data) {
		return api.post("/ppo/grupos/motoristas", data);
	}

	async delete(id) {
		return api.delete(`/ppo/grupos/motoristas/${id}`);
	}

	async driverIsLiked(cpf) {
		return api.get(`/ppo/grupos/motoristas/${cpf}/liked`);
	}

	async relatorioHistoricoMovimentacoes({
		page,
		order_column,
		order_direction,
		cpf,
		nome,
	}) {
		return api.get("/ppo/grupos/motoristas/historico", {
			params: {
				page,
				order_column,
				order_direction,
				cpf,
				nome,
			},
		});
	}

	async exportRelatorioToXlsx({
		nome,
		cpf,
		relatorio = true,
		date_excel_inicio,
		date_excel_fim,
	}) {
		return await api.get("/ppo/grupos/motoristas/historico/excel", {
			responseType: "arraybuffer",
			params: {
				nome,
				cpf,
				relatorio,
				date_excel_inicio,
				date_excel_fim,
			},
		});
	}
}

export default new ServicePPOGruposMotoristas();
