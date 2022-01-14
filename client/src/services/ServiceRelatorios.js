import api from "./api";
class ServiceRelatorios {
	async totalizadores({ data_inicio, data_final, fk_filial } = {}) {
		return api.get("/relatorio/totalizadores", {
			params: { data_inicio, data_final, fk_filial },
		});
	}

	async exportToXlsx({ data_inicio, data_final, key, fk_filial } = {}) {
		return api.get(`/relatorio/totalizadores/${key}`, {
			responseType: "arraybuffer",
			params: { data_inicio, data_final, fk_filial },
		});
	}
}

export default new ServiceRelatorios();
