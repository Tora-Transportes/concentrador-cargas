import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import NavbarNavigator from "../Components/NavbarNavigator";
import { getClaims } from "../../MicrosoftAuthentication";
import ServiceUsuarios from "../../services/ServiceUsuarios";
import useLoadingScreen from "../Components/LoadingScreen";
import "./index.css";

function Main() {
	const [userData, setUserData] = useState({});
	const [LoadingScreen, setLoading] = useLoadingScreen();

	useEffect(() => {
		setLoading(true);
		try {
			const oid = getClaims().oid;
			ServiceUsuarios.index({ oid })
				.then(({ data }) => {
					setUserData(data.data);
				})
				.finally(() => {
					setLoading(false);
				});
		} catch (error) {
			location.reload();
			setLoading(false);
		}
	}, []);
	return (
		<>
			<LoadingScreen />
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
							Caro(a) <strong>{userData?.nome}</strong> atualmente suas
							permissões são:
						</h4>
						<ListGroup as="li">
							{userData?.permissoes?.map((i) => (
								<ListGroup.Item key={i}>
									{i.replace("_", " ").replace(/PERMISSOES/g, "PERMISSÕES")}
								</ListGroup.Item>
							))}
						</ListGroup>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Main;
