import api from "./api";
class ServiceCargas {
	async create({
		id,
		e_cotado,
		cliente,
		origem_carga,
		destino_carga,
		data_entrega,
		data_coleta,
		tipo_carga,
		canal_comunicacao,
		peso,
		solicitante,
		observacao,
	}) {
		const carga = {
			id,
			e_cotado,
			cliente,
			origem_carga,
			destino_carga,
			data_entrega,
			data_coleta,
			tipo_carga,
			canal_comunicacao,
			peso,
			solicitante,
			observacao,
		};

		return api.post("/cargas", carga);
	}

	async update({
		id,
		e_cotado,
		cliente,
		origem_carga,
		destino_carga,
		data_entrega,
		data_coleta,
		tipo_carga,
		canal_comunicacao,
		peso,
		solicitante,
		observacao,
	}) {
		const carga = {
			e_cotado,
			cliente,
			origem_carga,
			destino_carga,
			data_entrega,
			data_coleta,
			tipo_carga,
			canal_comunicacao,
			peso,
			solicitante,
			observacao,
		};

		return api.put(`/cargas/${id}`, carga);
	}

	async delete({ id }) {
		return api.delete(`/cargas/${id}`);
	}

	async index({ id }) {
		return api.get(`/cargas/${id}`);
	}
}

export default new ServiceCargas();
