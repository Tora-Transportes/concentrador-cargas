import api from "./api";
class ServiceFiliais {
	async list() {
		return api.get("/recomendacoes/filiais");
	}
}

export default new ServiceFiliais();
