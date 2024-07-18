import api from "./api";

class ServiceIntegracaoConcentradorApp {
	async info(fk_filial) {
		return await api.get(`/logs/app/integracao/info?fk_filial=${fk_filial}`);
	}

	async filiais() {
		const ret = await api.get("/recomendacoes/filiais");
		const data = [];

		ret.data.data.forEach((element) => {
			data.push({
				value: element.FIL_COD,
				label: element.FIL_DSC,
			});
		});

		data.sort((a, b) => a.value - b.value);
		return data;
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
