import createSequence from "tooltip-sequence";
import "./index";

const options = {
	backdropColor: "#6262625d",
	sequence: [
		{
			element: "#title-cad-manual",
			description:
				"<h2>Formulário</h2><div>Nessa etapa será realizado o cadastro da *Carga Manual.</div>",
			placement: "bottom",
		},
		{
			element: "#campo-aut",
			description:
				"<h2>Campos Iniciais!</h2><div>Os campos *Responsável pelo cadastro e *Código de carga serão preenchidos automaticamente, assim que o campo *Documento de transporte for preenchido.</div>",
			placement: "top",
		},
		{
			element: "#Codigo-filial",
			description:
				"<h2>Código Filial</h2><div>Entre com o *Código da filial da carga.</div>",
			placement: "top",
		},
		{
			element: "#doc-trans",
			description:
				"<h2>Documento</h2><div>Informe o *Documento de Transporte do seu cliente.</div>",
			placement: "top",
		},
		{
			element: "#e_lote_sim",
			description:
				"<h2>É lote? - <strong>SIM</strong></h2><div>Será necessário adicionar algumas informações como cliente, origem de carga, destino de carga, etc. Sem necessidade dos dados do veículo.</div>",
			placement: "bottom",
		},
		{
			element: "#e_lote_nao",
			description:
				"<h2>É lote? - <strong>NÃO</strong></h2><div>Será necessário adicionar os *Dados do veículo. </div>",
			placement: "bottom",
		},
		{
			element: "#title-check-não",
			description:
				"<h2>Dados do Veículo</h2><div>Esse campo só será visto quando a opção do lote for *NÃO.</div>",
			placement: "top",
		},
		{
			element: "#Plca-cavalo",
			description:
				"<h2>Informações</h2><div>Após preencher esse campo os outros serão autopreenchidos</div>",
			placement: "top",
		},
		{
			element: "#botao-detail-veiculo",
			description:
				"<h2>Detalhes do veículo</h2><div>Ao clicar no botão será aberto um modal com informações dos *Detalhes do veículo.</div>",
			placement: "bottom",
		},
		{
			element: "#botao-deb-veiculo",
			description:
				"<h2>Débito(s) do veículo</h2><div>Ao clicar no botão será aberto um modal com informações dos *Débitos do veículo.</div>",
			placement: "bottom",
		},
		{
			element: "#info-clie",
			description:
				"<h2>Insira as Informações do Cliente</h2><div>Informe os dados do cliente nos campos indicados.</div>",
			placement: "top",
		},
		{
			element: "#info-add",
			description:
				"<h2>Áreas de Texto</h2><div>Nos campos de texto indicados, insira as informações de acordo com sua necessidade. Para cada informação específica será disponibilizado um campo de texto.</div>",
			placement: "top",
		},
		{
			element: "#botao-add",
			description:
				"<h2>Botão Adicionar</h2><div>Se no trajeto do motorista houver uma parada, insira as informações após clicar no botão *Adicionar.</div>",
			placement: "top",
		},
		{
			element: "#botao-cadastrar-carg",
			description:
				"<h2>Botão Cadastrar</h2><div>Ao clicar no botão Cadastrar, o seu cadastro será finalizado.</div>",
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
