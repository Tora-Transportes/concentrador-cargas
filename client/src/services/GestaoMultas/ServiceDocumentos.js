import api from "../api";

class ServiceGMDocumentos {
	async create(values) {
		return api.post("/gestao-multas/documentos", values);
	}

	async listByAit(ait) {
		return api.get(`/gestao-multas/documentos/ait/${ait}`);
	}

	async logs(ait) {
		return api.get(`/gestao-multas/documentos/ait/${ait}/logs`);
	}

	async delete(id, user) {
		return api.delete(`/gestao-multas/documentos/${id}/user/${user}`);
	}

	async download(id) {
		return await api.get(`/gestao-multas/documentos/${id}/download`, {
			responseType: "arraybuffer",
		});
	}
}

export default new ServiceGMDocumentos();
