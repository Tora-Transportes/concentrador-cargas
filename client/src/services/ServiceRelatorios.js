import api from "./api";
class ServiceRelatorios {
	async totalizadores({ data_inicio, data_final, fk_filial } = {}) {
		return api.get("/relatorio/totalizadores", {
			params: { data_inicio, data_final, fk_filial },
		});
	}

	async resumosDiarios({ data_inicio, data_final, fk_filial } = {}) {
		return api.get("/relatorio/resumo_diario", {
			params: { data_inicio, data_final, fk_filial },
		});
	}

	async mediaAprovacaoGr() {
		return api.get("/relatorio/media_aprovacao_gr");
	}

	async exportToXlsx({ data_inicio, data_final, key, fk_filial } = {}) {
		return api.get(`/relatorio/totalizadores/${key}`, {
			responseType: "arraybuffer",
			params: { data_inicio, data_final, fk_filial },
		});
	}

	async producaoVeiculo(placa) {
		return api.get(`/relatorio/producao_veiculo/${placa}`);
	}
}

export default new ServiceRelatorios();
