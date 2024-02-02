import api from "./api";

class ServicePPOGrupos {
	async list() {
		return api.get("/ppo/grupos");
	}

	async create(file, values) {
		const data = new FormData();

		data.append("file", file);
		data.append("nome", values.nome);
		data.append("empresa", values.empresa);
		data.append("filial", values.filial);
		data.append("cod_filial", values.cod_filial);
		return api.post("/ppo/grupos", data);
	}

	async update(id, existeFile, file, values) {
		const data = new FormData();
		if (existeFile) data.append("file", file);

		data.append("nome", values.nome);
		data.append("empresa", values.empresa);
		data.append("filial", values.filial);
		data.append("cod_filial", values.cod_filial);
		return api.patch(`/ppo/grupos/${id}`, data);
	}

	async delete({ id }) {
		return api.delete(`/ppo/grupos/${id}`);
	}
}

export default new ServicePPOGrupos();
