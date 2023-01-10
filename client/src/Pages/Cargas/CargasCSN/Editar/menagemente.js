import moment from "moment";
import { formatDateAddHours } from "src/Pages/Utils/formatDate";

export const funcBodyEdit = (data, tipoServico) => {
	const nomeCliente = data.CLIENTE !== null ? data.CLIENTE : data.DESCRICAO;
	console.log("AAAAAAAAAAAAAAAAAAAAA");
	return {
		ponto: nomeCliente,
		tipoServico,
		previsao: formatDateAddHours(data.PREVISAO, 1),
		previsaoSaida: formatDateAddHours(data.PREVISAO_SAIDA, 1),
		tempServicoLocal: data.TEMP_SERV_LOCAL_COLETA,
		tempServicoLocalEntrega: data?.TEMP_SERV_LOCAL_ENTREGA,
		coletaEfetivaSaida: moment(data.SAIDA_EFETIVA_COLETA).format(
			"YYYY-MM-DDTHH:mm"
		),
		entregaEfetivaSaida: moment(data?.SAIDA_EFETIVA_ENTREGA).format(
			"YYYY-MM-DDTHH:mm"
		),
		latitude: data.LATITUDE,
		longitude: data.LONGITUDE,
		client: nomeCliente,
		id: data.ID,
		idRotaCsn: data.ID_ROTAS_CSN,
		coletaEfetiva:
			data.COLETA_EFETIVA === null
				? null
				: moment(data.COLETA_EFETIVA).format("YYYY-MM-DDTHH:mm"),
		entregaEfetiva:
			data.ENTREGA_EFETIVA === null
				? null
				: moment(data.ENTREGA_EFETIVA).format("YYYY-MM-DDTHH:mm"),
		coletaEfetiva_peacao:
			data.COLETA_EFETIVA_PEACAO === null
				? null
				: moment(data.COLETA_EFETIVA_PEACAO).format("YYYY-MM-DDTHH:mm"),
		coletaEfetiva_mundo:
			data.COLETA_EFETIVA_MUNDO === null
				? null
				: moment(data.COLETA_EFETIVA_MUNDO).format("YYYY-MM-DDTHH:mm"),
		coletaEfetiva_posto30:
			data.COLETA_EFETIVA_POSTO30 === null
				? null
				: moment(data.COLETA_EFETIVA_POSTO30).format("YYYY-MM-DDTHH:mm"),
	};
};
