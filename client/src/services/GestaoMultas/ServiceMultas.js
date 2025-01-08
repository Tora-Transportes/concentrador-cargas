import api from "../api";

class ServiceGMMultas {
	async list(query) {
		return await api.get("/gestao-multas/multas", { params: query });
	}
	async index(ait) {
		return await api.get(`/gestao-multas/multas/${ait}`);
	}
	async gerarExcel(query) {
		return await api.get("/gestao-multas/multas/excel", {
			params: query,
			responseType: "arraybuffer",
		});
	}
}

export default new ServiceGMMultas();
