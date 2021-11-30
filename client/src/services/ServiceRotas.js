import api from "./api";
class ServiceRotas {
	async search({
		page,
		order_column,
		order_direction,
		estado_origem,
		estado_destino,
		cidade_origem,
		cidade_destino,
	}) {
		return api.get("/distancia", {
			params: {
				page,
				order_column,
				order_direction,
				estado_origem,
				estado_destino,
				cidade_origem,
				cidade_destino,
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
}

export default new ServiceRotas();
