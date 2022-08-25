import createSequence from "tooltip-sequence";

const options1 = {
	backdropColor: "#6262625d",
	sequence: [
		{
			element: "#titulo-selecionar-modo-carga",
			description:
				"<h2>Bem-vindo</h2><div>Nessa etapa selecione a forma que deseja realizar o cadastro da carga que foi coletada e então prossiga.</div>",
			placement: "bottom",
		},
		{
			element: "#hand",
			description:
				"<h2>Manual</h2><div>Se sua carga foi coletada de forma manual Selecione está opção.</div>",
			placement: "bottom",
		},
		{
			element: "#import",
			description:
				"<h2>Importar</h2><div>Caso sua carga foi coletada em um Arquivo Selecione está opção.</div>",
			placement: "bottom",
		},
	],
	onComplete: function () {
		window.location.reload();
	},
};

function HandleClick(event) {
	event.preventDefault();
	createSequence(options1);
}
export default HandleClick;
