import createSequence from "tooltip-sequence";
import "../Cadastrar/index";

const options = {
	backdropColor: "#6262625d",
	sequence: [
		{
			element: "#title-cad-manual",
			description:
				"<h2>Formulário</h2><div>Nesta etapa irá realizar o Cadastro da Carga Manual.</div>",
			placement: "bottom",
		},
		{
			element: "#campo-aut",
			description:
				"<h2>Campos Iniciais!</h2><div>O campo responsável pelo cadastro e código de carga será preenchido automaticamente, assim que o campo Documento de Transporte for preenchido.</div>",
			placement: "top",
		},
		{
			element: "#Codigo-filial",
			description:
				"<h2>Código Filial</h2><div>Entre com o código da filial da Carga.</div>",
			placement: "top",
		},
		{
			element: "#doc-trans",
			description:
				"<h2>Documento</h2><div>Entre com o Documento de Transporte de seu Cliente.</div>",
			placement: "top",
		},
		{
			element: "#e_lote_sim",
			description:
				"<h2>É lote - <strong>SIM</strong></h2><div>será necessário adicionar algumas informações como informar um cliente, origem de carga, destino de carga etc. Sem necessidade dos dados do veículo.</div>",
			placement: "bottom",
		},
		{
			element: "#e_lote_nao",
			description:
				"<h2>É lote - <strong>NÃO</strong></h2><div>Será necessário adicionar os Dados do Veículo. </div>",
			placement: "bottom",
		},
		{
			element: "#title-check-não",
			description:
				"<h2>Dados do Veículo</h2><div>Este campo só será visivél quando marcar a opção Não do checkbox.</div>",
			placement: "top",
		},
		{
			element: "#Plca-cavalo",
			description:
				"<h2>Informações</h2><div>Após preencher este campo os outros será autopreenchido</div>",
			placement: "top",
		},
		{
			element: "#botao-detail-veiculo",
			description:
				"<h2>Detalhes Veículo!</h2><div>Ao clicar no botão irá abrir um modal com informações dos Detalhes do veículo.</div>",
			placement: "bottom",
		},
		{
			element: "#botao-deb-veiculo",
			description:
				"<h2>Débito Veículo</h2><div>Ao clicar no botão irá abrir um modal com informações dos Débitos do veículo.</div>",
			placement: "bottom",
		},
		{
			element: "#info-clie",
			description:
				"<h2>Insira as Informações do Cliente</h2><div>Entre com as informações do cliente nos campos abaixo.</div>",
			placement: "top",
		},
		{
			element: "#info-add",
			description:
				"<h2>Aréas de Texto</h2><div>Nos campos de texto abaixo inserir informações de acordo com sua necessidade para cada iinformação em expecifico terá um campo de texto disponível.</div>",
			placement: "top",
		},
		{
			element: "#botao-add",
			description:
				"<h2>Botão Adicionar</h2><div>Se no trajeto do motorista houver uma parada inserir no campo que irá abrir clicando no Botão Adicionar.</div>",
			placement: "top",
		},
		{
			element: "#botao-cadastrar-carg",
			description:
				"<h2>Botão Cadastrar</h2><div>Ao clicar no Botão Cadastrar você usuário finalizara o cadastro.</div>",
			placement: "top",
		},
	],
	onComplete: function () {
		window.location.reload();
	},
};
function HandleClick(event) {
	event.preventDefault();
	createSequence(options);
}
export default HandleClick;
