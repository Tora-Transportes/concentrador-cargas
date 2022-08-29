import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { MdOutlineWavingHand } from "react-icons/md";
import { SiGooglesheets } from "react-icons/si";
import "./index.css";
import HandleClick from "./tooltipsMenu";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";

function Main() {
	return (
		<>
			<Menusuperior type={"teste"} />
			<Container className="text-center mb-5">
				<h1
					id="titulo-selecionar-modo-carga"
					className="class-title-coleta"
					onClick={HandleClick}
				>
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
