import React from "react";
import "./style.css";
import { Container, Row, Col } from "react-bootstrap";
import TabelaCargas from "../../Components/TabelaCargas";
// import HandleClick from "./tooltipsMonitoramento";

function ViewRotasPendentes({
	columns = [],
	get_data,
	data,
	totalRegisters = 0,
	tipoCarga,
}) {
	const title =
		tipoCarga === "csn"
			? "Monitoramento - Veículos Pendentes CSN"
			: "Monitoramento - Veículos Pendentes";
	return (
		<div className="class-body">
			<Container fluid className="text-center mt-4">
				<Row className="class-title-monit">
					<h1
						id="title-monit"
						// onClick={HandleClick}
					>
						{title}
					</h1>
				</Row>
				<Row>
					<Col lg={1} className="text-center "></Col>
					<Col className="text-center" id="total-reg">
						Total de <strong>{totalRegisters}</strong> registros.
					</Col>
					<Col lg={1}></Col>
				</Row>
				<Row>
					<TabelaCargas
						id="tabela-mon"
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
