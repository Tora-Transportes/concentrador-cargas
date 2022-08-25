import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { MdOutlineWavingHand } from "react-icons/md";
import { SiGooglesheets } from "react-icons/si";
import "./index.css";
import createSequence from "tooltip-sequence";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";

function Main() {
	const options = {
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

	function handleClick(event) {
		event.preventDefault();
		createSequence(options);
	}
	console.log(handleClick);
	return (
		<>
			<Menusuperior type={"teste"} />
			<Container className="text-center mb-5">
				<h1 id="titulo-selecionar-modo-carga" className="class-title-coleta">
					Selecione o modo qual a carga foi coletada
				</h1>
				<div className="class-body-selecao-cad">
					<Link className="text-decoration-none" to="/cargas/manual">
						<MdOutlineWavingHand
							size={70}
							style={{ color: "#00652E", marginTop: "4rem" }}
							id="hand"
						/>
						<h2 id="title-manual">Manual</h2>
					</Link>
					<Link className="text-decoration-none" to="/cargas/importar">
						<SiGooglesheets
							size={70}
							style={{ color: "#00652E", marginTop: "4rem" }}
							id="import"
						/>
						<h2 id="title-import">Importação em lote</h2>
					</Link>
				</div>
			</Container>
		</>
	);
}

export default Main;
