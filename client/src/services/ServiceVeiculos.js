import api from "./api";
class ServiceVeiculos {
	async get(placa) {
		return api.get(`/veiculos/${placa}`);
	}

	async detalhesImpedimentos(placa) {
		return api.get(`/veiculos/${placa}/detalhes`);
	}
}

export default new ServiceVeiculos();
