import api from "../api";

class ServicePPA {
	async search({
		page,
		order_column,
		order_direction,
		motorista,
		cpf,
		placa_veiculo,
		area_producao,
	}) {
		return api.get("/ppa/reports", {
			params: {
				page,
				order_column,
				order_direction,
				motorista,
				cpf,
				placa_veiculo,
				area_producao,
			},
		});
	}

	async searchBlockedDrivers({
		page,
		order_column,
		order_direction,
		periodo_inicial,
		periodo_final,
		motorista,
		cpf,
		placa_veiculo,
	}) {
		return api.get("/ppa/blockade", {
			params: {
				page,
				order_column,
				order_direction,
				periodo_inicial,
				periodo_final,
				motorista,
				cpf,
				placa_veiculo,
			},
		});
	}

	async searchBlockedDriversHistory({
		page,
		limit,
		order_column,
		order_direction,
		motorista,
		cpf,
	}) {
		return api.get("/ppa/blockade/summary", {
			params: {
				page,
				limit,
				order_column,
				order_direction,
				motorista,
				cpf,
			},
		});
	}

	async exportBlockedDriversHistoryXlsx({
		order_column,
		order_direction,
		motorista,
		cpf,
	}) {
		return api.get("/ppa/blockade/summary/export", {
			responseType: "arraybuffer",
			params: {
				order_column,
				order_direction,
				motorista,
				cpf,
			},
		});
	}

	async exportToXlsx({
		order_column,
		order_direction,
		date_execel_inicio,
		date_execel_fim,
		motorista,
		cpf,
		placa_veiculo,
		area_producao,
	}) {
		return await api.get("/ppa/reports/export", {
			responseType: "arraybuffer",
			params: {
				order_column,
				order_direction,
				date_execel_inicio,
				date_execel_fim,
				motorista,
				cpf,
				placa_veiculo,
				area_producao,
			},
		});
	}

	async exportToBlockadeDriversXlsx({
		order_column,
		order_direction,
		periodo_inicial,
		periodo_final,
		motorista,
		cpf,
		placa_veiculo,
	}) {
		return await api.get("/ppa/blockade/export", {
			responseType: "arraybuffer",
			params: {
				order_column,
				order_direction,
				periodo_inicial,
				periodo_final,
				motorista,
				cpf,
				placa_veiculo,
			},
		});
	}

	async removeBlockedDriverPoints({
		cpf,
		periodo_inicial,
		periodo_final,
		concentrador_user_id,
	}) {
		return api.delete(`/ppa/blockade/summary/${encodeURIComponent(cpf)}`, {
			data: {
				periodo_inicial,
				periodo_final,
				concentrador_user_id,
			},
		});
	}
}

export default new ServicePPA();
