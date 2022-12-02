import { getClaims } from "src/MicrosoftAuthentication";
export const valueFormik = {
	responsavel_cadastro: String(getClaims().name),
	id: "(Será autogerado)",
	e_lote: false,
	cliente: "",
	data_coleta: "",
	data_entrega: "",
	tipo_carga: "",
	quantidade: "",
	unidade_medida: "KG",
	acessorios_requisitos: "",
	informacoes_restritivas: "",
	janela_coleta: "",
	janela_entrega: "",
	placa_veiculo: "",
	documento_transporte: "",
	ponto_passagem: {
		ponto: "",
		tipoServico: "",
		previsao: "",
	},
	ponto_passagem2: {
		ponto: "",
		tipoServico: "",
		previsao: "",
	},
	ponto_passagem3: {
		ponto: "",
		tipoServico: "",
		previsao: "",
	},
	ponto_passagem4: {
		ponto: "",
		tipoServico: "",
		previsao: "",
	},
	ponto_passagem5: {
		ponto: "",
		tipoServico: "",
		previsao: "",
	},
	ponto_passagem6: {
		ponto: "",
		tipoServico: "",
		previsao: "",
	},
	ponto_passagem7: {
		ponto: "",
		tipoServico: "",
		previsao: "",
	},
	ponto_passagem8: {
		ponto: "",
		tipoServico: "",
		previsao: "",
	},
	ponto_passagem9: {
		ponto: "",
		tipoServico: "",
		previsao: "",
	},
	ponto_passagem10: {
		ponto: "",
		tipoServico: "",
		previsao: "",
	},
	ponto_passagem11: {
		ponto: "",
		tipoServico: "",
		previsao: "",
	},
	ponto_passagem12: {
		ponto: "",
		tipoServico: "",
		previsao: "",
	},
};
