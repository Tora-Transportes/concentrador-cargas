import api from "./api";
class ServiceProdutos {
	async list() {
		return api.get("/produtos");
	}

	async create({ nome }) {
		return api.post("/produtos", { nome });
	}
}

export default new ServiceProdutos();
