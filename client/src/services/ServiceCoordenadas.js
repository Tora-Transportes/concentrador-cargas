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
		observacao,
		responsavel_placa,
		responsavel_placa_nome,
		id,
		placa_bitrem,
		placa_carreta,
		cpf_motorista,
		apelido_carreta,
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
				observacao,
				responsavel_placa,
				responsavel_placa_nome,
				id,
				placa_bitrem,
				placa_carreta,
				cpf_motorista,
				apelido_carreta,
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
		observacao,
		responsavel_placa,
		responsavel_placa_nome,
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
				observacao,
				responsavel_placa,
				responsavel_placa_nome,
			},
		});
	}

	async update({ observacao, placa, responsavel_placa, data_janela }) {
		return api.put(`/coordenadas/${placa}`, {
			observacao,
			responsavel_placa,
			data_janela,
		});
	}

	async listVehiclesInRange({ placa, distancia_km }) {
		return api.get(`/coordenadas/${placa}/range`, { params: { distancia_km } });
	}

	async searchRoute({ placa, cnpj }) {
		// return {
		// 	data: {
		// 		cnpj: cnpj,
		// 		placa: placa,
		// 		latitude_origem: -23.476389,
		// 		longitude_origem: -46.439444,
		// 		latitude_destino: -23.467848999999998,
		// 		longitude_destino: -46.48377,
		// 		distancia_km: 5.855,
		// 		duracao_viagem_direta: 504,
		// 	},
		// };
		return api.get(`/coordenadas/${placa}/empresa/${cnpj}`);
	}

	async listVehiclesInRangeEnterprise({ cnpj, distancia_km }) {
		return api.get(`/coordenadas/empresa/${cnpj}`, {
			params: { distancia_km },
		});
		// return {
		// 	data: {
		// 		cnpj: cnpj,
		// 		latitude_origem: -23.476389,
		// 		longitude_origem: -46.439444,
		// 		veiculos: [
		// 			{
		// 				placa: "ABC1234",
		// 				latitude: -22.476389,
		// 				longitude: -46.439444,
		// 				distancia_km: 12.5,
		// 			},
		// 			{
		// 				placa: "ABC1235",
		// 				latitude: -23.476389,
		// 				longitude: -46.439444,
		// 				distancia_km: 13.5,
		// 			},
		// 		],
		// 	},
		// };
	}
}

export default new ServiceCoordenadas();
