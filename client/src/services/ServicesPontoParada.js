import api from "./api";

class ServicePontoParada {
	async getPontoParadaPerIdCarga(id) {
		return api.get(`/csn/ponto_parada/${id}`);
	}

	async updatePatchCSN(id, body) {
		api.patch(`/csn/ponto_parada/${id}`, body);
	}
}

export default new ServicePontoParada();
