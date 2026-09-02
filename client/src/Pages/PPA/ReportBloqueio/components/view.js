import React, { useState } from "react";
import "../style.css";
import { Container } from "react-bootstrap";
import TabelaCargas from "./tabela";
import { Button as ButtonReact } from "primereact/button";
import { BiCog } from "react-icons/bi";
import { HiOutlineAdjustments, HiOutlineUserGroup } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import { SideBarFuncition } from "./tabela/sideBar";
import { Sidebar } from "primereact/sidebar";
import { STORAGE_COLUMNS_REPORTS_BLOQUEIO } from "../constants";

function ViewReport({
	columns = [],
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
	const totalFormatted = Number(totalRegisters || 0).toLocaleString("pt-BR");

	return (
		<main className="ppa-page ppa-blocked-report-page">
			<Container fluid className="ppa-page__container">
				<header id="title-monit" className="ppa-page__hero">
					<div className="ppa-page__hero-main">
						<div
							className="ppa-page__hero-icon ppa-page__hero-icon--blocked-report"
							aria-hidden="true"
						>
							<MdHistory />
						</div>
						<div className="ppa-page__hero-copy">
							<span className="ppa-page__eyebrow">Módulo PPA</span>
							<h1>Histórico de bloqueios de motoristas</h1>
							<p>
								Consulte o histórico consolidado dos bloqueios removidos no PPA,
								acompanhando o total de pontos e a quantidade de bloqueios já
								tratados para cada motorista.
							</p>
						</div>
					</div>

					<div
						id="total-reg"
						className="ppa-page__summary ppa-page__summary--blocked-report"
						aria-label="Total de motoristas no histórico"
					>
						<HiOutlineUserGroup aria-hidden="true" />
						<div>
							<span>Motoristas no histórico</span>
							<strong>{totalFormatted}</strong>
						</div>
					</div>
				</header>

				<section
					className="ppa-page__toolbar"
					aria-label="Filtros e opções do histórico"
				>
					<div className="ppa-page__toolbar-copy">
						<HiOutlineAdjustments aria-hidden="true" />
						<div>
							<strong>Filtros do histórico</strong>
							<span>
								Filtre por CPF ou motorista para consultar os bloqueios já
								removidos. Nas opções da tabela você também pode exportar o
								histórico e redefinir a visualização.
							</span>
						</div>
					</div>

					<ButtonReact
						label="Opções da tabela"
						icon={<BiCog />}
						className="ppa-page__options-button"
						onClick={() => setVisibleLeft(true)}
						aria-label="Abrir opções da tabela"
					/>
				</section>

				<Sidebar
					visible={visibleLeft}
					onHide={() => setVisibleLeft(false)}
					style={{ width: "20rem", height: "auto" }}
					className="ppa-table-sidebar"
					header="Opções da tabela"
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

				<section
					id="tabela-mon"
					className="ppa-page__table-card ppa-blocked-report__table-card"
					aria-label="Histórico consolidado de bloqueios removidos"
				>
					<div className="ppa-page__table-card-header">
						<div>
							<span className="ppa-page__table-card-eyebrow">Histórico</span>
							<h2>Bloqueios removidos por motorista</h2>
						</div>
						<span className="ppa-page__table-hint">
							Ordene pelos pontos removidos ou pela quantidade de bloqueios
						</span>
					</div>

					<TabelaCargas
						columns={columns}
						get_data={get_data}
						values={data}
						hideHeader={true}
						tipoDeBuscaPorPagina={STORAGE_COLUMNS_REPORTS_BLOQUEIO}
					/>
				</section>
			</Container>
		</main>
	);
}

export default ViewReport;
