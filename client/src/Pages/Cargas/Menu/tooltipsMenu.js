import createSequence from "tooltip-sequence";
import "./index";

const options = {
	backdropColor: "#6262625d",
	sequence: [
		{
			element: "#titulo-selecionar-modo-carga",
			description:
				"<h2>Bem-vindo!</h2><div>Nesta etapa selecione a forma em que será realizado o cadastro da carga coletada e então prossiga.</div>",
			placement: "bottom",
		},
		{
			element: "#hand",
			description:
				"<h2>Manual</h2><div>Para uma carga coletada manualmente, selecione esta opção.</div>",
			placement: "bottom",
		},
		{
			element: "#import",
			description:
				"<h2>Importar</h2><div>Caso a carga tenha sido coletada em um Arquivo, selecione esta opção.</div>",
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
