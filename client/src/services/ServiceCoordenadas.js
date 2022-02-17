import api from "./api";
class ServiceCoordenadas {
	async search({
		page,
		order_column,
		order_direction,
		mct,
		placa,
		cidade_atual,
		codigo_veiculo,
		ultima_viagem_origem,
		ultima_viagem_destino,
		documento,
		tipo_documento,
		categoria_veiculo,
		limit,
		setor_veiculo,
		tipo_cavalo,
		tipo_carreta,
		nome_motorista,
		telefone_motorista,
	}) {
		return api.get("/coordenadas", {
			params: {
				page,
				order_column,
				order_direction,
				mct,
				placa,
				cidade_atual,
				codigo_veiculo,
				ultima_viagem_origem,
				ultima_viagem_destino,
				documento,
				tipo_documento,
				categoria_veiculo,
				limit,
				setor_veiculo,
				tipo_cavalo,
				tipo_carreta,
				nome_motorista,
				telefone_motorista,
			},
		});
	}

	async exportToXlsx({
		order_column,
		order_direction,
		mct,
		placa,
		cidade_atual,
		codigo_veiculo,
		ultima_viagem_origem,
		ultima_viagem_destino,
		documento,
		tipo_documento,
		categoria_veiculo,
		setor_veiculo,
		tipo_cavalo,
		tipo_carreta,
		nome_motorista,
		telefone_motorista,
	}) {
		return api.get("/relatorio/coordenadas", {
			responseType: "arraybuffer",
			params: {
				order_column,
				order_direction,
				mct,
				placa,
				cidade_atual,
				codigo_veiculo,
				ultima_viagem_origem,
				ultima_viagem_destino,
				documento,
				tipo_documento,
				categoria_veiculo,
				setor_veiculo,
				tipo_cavalo,
				tipo_carreta,
				nome_motorista,
				telefone_motorista,
			},
		});
	}
}

export default new ServiceCoordenadas();
