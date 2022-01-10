import api from "./api";
class ServiceRelatorios {
	async totalizadores() {
		return api.get("/relatorio/totalizadores", {});
	}
}

export default new ServiceRelatorios();
