import api from "./api";

class ServiceCargaCTE {
	async search(id) {
		return await api.get(`/cargaCTE/${id}`);
	}
}

export default new ServiceCargaCTE();
