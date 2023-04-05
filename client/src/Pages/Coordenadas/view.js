import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TabelaCargas from "../Components/TabelaCargas";
import { Button as ButtonReact } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { BiCog } from "react-icons/bi";
import { ImQrcode } from "react-icons/im";
import { Dialog } from "primereact/dialog";
import bandeira from "../../assets/bandeiraBrasil.png";
import "../Coordenadas/coordenadas.css";
//import ModalDataExcel from "src/Pages/Cargas/modal/exportExcel";
import { SideBarFuncition } from "../Utils/sideBar";
import InfoCTEcard from "./cards/infoCTEcard";
import LastLocationVeicles from "./cards/lastLocation";

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
	//modalShowExcel,
	setModalShowExcel,
	viewsLastLocationObject,
	dadosLastLocation,
}) {
	const [visibleLeft, setVisibleLeft] = useState(false);
	const { visibleCardCte, setVisibleCardCte } = visibleCteCardObject;
	const { visibleLastLocation, setVisibleLastLocation } =
		viewsLastLocationObject;
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
			{/* <h4>Informações referente a placa </h4> */}
			<div className="row ms-1 row-placa">
				<div className=" col col-placa-header">
					<span className="text-light">BRASIL</span>
					<img src={bandeira} alt="caminhao verde" />
				</div>
				<div className=" col col-placa-body">
					<div className="col col-placa-body-qrCod">
						{" "}
						<ImQrcode />
						<p>BR</p>
					</div>

					<div className="col col-placa-body-numero">
						<span>{dataCTE?.placa}</span>
					</div>
				</div>
			</div>
		</div>
	);

	// const exportExcelDate = (dataInicio, dataFim, categoria_veiculo) => {
	// 	handleExportExcel(dataInicio, dataFim, categoria_veiculo);
	// 	setModalShowExcel(false);
	// };

	return (
		<>
			<Container fluid className="container-coord-veic">
				{/* <ModalDataExcel
					show={modalShowExcel}
					exportExcelDate={exportExcelDate}
					onHide={() => setModalShowExcel(false)}
					pagina={"coordenadas"}
				/> */}
				<Row className="mb-2">
					<h1 className="class-title-Coord" id="title-coorde">
						Coordenadas - Veículos
					</h1>
				</Row>
				<Row>
					<Col className="text-start">
						<ButtonReact
							id="botao-detalhe-tabela"
							label="Opções da Tabela"
							icon={<BiCog />}
							onClick={() => setVisibleLeft(true)}
						/>
					</Col>
					<Col
						sm={6}
						lg={6}
						className="inicio-col-registros"
						id="info-registros"
					>
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
					<Dialog
						className="dialog-localidade-title"
						header={"Dados da última localização"}
						visible={visibleLastLocation}
						onHide={() => onHide(setVisibleLastLocation)}
						closable={false}
					>
						<LastLocationVeicles
							placa={dadosLastLocation}
							setVisibleLastLocation={setVisibleLastLocation}
						/>
						<ButtonReact
							label="Voltar"
							onClick={() => setVisibleLastLocation(false)}
							className="dialog-btn-last-location"
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
							setModalShowExcel={setModalShowExcel}
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
