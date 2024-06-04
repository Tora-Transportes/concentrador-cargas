import api from "../api";

class ServicePPOPermissoesVisualizacao {
	async listAllUsers() {
		const result = await api.get("/ppo/permissoes-visualizacao/users");
		return result.data.data;
	}
	async listAllGrupos() {
		const result = await api.get("/ppo/grupos");
		const data = [];
		result.data.data.forEach((element) => {
			data.push({ value: element.id, label: element.filial });
		});
		return data;
	}

	async list() {
		const result = await api.get("/ppo/permissoes-visualizacao");
		return result.data.data;
	}

	async create(data) {
		return api.post("/ppo/permissoes-visualizacao", data);
	}

	async update(uid, data) {
		return api.put(`/ppo/permissoes-visualizacao/users/${uid}`, data);
	}

	async deleteGrupo(id, uid) {
		return api.delete(`/ppo/permissoes-visualizacao/users/${uid}/grupos/${id}`);
	}

	async deleteUser(uid) {
		return api.delete(`/ppo/permissoes-visualizacao/users/${uid}`);
	}
}

export default new ServicePPOPermissoesVisualizacao();
