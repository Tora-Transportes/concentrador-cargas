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
			element: "#total-reg",
			description:
				"<h2>Total de Registros</h2><div>Contabiliza os registros existentes, que serão exibidos na tabela abaixo.</div>",
			placement: "bottom",
		},
		{
			element: "#tabela-mon",
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
