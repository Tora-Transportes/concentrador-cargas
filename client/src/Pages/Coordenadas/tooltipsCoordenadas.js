import createSequence from "tooltip-sequence";
import "../Coordenadas/view";

const options = {
	backdropColor: "#6262625d",
	sequence: [
		{
			element: "#title-coorde",
			description:
				"<h2>Bem-vindo ao Coordenadas!</h2><div>Aqui você encontrará rotas e mais informações.</div>",
			placement: "bottom",
		},
		{
			element: "#botao-detalhe-tabela",
			description:
				"<h2>Botão Detalhes</h2><div>Opções de download da tabela *Coordenadas e redefinição das modificações feitas.</div>",
			placement: "right",
		},
		{
			element: "#info-registros",
			description:
				"<h2>Total de Registros</h2><div>Total de registros exibidos na tabela abaixo.</div>",
			placement: "bottom",
		},
		{
			element: "#edit-linhas-tabela",
			description:
				"<h2>Linhas da tabela</h2><div>Nessa opção você define a quantidade de linhas que serão exibidas na tabela.</div>",
			placement: "bottom",
		},
		{
			element: "#Config-campos-tabela",
			description:
				"<h2>Configurar tabela</h2><div>Modifica a tabela, lhe dando opção do que será exibido abaixo (por exemplo: coluna que deseja excluir e coluna que deseja manter).</div>",
			placement: "bottom",
		},
		{
			element: "#Tabela-coordenadas",
			description:
				"<h2>Tabela Principal</h2><div>Essa tabela exibirá informações de rotas.</div>",
			placement: "top",
		},
		{
			element: "#coluna1",
			description:
				"<h2>Botão info</h2><div>Nessa coluna as informações exibidas são clicavéis, ou seja, são botões que trazem mais informações sobre a rota.</div>",
			placement: "top",
		},
		{
			element: "#Botao-voltar-pag",
			description:
				"<h2>Voltar Página</h2><div>Voltará para a aba anterior da tabela.</div>",
			placement: "top",
		},
		{
			element: "#Botao-proxima-pag",
			description:
				"<h2>Próxima Página</h2><div>Seguirá para a próxima aba da tabela.</div>",
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
