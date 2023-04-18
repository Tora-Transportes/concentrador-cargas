import React, { useState } from "react";
import "./../VisualizacaoCsn.css";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import chartImg from "./../../../../assets/chart.png";
import ModalLegendaCargas from "src/Pages/Cargas/modal/legendaCarga";
import ModalDataExcel from "src/Pages/Cargas/modal/exportExcel";
import TabelaCargas from "src/Pages/Components/TabelaCargas";
import { Button as ButtonReact } from "primereact/button";
import { BiCog } from "react-icons/bi";
import { Sidebar } from "primereact/sidebar";
import { columns } from "./ColumsTableCsn";
import { SideBarFuncition } from "src/Pages/Utils/sideBar";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";

function ViewsCsn({
	handleExportExcel,
	get_data,
	LoadingComponent,
	itensPerPage = 10,
	setItensPerPage,
	resetView,
	values,
	totalRegisters = null,
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
		<div className="class-cargas-csn">
			<LoadingComponent />
			<Menusuperior />
			<Container fluid className="text-center mb-5">
				<ModalLegendaCargas
					show={modalShow}
					onHide={() => setModalShow(false)}
					csn={"csn"}
				/>
				<ModalDataExcel
					show={modalShowExcel}
					exportExcelDate={exportExcelDate}
					onHide={() => setModalShowExcel(false)}
				/>
				<Row className=" text-center">
					<Col>
						<h1 className="title-cargas-csn">{"Listagem de Cargas CSN"}</h1>
					</Col>

					<Link target="_blank" to="/relatorios/visualizar/csn">
						<img className="img-cargas-lote" src={chartImg} />
					</Link>
				</Row>
				<Row className="row-registros-csn mb-2 ">
					<div className="inicio-col-registros">
						{totalRegisters && (
							<>
								Total de <b>{totalRegisters}</b> registros
							</>
						)}
					</div>
					<div className="text-start opcao-tabela-csn">
						<ButtonReact
							label="Opções da Tabela"
							id="style-opcao-tabela-csn"
							icon={<BiCog />}
							onClick={() => setVisibleLeft(true)}
						/>
					</div>
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
							tipoDeBuscaPorPagina={"table-columns-csn"}
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

export default ViewsCsn;
