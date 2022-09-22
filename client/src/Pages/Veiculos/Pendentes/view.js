import React from "react";
import "./../styleVeiculos.css";
import { Container, Row, Col } from "react-bootstrap";
import TabelaCargas from "../../Components/TabelaCargas";
import HandleClick from "./tooltipsMonitoramento";

function ViewRotasPendentes({
	columns = [],
	get_data,
	data,
	totalRegisters = 0,
}) {
	return (
		<div className="class-body">
			<Container fluid className="text-center mb-5 mt-4">
				<Row className="mb-2">
					<h1
						className="class-title-monit"
						id="title-monit"
						onClick={HandleClick}
					>
						Monitoramento - Veículos Pendentes
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
