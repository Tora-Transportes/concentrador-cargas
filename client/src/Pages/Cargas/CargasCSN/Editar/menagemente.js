import { formatDate } from "src/Pages/Utils/formatDate";

export const funcBodyEdit = (data, tipoServico) => {
	const nomeCliente = data.CLIENTE !== null ? data.CLIENTE : data.DESCRICAO;

	return {
		ponto: nomeCliente,
		tipoServico,
		previsao: formatDate(data.PREVISAO),
		previsaoSaida: formatDate(data.PREVISAO_SAIDA),
		tempServicoLocal: data.TEMP_SERV_LOCAL_COLETA,
		tempServicoLocalEntrega: data?.TEMP_SERV_LOCAL_ENTREGA,
		coletaEfetivaSaida: formatDate(data.SAIDA_EFETIVA_COLETA),
		entregaEfetivaSaida: formatDate(data?.SAIDA_EFETIVA_ENTREGA),
		latitude: data.LATITUDE,
		longitude: data.LONGITUDE,
		client: nomeCliente,
		id: data.ID,
		idRotaCsn: data.ID_ROTAS_CSN,
		coletaEfetiva:
			data.COLETA_EFETIVA === null ? null : formatDate(data.COLETA_EFETIVA),
		entregaEfetiva:
			data.ENTREGA_EFETIVA === null ? null : formatDate(data.ENTREGA_EFETIVA),
		coletaEfetiva_peacao:
			data.COLETA_EFETIVA_PEACAO === null
				? null
				: formatDate(data.COLETA_EFETIVA_PEACAO),
		coletaEfetiva_mundo:
			data.COLETA_EFETIVA_MUNDO === null
				? null
				: formatDate(data.COLETA_EFETIVA_MUNDO),
		coletaEfetiva_posto30:
			data.COLETA_EFETIVA_POSTO30 === null
				? null
				: formatDate(data.COLETA_EFETIVA_POSTO30),
	};
};

export const validarInputEfetivo = (
	ponto_passagem,
	ponto_passagem2,
	ponto_passagem3,
	ponto_passagem4,
	fk_situacao
) => {
	const inputPrenchidos = [];
	for (const [key, value] of Object.entries({
		ponto_passagem,
		ponto_passagem2,
		ponto_passagem3,
		ponto_passagem4,
	})) {
		if (value?.coletaEfetiva_posto30 !== null) inputPrenchidos.push(true);
		if (value?.coletaEfetiva_mundo !== null) inputPrenchidos.push(true);
		if (value?.coletaEfetiva_peacao !== null) inputPrenchidos.push(true);
		if (value?.coletaEfetivaSaida !== null) inputPrenchidos.push(true);
		if (value?.entregaEfetiva !== null) inputPrenchidos.push(true);
		if (value?.entregaEfetivaSaida !== null) inputPrenchidos.push(true);
		key;
	}

	let validationCounInput = true;
	if (fk_situacao === 6 && inputPrenchidos.length < 8) {
		validationCounInput = false;
	}
	return validationCounInput;
};
