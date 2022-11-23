import api from "./api";

class ServiceCsnCargas {
	async list() {
		return await api.get("/csn/cargas");
	}

	async create(data) {
		return await api.post("/csn/cargas", data);
	}

	async update(id, bodyRota) {
		return await api.put(`/csn/cargas/${id}`, bodyRota);
	}

	async delete(id) {
		return await api.delete(`/csn/cargas/${id}`);
	}
}

export default new ServiceCsnCargas();
