import api from "./api";

class ServicePreRequisitos {
	async list() {
		return api.get("/pre-requisito");
	}

	async create(values) {
		return api.post(`/pre-requisito`, values);
	}

	async update(id, values) {
		return api.put(`/pre-requisito/${id}`, values);
	}

	async delete(id) {
		return api.put(`/pre-requisito/${id}`, { ativo: 0 });
	}

	async enable(id) {
		return api.put(`/pre-requisito/${id}`, { ativo: 1 });
	}
}

export default new ServicePreRequisitos();
