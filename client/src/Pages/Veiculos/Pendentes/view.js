import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import TabelaCargas from "../../Components/TabelaCargas";
import HandleClick from "./tooltipsMonitoramento";
import "../Pendentes/style.css";

function ViewRotasPendentes({
	columns = [],
	get_data,
	data,
	itensPerPage,
	setItensPerPage,
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
					<Col lg={1} className="text-center ">
						<select
							id="rows-monit"
							className="btn"
							value={itensPerPage}
							onChange={(e) => setItensPerPage(e.target.value)}
						>
							<option value="10">Rows 10</option>
							<option value="20">Rows 20</option>
							<option value="50">Rows 50</option>
							<option value="100">Rows 100</option>
							<option value="500">Rows 500</option>
						</select>
					</Col>
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
