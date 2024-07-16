import api from "./api";

class ServiceIntegracaoConcentradorApp {
	async info() {
		return await api.get("/logs/app/integracao/info");
	}

	async relatorio({
		page,
		order_column,
		order_direction,
		metodo,
		status,
		erro,
		cod_carga,
	}) {
		return await api.get("/logs/app/integracao/relatorio", {
			params: {
				page,
				order_column,
				order_direction,
				metodo,
				status,
				erro,
				cod_carga,
			},
		});
	}
}
export default new ServiceIntegracaoConcentradorApp();
