import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import TabelaCargas from "../../Components/TabelaCargas";
import HandleClick from "./tooltipsMonitoramento";
import "../Pendentes/style.css";

function ViewRotasPendentes({
	columns = [],
	get_data,
	data,
	totalRegisters = 0,
}) {
	return (
		<div className="class-body-monito">
			<Container fluid className="text-center mb-5 mt-4">
				<Row className="mb-2">
					<h1
						className="class-title-monit"
						id="title-monit"
						onClick={HandleClick}
					>
						Monitoramento - Veículos pendentes
					</h1>
				</Row>
				<Row>
					<Col lg={1} className="text-center "></Col>
					<Col className="text-center" id="total-reg">
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
		</div>
	);
}

export default ViewRotasPendentes;
