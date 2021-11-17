import api from "./api";
class ServiceUsuarios {
	async search({ q, page }) {
		return api.get("/usuarios", {
			params: { q, page },
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
}

export default new ServiceUsuarios();
