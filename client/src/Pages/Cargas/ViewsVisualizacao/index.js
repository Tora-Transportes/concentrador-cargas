import React, { useState } from "react";
import "./viewsVisualizacao.css";
import { Container, Row, Col } from "react-bootstrap";
import NavbarNavigator from "../../Components/NavbarNavigator";
import { Link } from "react-router-dom";
import chartImg from "../../../assets/chart.png";
import ModalLegendaCargas from "src/Pages/Cargas/modal/legendaCarga";
import TabelaCargas from "src/Pages/Components/TabelaCargas";
import { Button as ButtonReact } from "primereact/button";
import { BiCog } from "react-icons/bi";
import { Sidebar } from "primereact/sidebar";
import { SideBarFuncition } from "src/Pages/Components/TabelaCargas/layoutTable";

function VisualizarCargas({
	handleExportExcel,
	get_data,
	LoadingComponent,
	itensPerPage = 5,
	setItensPerPage,
	resetView,
	values,
	totalRegisters = null,
	tituloPag,
}) {
	const [modalShow, setModalShow] = useState(false);
	const [visibleLeft, setVisibleLeft] = useState(false);
	return (
		<>
			<LoadingComponent />
			<NavbarNavigator />
			<Container fluid className="text-center mb-5">
				<ModalLegendaCargas
					show={modalShow}
					onHide={() => setModalShow(false)}
				/>
				<Row className="mt-3 text-center">
					<Col>
						<h1 className="title-h1">{tituloPag}</h1>
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
				<Row className="row-inicio-carga mt-3 mb-2 ">
					<Col className="text-start">
						<ButtonReact
							label="Detales Tabela"
							icon={<BiCog className="me-2" />}
							onClick={() => setVisibleLeft(true)}
							className="sidebar-button-table"
						/>
					</Col>
					<Col sm={6} lg={6} className="inicio-col-registros">
						{totalRegisters && (
							<>
								Total de <b>{totalRegisters}</b> registros
							</>
						)}
					</Col>
					<Col></Col>
				</Row>
				<Row>
					<Sidebar
						visible={visibleLeft}
						onHide={() => setVisibleLeft(false)}
						style={{ width: "15em", height: "auto" }}
					>
						<SideBarFuncition
							itensPerPage={itensPerPage}
							setItensPerPage={setItensPerPage}
							setModalShow={setModalShow}
							setVisibleLeft={setVisibleLeft}
							handleExportExcel={handleExportExcel}
							resetView={resetView}
						/>
					</Sidebar>
					<Col sm={12}>
						<TabelaCargas
							get_data={get_data}
							values={values}
							handleExportExcel={handleExportExcel}
							resetView={resetView}
							setItensPerPage={setItensPerPage}
							itensPerPage={itensPerPage}
							setModalShow={setModalShow}
							paginaCargaLot={
								tituloPag === "Grid de Cargas em Lote" ? true : false
							}
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
