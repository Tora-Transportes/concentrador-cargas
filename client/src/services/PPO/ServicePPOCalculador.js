import api from "../api";

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
		return await api.post("/ppo/calculador", values);
	}

	async motoristas() {
		const dados = await api.get("/ppo/calculador/motoristas");
		const data = [];
		dados.data.data.map((obj) => {
			data.push({
				value: obj.cpf,
				label: obj.nome + " | " + obj.cpf + " | " + obj.tipo_status,
			});
		});
		return data;
	}
}

export default new ServicePPOCalculador();
