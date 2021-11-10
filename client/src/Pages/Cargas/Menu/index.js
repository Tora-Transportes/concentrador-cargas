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
				<Row className="p-5 mt-1">
					<h1>Selecione o modo qual a carga foi coletada</h1>
					<hr className="mt-5" />
					<Col md={6} className="p-5 puts" sm={12}>
						<Link className="text-decoration-none" to="/cargas/ligacao">
							<BsTelephonePlus size={80} />
							<h2 className="fs-3">Ligação</h2>
						</Link>
					</Col>
					<Col md={6} className="p-5 puts" sm={12}>
						<Link className="text-decoration-none" to="/cargas/whatsapp">
							<BsWhatsapp size={80} />
							<h2 className="fs-3">Whatsapp</h2>
						</Link>
					</Col>
					<Col md={6} className="p-5 puts" sm={12}>
						<Link className="text-decoration-none" to="/cargas/email">
							<AiOutlineMail size={80} />
							<h2 className="fs-3">Email</h2>
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
