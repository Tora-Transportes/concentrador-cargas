import api from "./api";
class ServiceRelatorios {
	async totalizadores({ data_inicio, data_final } = {}) {
		return api.get("/relatorio/totalizadores", {
			params: { data_inicio, data_final },
		});
	}

	async exportToXlsx({ data_inicio, data_final, key } = {}) {
		return api.get(`/relatorio/totalizadores/${key}`, {
			responseType: "arraybuffer",
			params: { data_inicio, data_final },
		});
	}
}

export default new ServiceRelatorios();
