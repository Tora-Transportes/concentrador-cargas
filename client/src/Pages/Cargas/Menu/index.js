import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { MdOutlineWavingHand } from "react-icons/md";
import { SiGooglesheets } from "react-icons/si";
// import { BsPeople } from "react-icons/bs";
import NavbarNavigator from "../../Components/NavbarNavigator";
import "./index.css";
import createSequence from "tooltip-sequence";

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
			console.log("Completed!");
		},
	};

	function handleClick(event) {
		event.preventDefault();
		createSequence(options);
	}
	return (
		<>
			<NavbarNavigator />
			<Container className="text-center mb-5">
				<Row className="p-5 mt-1">
					<h1 onClick={handleClick} id="titulo-selecionar-modo-carga">
						Selecione o modo qual a carga foi coletada
					</h1>
					<Col md={6} className="p-5 puts" sm={12}>
						<Link className="text-decoration-none" to="/cargas/manual">
							<MdOutlineWavingHand
								size={80}
								style={{ color: "#00652E" }}
								id="hand"
							/>
							<h2 className="fs-3" id="title-manual">
								Manual
							</h2>
						</Link>
					</Col>
					{/* <Col md={6} className="p-5 puts" sm={12}>
						<Link className="text-decoration-none" to="/cargas/portal">
							<BsPeople size={80} />
							<h2 className="fs-3">Portal do cliente</h2>
						</Link>
					</Col> */}
					<Col sm={12} md={6} className="p-5 puts">
						<Link className="text-decoration-none" to="/cargas/importar">
							<SiGooglesheets
								size={80}
								style={{ color: "#00652E" }}
								id="import"
							/>
							<h2 className="fs-3" id="title-import">
								Importação em lote
							</h2>
						</Link>
					</Col>
				</Row>
				<Row></Row>
			</Container>
		</>
	);
}

export default Main;
