import api from "./api";
class ServicePPOParametros {
	async list() {
		return api.get("/ppo/parametros");
	}

	async create({ nome }) {
		return api.post("/ppo/parametros", { nome });
	}

	async update({ id, nome }) {
		return api.patch(`/ppo/parametros/${id}`, { nome });
	}

	async delete({ id }) {
		return api.delete(`/ppo/parametros/${id}`);
	}
}

export default new ServicePPOParametros();
