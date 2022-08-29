import createSequence from "tooltip-sequence";
import "../Coordenadas/view";

const options = {
	backdropColor: "#6262625d",
	sequence: [
		{
			element: "#title-coorde",
			description:
				"<h2>Bem-vindo</h2><div>ao Coordenadas, aqui você encontrará rotas e mais informações.</div>",
			placement: "bottom",
		},
		{
			element: "#botao-detalhe-tabela",
			description:
				"<h2>Botão Detalhes</h2><div>Opções de download da tabela do Coordenadas e redefinir modificações .</div>",
			placement: "right",
		},
		{
			element: "#info-registros",
			description:
				"<h2>Total de Registro</h2><div>total de registros exibidos na tabela abaixo.</div>",
			placement: "bottom",
		},
		{
			element: "#edit-linhas-tabela",
			description:
				"<h2>Linhas da tabela</h2><div>Nesta opção você define a quantidade de linhas que será exibidas na tabela.</div>",
			placement: "bottom",
		},
		{
			element: "#Config-campos-tabela",
			description:
				"<h2>Configurar tabela</h2><div>Modifica a tabela, lhe dando opção do que será exibido na tabela abaixo por exemplo: coluna que deseja excluir e coluna que deseja manter.</div>",
			placement: "bottom",
		},
		{
			element: "#Tabela-coordenadas",
			description:
				"<h2>Tabela Principal</h2><div>Está tabela exibirá informações de Rotas.</div>",
			placement: "top",
		},
		{
			element: "#coluna1",
			description:
				"<h2>Botão info</h2><div>Nesta coluna as informaações exibidas são clicavéis ou seja são botões que traz mais informações sobre a rota.</div>",
			placement: "top",
		},
		{
			element: "#Botao-voltar-pag",
			description:
				"<h2>Próxima Página</h2><div>Seguirá para uma próxima aba da tabela.</div>",
			placement: "top",
		},
		{
			element: "#Botao-proxima-pag",
			description:
				"<h2>Voltar Página</h2><div>Voltará para uma aba anterior da tabela.</div>",
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
