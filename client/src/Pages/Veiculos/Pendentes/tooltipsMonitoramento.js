import createSequence from "tooltip-sequence";
import "./view";

const options = {
	backdropColor: "#6262625d",
	sequence: [
		{
			element: "#title-monit",
			description:
				"<h2>Bem-vindo!</h2><div>Na tela de Monitoramento, são controladas as etapas de aprovação e reprovação dos veículos, conforme mostra a tabela abaixo.</div>",
			placement: "bottom",
		},
		{
			element: "#rows-monit",
			description:
				"<h2>Linhas da Tabela</h2><div>Nessa opção você define a quantidade de linhas que serão exibidas na tabela.</div>",
			placement: "bottom",
		},
		{
			element: "#import",
			description:
				"<h2>Importar</h2><div>Caso sua carga tenha coletada em um Arquivo Selecione essa opção.</div>",
			placement: "bottom",
		},
		{
			element: "#total-reg",
			description:
				"<h2>Total Registros</h2><div>total de registros exibidos na tabela abaixo.</div>",
			placement: "bottom",
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
