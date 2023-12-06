import api from "./api";
class ServicePPOGrupos {
	async list() {
		return api.get("/ppo/grupos");
	}

	async create(values) {
		return api.post("/ppo/grupos", values);
	}

	async update(id, values) {
		return api.patch(`/ppo/grupos/${id}`, values);
	}

	async delete({ id }) {
		return api.delete(`/ppo/grupos/${id}`);
	}
}

export default new ServicePPOGrupos();
