import api from "./api";
class ServiceVeiculos {
	async get(placa) {
		return api.get(`/veiculos/${placa}`);
	}
}

export default new ServiceVeiculos();
