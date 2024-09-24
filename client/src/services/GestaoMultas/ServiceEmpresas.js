import api from "../api";

class ServiceGMEmpresas {
	async list(query) {
		return await api.get("/gestao-multas/empresas", { params: query });
	}

	async index(id) {
		return await api.get(`/gestao-multas/empresas/${id}`);
	}

	async create(values) {
		return api.post("/gestao-multas/empresas", values);
	}

	async update(id, values) {
		return api.put(`/gestao-multas/empresas/${id}`, values);
	}

	async delete(id) {
		return api.delete(`/gestao-multas/empresas/${id}`);
	}
}

export default new ServiceGMEmpresas();
