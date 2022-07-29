import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import TabelaCargas from "../../Components/TabelaCargas";

function ViewRotasPendentes({
	columns = [],
	get_data,
	data,
	itensPerPage,
	setItensPerPage,
	totalRegisters = 0,
}) {
	return (
		<>
			<Container fluid className="text-center mb-5 mt-4">
				<Row className="mb-2">
					<h1 className="title-h1">Monitoramento - Veículos pendentes</h1>
				</Row>
				<Row>
					<Col lg={1} className="text-center ">
						<select
							className="btn"
							value={itensPerPage}
							onChange={(e) => setItensPerPage(e.target.value)}
						>
							<option value="10">👀 10</option>
							<option value="20">👀 20</option>
							<option value="50">👀 50</option>
							<option value="100">👀 100</option>
							<option value="500">👀 500</option>
						</select>
					</Col>
					<Col className="text-center">
						Total de {totalRegisters} registros.
					</Col>
					<Col lg={1}></Col>
				</Row>
				<Row>
					<TabelaCargas
						columns={columns}
						get_data={get_data}
						values={data}
						hideHeader={true}
					/>
				</Row>
			</Container>
		</>
	);
}

export default ViewRotasPendentes;
