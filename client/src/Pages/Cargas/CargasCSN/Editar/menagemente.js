import moment from "moment";

export const funcBodyEdit = (data, tipoServico) => {
	const nomeCliente = data.CLIENTE !== null ? data.CLIENTE : data.DESCRICAO;

	return {
		ponto: nomeCliente,
		tipoServico,
		previsao: moment(data.PREVISAO).add(3, "hours").format("YYYY-MM-DDTHH:mm"),
		latitude: data.LATITUDE,
		longitude: data.LONGITUDE,
		client: nomeCliente,
		id: data.ID,
		idRotaCsn: data.ID_ROTAS_CSN,
		coletaEfetiva:
			data.COLETA_EFETIVA === null
				? null
				: moment(data.COLETA_EFETIVA)
						.add(3, "hours")
						.format("YYYY-MM-DDTHH:mm"),
		entregaEfetiva:
			data.ENTREGA_EFETIVA === null
				? null
				: moment(data.ENTREGA_EFETIVA)
						.add(3, "hours")
						.format("YYYY-MM-DDTHH:mm"),
		coletaEfetiva_peacao:
			data.COLETA_EFETIVA_PEACAO === null
				? null
				: moment(data.COLETA_EFETIVA_PEACAO)
						.add(3, "hours")
						.format("YYYY-MM-DDTHH:mm"),
		coletaEfetiva_mundo:
			data.COLETA_EFETIVA_MUNDO === null
				? null
				: moment(data.COLETA_EFETIVA_MUNDO)
						.add(3, "hours")
						.format("YYYY-MM-DDTHH:mm"),
		coletaEfetiva_posto30:
			data.COLETA_EFETIVA_POSTO30 === null
				? null
				: moment(data.COLETA_EFETIVA_POSTO30)
						.add(3, "hours")
						.format("YYYY-MM-DDTHH:mm"),
	};
};
