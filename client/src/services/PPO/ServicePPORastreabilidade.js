import api from "../api";

class ServicePPORastreabilidade {
	async relatorio({
		mes,
		ano,
		cpf,
		tipo,
		tipo_ppo,
		page,
		order_column,
		order_direction,
	}) {
		return await api.get("/ppo/rastreamento", {
			params: {
				page,
				order_column,
				order_direction,
				mes,
				cpf,
				ano,
				tipo,
				tipo_ppo,
			},
		});
	}
	async exportRelatorioToXlsx({
		mes,
		ano,
		cpf,
		tipo,
		tipo_ppo,
		relatorio = true,
		date_excel_inicio,
		date_excel_fim,
	}) {
		return await api.get("/ppo/rastreamento/excel", {
			responseType: "arraybuffer",
			params: {
				mes,
				ano,
				cpf,
				tipo,
				tipo_ppo,
				relatorio,
				date_excel_inicio,
				date_excel_fim,
			},
		});
	}

	async create(values) {
		return api.post("/ppo/manual", values);
	}
}

export default new ServicePPORastreabilidade();
