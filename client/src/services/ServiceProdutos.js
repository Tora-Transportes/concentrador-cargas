import api from "./api";
class ServiceProdutos {
	async list() {
		return api.get("/produtos");
	}

	async create({ nome }) {
		return api.post("/produtos", { nome });
	}

	async update({ nome, id }) {
		return api.put(`/produtos/${nome}`, { id });
	}

	async delete({ nome, observacao }) {
		return api.delete(`/produtos/${nome}`, { data: { observacao } });
	}
	async enable({ nome }) {
		return api.put(`/produtos/${nome}/ativar`);
	}
}

export default new ServiceProdutos();
