import api from "./api";
class ServiceSituacoesCargas {
	async search() {
		return api.get("/situacoes/cargas");
	}
	async searchCsn() {
		return api.get("/csn/situacoes/cargas");
	}
}

export default new ServiceSituacoesCargas();
