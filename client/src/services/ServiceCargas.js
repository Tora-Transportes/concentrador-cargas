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
		acessorios_requisitos,
		informacoes_restritivas,
		janela_entrega,
		janela_coleta,
		local_coleta,
		local_entrega,
		placa_veiculo,
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
			acessorios_requisitos,
			informacoes_restritivas,
			janela_entrega,
			janela_coleta,
			local_coleta,
			local_entrega,
			placa_veiculo,
		};

		return api.post("/cargas", carga);
	}

	async createDerivada({
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
		acessorios_requisitos,
		informacoes_restritivas,
		janela_entrega,
		janela_coleta,
		local_coleta,
		local_entrega,
		fk_lote_pai,
		placa_veiculo,
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
			acessorios_requisitos,
			informacoes_restritivas,
			janela_entrega,
			janela_coleta,
			local_coleta,
			local_entrega,
			fk_lote_pai,
			placa_veiculo,
		};

		return api.post(`/cargas/derivada/${carga.fk_lote_pai}`, carga);
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
		acessorios_requisitos,
		informacoes_restritivas,
		janela_entrega,
		janela_coleta,
		local_coleta,
		local_entrega,
		placa_veiculo,
		fk_situacao,
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
			acessorios_requisitos,
			informacoes_restritivas,
			janela_entrega,
			janela_coleta,
			local_coleta,
			local_entrega,
			placa_veiculo,
			fk_situacao,
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
		order_column,
		order_direction,
		id,
		cliente,
		e_lote,
		data_entrega,
		data_coleta,
		tipo_carga,
		responsavel_cadastro,
		data_cadastro,
		destino_carga,
		origem_carga,
		fk_situacao,
		limit,
		placa_veiculo,
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
				destino_carga,
				origem_carga,
				order_column,
				order_direction,
				fk_situacao,
				limit,
				placa_veiculo,
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
		order_column,
		order_direction,
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
				order_column,
				order_direction,
			},
		});
	}

	async getDistance({
		cidade_origem,
		cidade_destino,
		estado_origem,
		estado_destino,
	}) {
		return api.post(
			`/distancia/${cidade_origem}/${estado_origem}/${cidade_destino}/${estado_destino}`
		);
	}

	async importSheet({ file }) {
		const data = new FormData();
		data.set("file", file);

		return api.post("/cargas/importacao", data);
	}
}

export default new ServiceCargas();
