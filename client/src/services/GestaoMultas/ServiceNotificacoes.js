import api from "../api";

class ServiceGMNotificacoes {
	async list(query) {
		return await api.get("/gestao-multas/notificacoes", { params: query });
	}
	async index(ait) {
		return await api.get(`/gestao-multas/notificacoes/${ait}`);
	}

	async atualizar(ait) {
		return await api.get(`/gestao-multas/smartec/notificacoes/${ait}`);
	}

	async indicarInfrator(values) {
		return api.post("/gestao-multas/notificacoes/infrator", values);
	}

	async excluirInfrator(values) {
		return api.post(`/gestao-multas/notificacoes/infrator:excluir`, values);
	}

	async regerarInfratores(values) {
		return api.post(`/gestao-multas/notificacoes/infrator/regerar`, values);
	}

	async atualizarStatus(values) {
		return api.post(`/gestao-multas/notificacoes/status`, values);
	}

	async gerarFici(query) {
		return await api.get(
			"/gestao-multas/notificacoes/infrator/gerar-formulario",
			{
				params: query,
				responseType: "arraybuffer",
			}
		);
	}

	async solicitarBoleto(values) {
		return api.post(
			"/gestao-multas/notificacoes/boletos/gerar-solicitacao",
			values
		);
	}

	async gerarDespesa(values) {
		return api.post("/gestao-multas/notificacoes/despesas", values);
	}

	async downloadTermo(ait, mes, ano) {
		return await api.get(
			`/gestao-multas/termos/ait/${ait}/download?mes=${mes}&ano=${ano}`,
			{
				responseType: "arraybuffer",
			}
		);
	}

	async gerarExcel(query) {
		return await api.get("/gestao-multas/notificacoes/excel", {
			params: query,
			responseType: "arraybuffer",
		});
	}
}

export default new ServiceGMNotificacoes();
