import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { MdOutlineWavingHand } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import NavbarNavigator from "../../Components/NavbarNavigator";
import "./index.css";

function Main() {
	return (
		<>
			<NavbarNavigator />
			<Container className="text-center mb-5">
				<Row className="p-5 mt-1">
					<h1>Selecione o modo qual a carga foi coletada</h1>
					<hr className="mt-5" />
					<Col md={6} className="p-5 puts" sm={12}>
						<Link className="text-decoration-none" to="/cargas/manual">
							<MdOutlineWavingHand size={80} />
							<h2 className="fs-3">Manual</h2>
						</Link>
					</Col>
					<Col md={6} className="p-5 puts" sm={12}>
						<Link className="text-decoration-none" to="/cargas/portal">
							<BsPeople size={80} />
							<h2 className="fs-3">Portal do cliente</h2>
						</Link>
					</Col>
					<hr />
				</Row>
			</Container>
		</>
	);
}

export default Main;
