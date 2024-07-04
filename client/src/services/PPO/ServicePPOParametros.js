import api from "../api";
class ServicePPOParametros {
	async list() {
		return api.get("/ppo/parametros");
	}

	async create(values) {
		return api.post("/ppo/parametros", values);
	}

	async update(id, values) {
		return api.patch(`/ppo/parametros/${id}`, values);
	}

	async delete({ id }) {
		return api.delete(`/ppo/parametros/${id}`);
	}
}

export default new ServicePPOParametros();
