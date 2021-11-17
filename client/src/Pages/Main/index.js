import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import NavbarNavigator from "../Components/NavbarNavigator";
import { getClaims } from "../../MicrosoftAuthentication";
import ServiceUsuarios from "../../services/ServiceUsuarios";
import "./index.css";

function Main() {
	const [userData, setUserData] = useState({});

	useEffect(() => {
		const oid = getClaims().oid;
		ServiceUsuarios.index({ oid }).then(({ data }) => {
			setUserData(data.data);
		});
	}, []);
	return (
		<>
			<NavbarNavigator />
			<Container>
				<Row>
					<Col className="text-center mt-5">
						<h1>Seja bem vindo(a) ao Concentrador de cargas</h1>
					</Col>
				</Row>
				<Row>
					<Col className="mt-5">
						<h4>
							Caro <strong>{userData?.nome}</strong> atualmente suas permissões
							são:
						</h4>
						<ListGroup as="li">
							{userData?.permissoes?.map((i) => (
								<ListGroup.Item key={i}>{i.replace("_", " ")}</ListGroup.Item>
							))}
						</ListGroup>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Main;
