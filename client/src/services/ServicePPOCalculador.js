import api from "./api";

class ServicePPOCalculador {
	async relatorio({ mes, ano, tipo, page, order_column, order_direction }) {
		return await api.get("/ppo/calculador/relatorio", {
			params: {
				page,
				order_column,
				order_direction,
				mes,
				ano,
				tipo,
			},
		});
	}

	async info() {
		return await api.get("/ppo/calculador/info");
	}

	async blocos() {
		return await api.get("/ppo/calculador/blocos");
	}

	async search(query) {
		return await api.get("/ppo/calculador", { params: query });
	}

	async emExecucao() {
		return await api.get("/ppo/calculador/execucao");
	}

	async create(values) {
		return api.post("/ppo/calculador", values);
	}
}

export default new ServicePPOCalculador();
