import React, { useState } from "react";
import "../style.css";
import { Container, Row, Col } from "react-bootstrap";
import TabelaCargas from "../components/tabela";
import { Button as ButtonReact } from "primereact/button";
import { BiCog } from "react-icons/bi";
import ModalDataExcel from "../components/modal/exportExcel";
import { SideBarFuncition } from "../components/tabela/sideBar";
import { Sidebar } from "primereact/sidebar";
import { STORAGE_COLUMNS_RELATORIO_MOTORISTAS } from "../constants";
// import HandleClick from "./tooltipsMonitoramento";

function ViewRelatorioMotorista({
	columns = [],
	get_data,
	data,
	totalRegisters = 0,
	itensPerPage = 10,
	setItensPerPage,
	resetView,
	modalShowExcel,
	setModalShowExcel,
	handleExportExcel,
}) {
	const [visibleLeft, setVisibleLeft] = useState(false);

	const exportExcelDate = (mes, ano) => {
		handleExportExcel(mes, ano);
		setModalShowExcel(false);
	};

	return (
		<div className="class-body-gridcarga">
			<Container fluid className="text-center">
				<ModalDataExcel
					show={modalShowExcel}
					exportExcelDate={exportExcelDate}
					onHide={() => setModalShowExcel(false)}
				/>
				<Row className="mt-3 text-center">
					<Col>
						<h1 id="title-cargas-lote">Relatórios Motoristas PPO</h1>
					</Col>
				</Row>
				<Row className="row-listagem-padrao">
					<div className="col-registros">
						{totalRegisters && (
							<>
								Total de <b>{totalRegisters}</b> registros
							</>
						)}
					</div>
					<div className="opcao-tabela-padrao">
						<ButtonReact
							label="Opções da Tabela"
							id="button-opcoes-tabela"
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
							setVisibleLeft={setVisibleLeft}
							handleExportExcel={handleExportExcel}
							resetView={resetView}
						/>
					</Sidebar>
					<TabelaCargas
						id="tabela-mon"
						columns={columns}
						get_data={get_data}
						values={data}
						hideHeader={true}
						ipoDeBuscaPorPagina={STORAGE_COLUMNS_RELATORIO_MOTORISTAS}
					/>
				</Row>
			</Container>
		</div>
	);
}

export default ViewRelatorioMotorista;
