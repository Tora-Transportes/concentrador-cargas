import api from "./api";
class ServicePPOGrupos {
	async list() {
		return api.get("/ppo/grupos");
	}

	async create({ nome }) {
		return api.post("/ppo/grupos", { nome });
	}

	async update({ id, nome }) {
		return api.patch(`/ppo/grupos/${id}`, { nome });
	}

	async delete({ id }) {
		return api.delete(`/ppo/grupos/${id}`);
	}
}

export default new ServicePPOGrupos();
