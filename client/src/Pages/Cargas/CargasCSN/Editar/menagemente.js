import moment from "moment";

export const funcBodyEdit = (data, tipoServico) => {
	const nomeCliente =
		tipoServico === "Coleta"
			? data.DESCRICAO
			: data.CLIENTE !== null
			? data.CLIENTE
			: "Nada consta";
	return {
		ponto: nomeCliente,
		tipoServico,
		previsao: moment(data.PREVISAO).format("YYYY-MM-DDThh:mm"),
		latitude: data.LATITUDE,
		longitude: data.LONGITUDE,
		client: nomeCliente,
		id: data.ID,
		idRotaCsn: data.ID_ROTAS_CSN,
	};
};
