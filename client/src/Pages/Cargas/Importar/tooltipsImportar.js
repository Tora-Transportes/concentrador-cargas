import createSequence from "tooltip-sequence";
import "../Importar/index";

const options = {
	backdropColor: "#6262625d",
	sequence: [
		{
			element: "#title-import",
			description:
				"<h2>Bem-vindo!</h2><div>Nessa opção é feito o cadastro por importação.</div>",
			placement: "bottom",
		},
		{
			element: "#botao-download",
			description:
				"<h2>Download de modelo</h2><div>Ao clicar no botão será baixado uma planilha de modelo.</div>",
			placement: "bottom",
		},
		{
			element: "#import-arq",
			description:
				"<h2>Escolher Arquivo</h2><div>Nessa opção você poderá carregar seu arquivo, ou seja, sua planilha para ser importada.</div>",
			placement: "top",
		},
		{
			element: "#botao-process",
			description:
				"<h2>Processar</h2><div>Clicando no botão, sua planilha importada será aberta na tabela abaixo.</div>",
			placement: "top",
		},
		{
			element: "#title-tab-import-carg",
			description:
				"<h2>Tabela</h2><div>Essa tabela trás os resultados da sua planilha importada.</div>",
			placement: "top",
		},
		{
			element: "#Table-impot-carg",
			description:
				"<h2>Visualização x Resultados</h2><div>Resultados da sua importação. Atenção! Só terá resultado na tabela, se sua planilha estiver de acordo com o modelo da *Planilha modelo.</div>",
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
