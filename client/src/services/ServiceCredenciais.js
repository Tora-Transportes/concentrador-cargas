import api from "./api";
class ServiceCredenciais {
	async list() {
		return api.get("/credenciais");
	}

	async create({ user, portal, password }) {
		return api.post("/credenciais", { user, portal, password });
	}

	async delete({ user, portal }) {
		return api.delete(`/credenciais/${portal}/${user}`);
	}

	async update({ user, portal, password, errored = false }) {
		return api.put(`/credenciais/${portal}/${user}`, {
			password,
			errored,
		});
	}
}

export default new ServiceCredenciais();
