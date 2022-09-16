import api from "./api";
class ServiceProdutos {
	async list() {
		return api.get("/produtos");
	}

	async create({ nome }) {
		return api.post("/produtos", { nome });
	}

	async update({ nome, id }) {
		return api.put(`/produtos/${id}`, { nome });
	}

	async delete({ id, observacao }) {
		return api.delete(`/produtos/${id}`, { data: { observacao } });
	}
	async enable({ id }) {
		return api.put(`/produtos/${id}/ativar`);
	}
}

export default new ServiceProdutos();
