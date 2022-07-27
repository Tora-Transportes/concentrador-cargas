import React, { useState } from "react";
import "./visualizaLote.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import NavbarNavigator from "../../Components/NavbarNavigator";
import TabelaCargas from "../../Components/TabelaCargas";
import { Link } from "react-router-dom";
import chartImg from "../../../assets/chart.png";
import ModalLegendaCargas from "src/Pages/Cargas/modal/legendaCarga";
import { AiFillFileExcel } from "react-icons/ai";

function VisualizarCargas({
	handleExportExcel,
	get_data,
	columns,
	LoadingComponent,
	displayColumns = [],
	dispatchColumns,
	itensPerPage = 5,
	setItensPerPage,
	resetView,
	cargas,
	totalRegisters = null,
}) {
	const [modalShow, setModalShow] = useState(false);
	return (
		<>
			<LoadingComponent />
			<NavbarNavigator />
			<Container fluid className="text-center mb-5">
				<ModalLegendaCargas
					show={modalShow}
					onHide={() => setModalShow(false)}
				/>
				<Row className="mt-3 text-center row-title">
					<Col>
						<h1 className="title-h1">Grid de Cargas em Lote</h1>
					</Col>

					<Link target="_blank" to="/relatorios">
						<img
							src={chartImg}
							style={{
								width: "80px",
								position: "absolute",
								right: "10px",
								top: "80px",
							}}
						/>
					</Link>
				</Row>
				<Row className="row-inicio-carga mt-5 mb-2 ">
					<Col className=" inicio-col-legenda text-start">
						<Button variant="secondary" onClick={() => setModalShow(true)}>
							Legenda situações de carga
						</Button>
					</Col>
					<Col sm={6} className="inicio-col-registros">
						{totalRegisters && (
							<>
								Total de <b>{totalRegisters}</b> registros
							</>
						)}
					</Col>
					<Col className="text-end">
						<Button variant="success" onClick={handleExportExcel}>
							<AiFillFileExcel /> Exportar Excel
						</Button>
					</Col>
				</Row>
				<Row>
					<Col sm={12}>
						<TabelaCargas
							columns={columns.filter((i) =>
								displayColumns.find((c) => c.field === i.field)
							)}
							get_data={get_data}
							values={cargas}
							handleExportExcel={handleExportExcel}
							dispatchColumns={dispatchColumns}
							resetView={resetView}
							setItensPerPage={setItensPerPage}
							itensPerPage={itensPerPage}
						/>
					</Col>
				</Row>
				<Row>
					<Col sm={12}></Col>
				</Row>
			</Container>
		</>
	);
}

export default VisualizarCargas;
