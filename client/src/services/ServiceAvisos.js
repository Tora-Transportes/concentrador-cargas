import api from "./api";

class ServiceAvisos {
	async list() {
		return await api.get("/avisos");
	}
	async create(data) {
		return await api.post("/avisos", data);
	}
	async update(id, bodyAviso) {
		return await api.put(`/avisos/${id}`, bodyAviso);
	}
	async patchUpdate(id, bodyLike) {
		return await api.patch(`/avisos/${id}`, bodyLike);
	}
	async delete(id) {
		return await api.delete(`/avisos/${id}`);
	}
}
export default new ServiceAvisos();
