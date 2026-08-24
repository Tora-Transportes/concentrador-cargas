import api from "../api";

class ServicePPA {
	async search({
		page,
		order_column,
		order_direction,
		data_inclusao,
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
				data_inclusao,
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

	async searchBlockedDriversSumary({
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

	async exportToXlsx({
		order_column,
		order_direction,
		data_inclusao,
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
				data_inclusao,
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
}

export default new ServicePPA();
