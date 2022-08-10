import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TabelaCargas from "../Components/TabelaCargas";
import { Button as ButtonReact } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { BiCog } from "react-icons/bi";
import { Dialog } from "primereact/dialog";
import { SideBarFuncition } from "../Components/TabelaCargas/layoutTable";
import InfoCTEcard from "./infoCTEcard";

function ViewCoordenadas({
	columns,
	get_data,
	data,
	handleExportExcel,
	totalRegisters = 0,
	resetView,
	itensPerPage,
	setItensPerPage,
	visibleCteCardObject,
	dadosCTEObjet,
}) {
	const [visibleLeft, setVisibleLeft] = useState(false);
	const { visibleCardCte, setVisibleCardCte } = visibleCteCardObject;
	const { dataCTE } = dadosCTEObjet;
	React.useEffect(() => {
		const interval = setTimeout(() => {
			window.scrollTo(0, 10000);
		}, 1000);

		return () => clearInterval(interval);
	});

	const onHide = (stateMethod) => {
		stateMethod(false);
	};

	const headerDialog = (
		<div className="header-dialog">
			<h4>
				Informações referente a placa <strong>{dataCTE?.placa}</strong>
			</h4>
		</div>
	);
	return (
		<>
			<Container fluid className="text-center mb-5 mt-4">
				<Row className="mb-2">
					<h1 className="title-h1">Coordenadas - Veículos</h1>
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
					<Dialog
						className="dialog-cte"
						header={headerDialog}
						visible={visibleCardCte}
						onHide={() => onHide(setVisibleCardCte)}
						closable={true}
					>
						<InfoCTEcard
							rowInfoPlaca={dataCTE}
							setVisibleCardCte={setVisibleCardCte}
						/>

						<ButtonReact
							label="Voltar"
							onClick={() => setVisibleCardCte(false)}
							className="dialog-btn-voltar"
						/>
					</Dialog>
					<Sidebar
						visible={visibleLeft}
						onHide={() => setVisibleLeft(false)}
						className="sidebar-detales-tarefa"
					>
						<SideBarFuncition
							itensPerPage={itensPerPage}
							setItensPerPage={setItensPerPage}
							setVisibleLeft={setVisibleLeft}
							handleExportExcel={handleExportExcel}
							resetView={resetView}
						/>
					</Sidebar>
					<TabelaCargas
						columns={columns}
						get_data={get_data}
						values={data}
						responsive={false}
						setItensPerPage={setItensPerPage}
						itensPerPage={itensPerPage}
						tipoDeBuscaPorPagina="coordenadas-table"
					/>
				</Row>
			</Container>
		</>
	);
}

export default ViewCoordenadas;
