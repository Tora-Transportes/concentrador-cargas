import React from "react";
import { Container, Row } from "react-bootstrap";
import TableExternal from "../../Components/TableExternal";

function ViewRotasPendentes({ columns = [], get_data }) {
	return (
		<>
			<Container className="text-center mb-5 mt-4">
				<Row className="mb-2">
					<h1>Rotas pendentes de cadastro</h1>
				</Row>
				<Row>
					<TableExternal columns={columns} get_data={get_data} />
				</Row>
			</Container>
		</>
	);
}

export default ViewRotasPendentes;
