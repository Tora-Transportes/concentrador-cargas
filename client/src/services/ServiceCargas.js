import api from "./api";
class ServiceCargas {
	async create({
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
		placa_veiculo,
		fk_filial,
		documento_transporte,
		codigo_motorista,
		placa_carreta,
		placa_bitrem,
		locais,
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
			placa_veiculo,
			fk_filial,
			documento_transporte,
			codigo_motorista:
				codigo_motorista === undefined ? undefined : codigo_motorista || null,

			placa_carreta,
			placa_bitrem,
			locais,
		};
		return await api.post("/cargas", carga);
	}

	async createPontoParada({ ponto, previsao, tipoServico, id_carga }) {
		const dados = {
			ID_ROTAS_CSN: ponto?.split("-")[0],
			ID_CON_CARGAS: id_carga,
			PREVISAO: previsao,
			STATUS_SERVICO: tipoServico.toUpperCase(),
		};
		return await api.post("/csn/ponto_parada", dados);
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
		fk_lote_pai,
		placa_veiculo,
		fk_filial,
		documento_transporte,
		codigo_motorista,
		placa_carreta,
		placa_bitrem,
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
			fk_lote_pai,
			placa_veiculo,
			fk_filial,
			documento_transporte,
			codigo_motorista:
				codigo_motorista === undefined ? undefined : codigo_motorista || null,
			placa_carreta,
			placa_bitrem,
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
		placa_veiculo,
		fk_situacao,
		observacao_gr,
		fk_filial,
		documento_transporte,
		observacao_cancelamento,
		codigo_motorista,
		placa_carreta,
		placa_bitrem,
		locais,
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
			placa_veiculo,
			fk_situacao,
			observacao_gr,
			fk_filial,
			documento_transporte,
			observacao_cancelamento,
			codigo_motorista:
				codigo_motorista === undefined ? undefined : codigo_motorista || null,

			placa_carreta,
			placa_bitrem,
			locais,
		};

		return api.put(`/cargas/${id}`, carga);
	}

	async delete({ id, observacao_exclusao }) {
		return api.delete(`/cargas/${id}`, { data: { observacao_exclusao } });
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
		documento_transporte,
		fk_filial,
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
				documento_transporte,
				fk_filial,
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
		destino_carga,
		origem_carga,
		fk_situacao,
		limit,
		placa_veiculo,
		documento_transporte,
		fk_filial,
		order_column,
		order_direction,
		date_execel_inicio,
		date_execel_fim,
	}) {
		return await api.get("/relatorio/cargas", {
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
				fk_filial,
				origem_carga,
				destino_carga,
				fk_situacao,
				limit,
				placa_veiculo,
				documento_transporte,
				date_execel_inicio,
				date_execel_fim,
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
