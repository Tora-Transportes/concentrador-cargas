import React, { useState } from "react";
import "../style.css";
import { Container, Row, Col } from "react-bootstrap";
import TabelaCargas from "../components/tabela";
import { Button as ButtonReact } from "primereact/button";
import { BiCog } from "react-icons/bi";
import { SideBarFuncition } from "../components/tabela/sideBar";
import { Sidebar } from "primereact/sidebar";
import { IoMdAddCircleOutline } from "react-icons/io";

function ViewEmpresas({
	handleOpen,
	get_data,
	data,
	totalRegisters = 0,
	itensPerPage = 10,
	setItensPerPage,
	resetView,
	setModalShowExcel,
	handleExportExcel,
}) {
	const [visibleLeft, setVisibleLeft] = useState(false);

	return (
		<div className="class-body-gridcarga">
			<Container fluid className="text-center">
				<Row className="mt-3 text-center">
					<Col>
						<h1 id="title-cargas-lote">Empresas</h1>
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
					<Row>
						<div className="opcao-tabela-padrao">
							<ButtonReact
								label="Opções da Tabela"
								id="button-opcoes-tabela"
								icon={<BiCog />}
								onClick={() => setVisibleLeft(true)}
							/>
						</div>
						<div className="adicionar-empresa">
							<ButtonReact
								label="Adicionar"
								id="button-opcoes-tabela"
								icon={<IoMdAddCircleOutline />}
								onClick={handleOpen}
							/>
						</div>
					</Row>
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
						get_data={get_data}
						values={data}
						hideHeader={true}
						resetView={resetView}
						setItensPerPage={setItensPerPage}
						itensPerPage={itensPerPage}
					/>
				</Row>
			</Container>
		</div>
	);
}

export default ViewEmpresas;
