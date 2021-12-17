import api from "./api";
class ServiceSituacoesCargas {
	async search() {
		return api.get("/situacoes/cargas");
	}
}

export default new ServiceSituacoesCargas();
