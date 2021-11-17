import api from "./api";
class ServiceCargas {
	async create({
		id,
		e_lote,
		cliente,
		origem_carga,
		destino_carga,
		data_entrega,
		data_coleta,
		tipo_carga,
		canal_comunicacao,
		quantidade,
		unidade_medida,
		solicitante,
		observacao,
		responsavel_cadastro,
	}) {
		const carga = {
			id,
			e_lote,
			cliente,
			origem_carga,
			destino_carga,
			data_entrega,
			data_coleta,
			tipo_carga,
			canal_comunicacao,
			quantidade,
			unidade_medida,
			solicitante,
			observacao,
			responsavel_cadastro,
		};

		return api.post("/cargas", carga);
	}

	async update({
		id,
		e_lote,
		cliente,
		origem_carga,
		destino_carga,
		data_entrega,
		data_coleta,
		tipo_carga,
		canal_comunicacao,
		quantidade,
		unidade_medida,
		solicitante,
		observacao,
		responsavel_cadastro,
	}) {
		const carga = {
			e_lote,
			cliente,
			origem_carga,
			destino_carga,
			data_entrega,
			data_coleta,
			tipo_carga,
			canal_comunicacao,
			quantidade,
			unidade_medida,
			solicitante,
			observacao,
			responsavel_cadastro,
		};

		return api.put(`/cargas/${id}`, carga);
	}

	async delete({ id }) {
		return api.delete(`/cargas/${id}`);
	}

	async index({ id }) {
		return api.get(`/cargas/${id}`);
	}

	async search({
		page,
		id,
		cliente,
		e_lote,
		data_entrega,
		data_coleta,
		tipo_carga,
		responsavel_cadastro,
		data_cadastro,
	}) {
		return api.get("/cargas", {
			params: {
				page,
				id,
				cliente,
				e_lote,
				data_entrega,
				data_coleta,
				tipo_carga,
				responsavel_cadastro,
				data_cadastro,
			},
		});
	}

	async exportToXlsx({
		id,
		cliente,
		e_lote,
		data_entrega,
		data_coleta,
		tipo_carga,
		responsavel_cadastro,
		data_cadastro,
	}) {
		return api.get("/relatorio/cargas", {
			responseType: "arraybuffer",
			params: {
				id,
				cliente,
				e_lote,
				data_entrega,
				data_coleta,
				tipo_carga,
				responsavel_cadastro,
				data_cadastro,
			},
		});
	}
}

export default new ServiceCargas();
