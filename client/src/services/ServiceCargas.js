//import moment from "moment";
//import { formatDateObject } from "src/Pages/Utils/formatDate";
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
		carga_csn,
		rastreador,
		carga_app,
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
			carga_csn,
			rastreador,
			carga_app,
		};
		return await api.post("/cargas", carga);
	}

	async indexCsn({ id }) {
		return api.get(`/csn/cargas/info/${id}`);
	}

	async deletePontoParada({ id }) {
		return api.delete(`/csn/ponto_parada/${id}`);
	}

	async createPontoParada(dadosPontoPassagem) {
		return await api.post("/csn/ponto_parada", dadosPontoPassagem);
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
		carga_csn,
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
			carga_csn,
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
		carga_csn,
		rastreador,
		info_passagem,
	}) {
		const carga = {
			e_lote,
			cliente,
			origem_carga,
			destino_carga: destino_carga === "" ? null : destino_carga,
			data_entrega: data_entrega === "" ? null : data_entrega,
			data_coleta: data_coleta === "" ? null : data_coleta,
			tipo_carga: tipo_carga === "" ? null : tipo_carga,
			canal_comunicacao,
			quantidade,
			unidade_medida,
			solicitante: solicitante === "" ? null : solicitante,
			observacao: observacao === "" ? null : observacao,
			responsavel_cadastro,
			acessorios_requisitos:
				acessorios_requisitos === "" ? null : acessorios_requisitos,
			informacoes_restritivas:
				informacoes_restritivas === "" ? null : informacoes_restritivas,
			janela_entrega: janela_entrega === "" ? null : janela_entrega,
			janela_coleta: janela_coleta === "" ? null : janela_coleta,
			placa_veiculo,
			fk_situacao,
			observacao_gr: observacao_gr === "" ? null : observacao_gr,
			fk_filial,
			documento_transporte:
				documento_transporte === "" ? null : documento_transporte,
			observacao_cancelamento:
				observacao_cancelamento === "" ? null : observacao_cancelamento,
			codigo_motorista:
				codigo_motorista === undefined ? undefined : codigo_motorista || null,

			placa_carreta: placa_carreta === "" ? null : placa_carreta,
			placa_bitrem: placa_bitrem === "" ? null : placa_bitrem,
			locais,
			carga_csn,
			rastreador,
			info_passagem,
		};
		carga;
		return api.put(`/cargas/${id}`, carga);
	}

	async updatePatch(id, dataCarga) {
		return api.patch(`/cargas/${id}`, dataCarga);
	}

	async updateCSN({
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
		carga_csn,
		rastreador,
		info_passagem,
	}) {
		const carga = {
			e_lote,
			cliente,
			origem_carga,
			destino_carga: destino_carga === "" ? null : destino_carga,
			data_entrega: data_entrega === "" ? null : data_entrega,
			data_coleta: data_coleta === "" ? null : data_coleta,
			tipo_carga: tipo_carga === "" ? null : tipo_carga,
			canal_comunicacao,
			quantidade,
			unidade_medida,
			solicitante: solicitante === "" ? null : solicitante,
			observacao: observacao === "" ? null : observacao,
			responsavel_cadastro,
			acessorios_requisitos:
				acessorios_requisitos === "" ? null : acessorios_requisitos,
			informacoes_restritivas:
				informacoes_restritivas === "" ? null : informacoes_restritivas,
			janela_entrega: janela_entrega === "" ? null : janela_entrega,
			janela_coleta: janela_coleta === "" ? null : janela_coleta,
			placa_veiculo,
			fk_situacao,
			observacao_gr: observacao_gr === "" ? null : observacao_gr,
			fk_filial,
			documento_transporte:
				documento_transporte === "" ? null : documento_transporte,
			observacao_cancelamento:
				observacao_cancelamento === "" ? null : observacao_cancelamento,
			codigo_motorista:
				codigo_motorista === undefined ? undefined : codigo_motorista || null,

			placa_carreta: placa_carreta === "" ? null : placa_carreta,
			placa_bitrem: placa_bitrem === "" ? null : placa_bitrem,
			locais,
			carga_csn,
			rastreador,
			info_passagem,
		};
		carga;
		return api.put(`/csn/cargas/info/${id}`, carga);
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
		carga_csn,
	}) {
		const url = carga_csn === 1 ? "csn/cargas/info" : "/cargas/";
		return api.get(url, {
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
				carga_csn,
			},
		});
	}
	async searchCsnPlacaFkSituacao({ placa }) {
		return api.get("csn/cargas/placa", { params: { placa } });
	}

	async searchCsn({
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
		placa_carreta,
		documento_transporte,
		fk_filial,
		carga_csn,
		categoria_veiculo,
		rastreador,
		canal_comunicacao,
	}) {
		return await api.get("/csn/cargas/info", {
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
				placa_carreta,
				documento_transporte,
				fk_filial,
				carga_csn,
				categoria_veiculo,
				rastreador,
				canal_comunicacao,
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
	async exportToXlsxCsn({
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
		return await api.get("/csn/relatorio/cargas/info", {
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
