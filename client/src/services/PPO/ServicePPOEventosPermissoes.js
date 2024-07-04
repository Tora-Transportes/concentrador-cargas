import api from "../api";

class ServicePPOEventosPermissoes {
	async listAllUsers() {
		const result = await api.get("/ppo_eventos/permissoes/users");
		return result.data.data;
	}

	async list() {
		const result = await api.get("/ppo_eventos/permissoes");
		return result.data.data;
	}

	async create(data) {
		return api.post("/ppo_eventos/permissoes", data);
	}

	async update(oid, data) {
		return api.put(`/ppo_eventos/permissoes/users/${oid}`, data);
	}

	async deleteUser(oid) {
		return api.delete(`/ppo_eventos/permissoes/users/${oid}`);
	}
}

export default new ServicePPOEventosPermissoes();
