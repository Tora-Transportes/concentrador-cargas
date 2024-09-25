import api from "../api";

class ServiceGMPermissoes {
	async listAllUsers() {
		const result = await api.get("/ppo/permissoes-visualizacao/users");
		return result.data.data;
	}

	async list(query) {
		return await api.get("/gestao-multas/usuarios", { params: query });
	}

	async index(id) {
		return await api.get(`/gestao-multas/usuarios/${id}/permissoes`);
	}

	async create(values) {
		return api.post("/gestao-multas/usuarios", values);
	}

	async update(id, values) {
		return api.put(`/gestao-multas/usuarios/${id}`, values);
	}

	async delete(id) {
		return api.delete(`/gestao-multas/usuarios/${id}`);
	}

	async deletePermissaoUsuario(id, id_permissao) {
		return api.delete(
			`/gestao-multas/usuarios/${id}/permissoes/${id_permissao}`
		);
	}
}

export default new ServiceGMPermissoes();
