import React, { useState } from "react";
import "./viewsVisualizacao.css";
import { Container, Row, Col } from "react-bootstrap";
// import NavbarNavigator from "../../Components/NavbarNavigator";
import { Link } from "react-router-dom";
import chartImg from "../../../assets/chart.png";
import ModalLegendaCargas from "src/Pages/Cargas/modal/legendaCarga";
import ModalDataExcel from "src/Pages/Cargas/modal/exportExcel";
import TabelaCargas from "src/Pages/Components/TabelaCargas";
import { Button as ButtonReact } from "primereact/button";
import { BiCog } from "react-icons/bi";
import { Sidebar } from "primereact/sidebar";
import { columns } from "../CollumnsTables/ColumnsTemplate";
import { SideBarFuncition } from "src/Pages/Utils/sideBar";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";

function VisualizarCargas({
	handleExportExcel,
	get_data,
	LoadingComponent,
	itensPerPage = 10,
	setItensPerPage,
	resetView,
	values,
	totalRegisters = null,
	tituloPag,
	modalShowExcel,
	setModalShowExcel,
}) {
	const [modalShow, setModalShow] = useState(false);
	const [visibleLeft, setVisibleLeft] = useState(false);

	const exportExcelDate = (dataInicio, dataFim, codigoFilial) => {
		handleExportExcel(dataInicio, dataFim, codigoFilial);
		setModalShowExcel(false);
	};

	return (
		<div className="class-body-gridcarga">
			<LoadingComponent />
			<Menusuperior />
			<Container fluid className="text-center mb-5">
				<ModalLegendaCargas
					show={modalShow}
					onHide={() => setModalShow(false)}
				/>
				<ModalDataExcel
					show={modalShowExcel}
					exportExcelDate={exportExcelDate}
					onHide={() => setModalShowExcel(false)}
				/>
				<Row className="mt-3 text-center">
					<Col>
						<h1 id="title-h1">{tituloPag}</h1>
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
							label="Detalhes Tabela"
							id="style-button-detail"
							icon={<BiCog className="me-1" />}
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
							setModalShowExcel={setModalShowExcel}
							setModalDataExcel={setModalShowExcel}
							setModalShow={setModalShow}
							setVisibleLeft={setVisibleLeft}
							handleExportExcel={handleExportExcel}
							resetView={resetView}
						/>
					</Sidebar>
					<Col sm={12}>
						<TabelaCargas
							columns={columns}
							get_data={get_data}
							values={values}
							handleExportExcel={handleExportExcel}
							resetView={resetView}
							setItensPerPage={setItensPerPage}
							itensPerPage={itensPerPage}
							setModalShow={setModalShow}
							setModalShowExcel={setModalShowExcel}
							tipoDeBuscaPorPagina={
								tituloPag === "Listagem de Cargas em Lote"
									? "table-columns-lote"
									: "table-columns"
							}
						/>
					</Col>
				</Row>
				<Row>
					<Col sm={12}></Col>
				</Row>
			</Container>
		</div>
	);
}

export default VisualizarCargas;
