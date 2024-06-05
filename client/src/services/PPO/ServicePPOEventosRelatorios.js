import api from "../api";

class ServicePPOEventosRelatorios {
	async relatorioDocumentos({
		page,
		order_column,
		order_direction,
		cpf,
		mes = 6,
		ano = 2024,
		nome,
		matricula,
		status_aprovacao,
		aprovado,
	}) {
		return api.get("/ppo_eventos/relatorios/aprovacoes", {
			params: {
				page,
				order_column,
				order_direction,
				cpf,
				mes,
				ano,
				nome,
				matricula,
				status_aprovacao,
				aprovado,
			},
		});
	}

	async exportRelatorioDocumetosToXlsx({
		cpf,
		mes,
		ano,
		nome,
		matricula,
		status_aprovacao,
		aprovado,
		date_excel_inicio,
		date_excel_fim,
	}) {
		return await api.get("/ppo_eventos/relatorios/aprovacoes/excel", {
			responseType: "arraybuffer",
			params: {
				cpf,
				mes,
				ano,
				nome,
				matricula,
				status_aprovacao,
				aprovado,
				date_excel_inicio,
				date_excel_fim,
			},
		});
	}
}

export default new ServicePPOEventosRelatorios();
