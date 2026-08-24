import createSequence from "tooltip-sequence";
import "./view";

const options = {
	backdropColor: "#6262625d",
	sequence: [
		{
			element: "#title-monit",
			description:
				"<h2>Relatório de bloqueios</h2><div>Consulte o consolidado dos motoristas registrados para bloqueio, com a pontuação acumulada e a quantidade de ocorrências.</div>",
			placement: "bottom",
		},
		{
			element: "#total-reg",
			description:
				"<h2>Motoristas encontrados</h2><div>Exibe a quantidade de motoristas agrupados que atendem aos filtros informados.</div>",
			placement: "bottom",
		},
		{
			element: "#tabela-mon",
			description:
				"<h2>Resumo por motorista</h2><div>A tabela apresenta CPF, motorista, pontuação total acumulada e número de registros de bloqueio.</div>",
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
