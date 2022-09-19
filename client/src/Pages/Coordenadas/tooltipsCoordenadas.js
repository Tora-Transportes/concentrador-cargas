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
				"<h2>Opções da Tabela</h2><div>Opções de download (tabela Coordenadas) e redefinição das modificações realizadas.</div>",
			placement: "right",
		},
		{
			element: "#info-registros",
			description:
				"<h2>Total de Registros</h2><div>Contabiliza os registros existentes, que serão exibidos na tabela abaixo.</div>",
			placement: "bottom",
		},
		{
			element: "#edit-linhas-tabela",
			description:
				"<h2>Itens por página</h2><div>Nessa opção você define a quantidade de itens que serão exibidos na tabela.</div>",
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
				"<h2>Tabela Principal</h2><div>Aqui serão exibidas informações de rotas.</div>",
			placement: "top",
		},
		{
			element: "#coluna1",
			description:
				"<h2>Botão info</h2><div>Nesta coluna as informaações exibidas são clicavéis são botões que traz mais informações sobre a rota.</div>",
			placement: "top",
		},
		{
			element: "#Botao-voltar-pag",
			description:
				"<h2>Botão Voltar</h2><div>Voltará para a aba anterior da tabela.</div>",
			placement: "top",
		},
		{
			element: "#Botao-proxima-pag",
			description:
				"<h2>Botão Próxima</h2><div>Seguirá para a próxima aba da tabela.</div>",
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
