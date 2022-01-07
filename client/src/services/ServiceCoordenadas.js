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
			},
		});
	}
}

export default new ServiceCoordenadas();
