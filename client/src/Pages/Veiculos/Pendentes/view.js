import React from "react";
import { Container, Row } from "react-bootstrap";
import TabelaCargas from "../../Components/TabelaCargas";

function ViewRotasPendentes({ columns = [], get_data, data }) {
	return (
		<>
			<Container className="text-center mb-5 mt-4">
				<Row className="mb-2">
					<h1>Monitoramento - Veículos pendentes</h1>
				</Row>
				<Row>
					<TabelaCargas columns={columns} get_data={get_data} values={data} />
				</Row>
			</Container>
		</>
	);
}

export default ViewRotasPendentes;
