import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { BsDownload } from "react-icons/bs";
import TabelaCargas from "../Components/TabelaCargas";

function ViewCoordenadas({ columns = [], get_data, data, handleExportExcel }) {
	return (
		<>
			<Container className="text-center mb-5 mt-4">
				<Row className="mb-2">
					<h1>Coordenadas - Veículos</h1>
				</Row>
				<Row className="text-start">
					<Col>
						<Button variant="outline-info" onClick={handleExportExcel}>
							Exportar <BsDownload />
						</Button>
					</Col>
				</Row>
				<Row>
					<TabelaCargas columns={columns} get_data={get_data} values={data} />
				</Row>
			</Container>
		</>
	);
}

export default ViewCoordenadas;
