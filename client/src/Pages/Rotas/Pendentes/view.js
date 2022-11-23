import React from "react";
import { Container, Row } from "react-bootstrap";
import TableExternal from "../../Components/TableExternal";
import "./rotas.css";

function ViewRotasPendentes({ columns = [], get_data }) {
	return (
		<>
			<Container className="class-body-rotas">
				<Row className="title-rotas">
					<h1 className="title-rotas2">Rotas Pendentes de Cadastro</h1>
				</Row>
				<Row>
					<TableExternal columns={columns} get_data={get_data} />
				</Row>
			</Container>
		</>
	);
}

export default ViewRotasPendentes;
