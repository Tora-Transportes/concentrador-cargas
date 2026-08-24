import React, { useState } from "react";
import "../style.css";
import { Container } from "react-bootstrap";
import TabelaCargas from "./tabela";
import { Button as ButtonReact } from "primereact/button";
import { BiCog } from "react-icons/bi";
import {
	HiOutlineAdjustments,
	HiOutlineClipboardList,
	HiOutlineUserGroup,
} from "react-icons/hi";
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
							<HiOutlineClipboardList />
						</div>
						<div className="ppa-page__hero-copy">
							<span className="ppa-page__eyebrow">Módulo PPA</span>
							<h1>Relatório de motoristas para bloqueio</h1>
							<p>
								Consulte o consolidado dos motoristas registrados para bloqueio,
								acompanhando a pontuação acumulada e a quantidade de ocorrências
								associadas a cada motorista.
							</p>
						</div>
					</div>

					<div
						id="total-reg"
						className="ppa-page__summary ppa-page__summary--blocked-report"
						aria-label="Total de motoristas encontrados"
					>
						<HiOutlineUserGroup aria-hidden="true" />
						<div>
							<span>Motoristas encontrados</span>
							<strong>{totalFormatted}</strong>
						</div>
					</div>
				</header>

				<section
					className="ppa-page__toolbar"
					aria-label="Filtros e opções do relatório"
				>
					<div className="ppa-page__toolbar-copy">
						<HiOutlineAdjustments aria-hidden="true" />
						<div>
							<strong>Filtros do relatório</strong>
							<span>
								Filtre por CPF ou motorista para localizar rapidamente os
								registros. Nas opções da tabela você também pode exportar e
								redefinir a visualização.
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
					aria-label="Resumo de bloqueios por motorista"
				>
					<div className="ppa-page__table-card-header">
						<div>
							<span className="ppa-page__table-card-eyebrow">Consolidado</span>
							<h2>Resumo de bloqueios por motorista</h2>
						</div>
						<span className="ppa-page__table-hint">
							Ordene pela pontuação total ou pelo número de bloqueios
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
