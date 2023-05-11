import api from "./api";
class ServiceVeiculos {
	async get(placa) {
		return api.get(`/veiculos/${placa}`);
	}

	async detalhesImpedimentos(placa) {
		return api.get(`/veiculos/${placa}/detalhes`);
	}

	async debitos(placa) {
		return api.get(`/veiculos/${placa}/debitos`);
	}

	async manutencao(placa) {
		return api.get(`/veiculos/${placa}/manutencao`);
	}
}

export default new ServiceVeiculos();
