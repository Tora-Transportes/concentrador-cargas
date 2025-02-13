import api from "../api";

class ServiceGMImpendimentos {
	async list(query) {
		return await api.get("/gestao-multas/impedimentos", { params: query });
	}
	async update(id, values) {
		return api.put(`/gestao-multas/impedimentos/${id}`, values);
	}

	async create(values) {
		return api.post("/gestao-multas/impedimentos", values);
	}

	async historico(query) {
		return await api.get("/gestao-multas/impedimentos/historico", {
			params: query,
		});
	}
}

export default new ServiceGMImpendimentos();
