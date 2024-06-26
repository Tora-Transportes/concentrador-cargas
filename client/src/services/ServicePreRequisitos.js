import api from "./api";

class ServicePreRequisitos {
	async list() {
		return api.get("/pre-requisito");
	}

	async listSelect() {
		const ret = await api.get("/pre-requisito?ativo=1");
		const lista = [];
		ret.data.data.forEach((element) => {
			lista.push({
				value: element.id,
				label: element.nome,
				exige_quantidade: element.exige_quantidade,
			});
		});
		return lista;
	}

	async create(values) {
		return api.post(`/pre-requisito`, values);
	}

	async update(id, values) {
		return api.put(`/pre-requisito/${id}`, values);
	}

	async delete(id) {
		return api.put(`/pre-requisito/${id}`, { ativo: 0 });
	}

	async enable(id) {
		return api.put(`/pre-requisito/${id}`, { ativo: 1 });
	}
}

export default new ServicePreRequisitos();
