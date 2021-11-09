import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { BsTelephonePlus, BsWhatsapp } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import NavbarNavigator from "../../Components/NavbarNavigator";
import "./index.css";

function Main() {
	return (
		<>
			<NavbarNavigator />
			<Container className="text-center mb-5">
				<Row className="p-5">
					<h1>Selecione o modo qual a carga foi coletada</h1>
					<Col md={6} className="mt-5 p-5" sm={12}>
						<Link to="/cargas/ligacao">
							<BsTelephonePlus size={80} />
						</Link>
					</Col>
					<Col md={6} className="mt-5 p-5" sm={12}>
						<Link to="/cargas/whatsapp">
							<BsWhatsapp size={80} />
						</Link>
					</Col>
					<Col md={6} className="mt-5 p-5" sm={12}>
						<Link to="/cargas/email">
							<AiOutlineMail size={80} />
						</Link>
					</Col>
					<Col md={6} className="mt-5 p-5" sm={12}>
						<Link to="/cargas/portal">
							<BsPeople size={80} />
						</Link>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Main;
