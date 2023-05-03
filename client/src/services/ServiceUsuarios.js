import api from "./api";
class ServiceUsuarios {
	async search({ q, page }) {
		return api.get("/usuarios", {
			params: { q, page },
		});
	}
	async searchName({ q }) {
		return api.get("/usuarios/nome", {
			params: { q },
		});
	}

	async changePermissions({ oid, permissoes }) {
		return api.put(`/usuarios/${oid}/permissoes`, {
			permissoes,
		});
	}
	async index({ oid }) {
		return api.get(`/usuarios/${oid}`);
	}

	async addAllPermissions(permissoes) {
		return api.put("/usuarios/permissoes/lote", {
			permissoes,
		});
	}
	async DeleteAllPermissions(permissoes) {
		return api.delete("/usuarios/permissoes/lote", {
			data: { permissoes },
		});
	}
}

export default new ServiceUsuarios();
