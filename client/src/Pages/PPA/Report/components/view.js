import React, { useState } from "react";
import "../style.css";
import { Container } from "react-bootstrap";
import TabelaCargas from "../components/tabela";
import { Button as ButtonReact } from "primereact/button";
import { BiCog } from "react-icons/bi";
import {
	HiOutlineAdjustments,
	HiOutlineChartBar,
	HiOutlineDatabase,
} from "react-icons/hi";
import { SideBarFuncition } from "../components/tabela/sideBar";
import { Sidebar } from "primereact/sidebar";
import { STORAGE_COLUMNS_REPORTS } from "../constants";

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
		<main className="ppa-page">
			<Container fluid className="ppa-page__container">
				<header className="ppa-page__hero">
					<div className="ppa-page__hero-main">
						<div className="ppa-page__hero-icon" aria-hidden="true">
							<HiOutlineChartBar />
						</div>
						<div className="ppa-page__hero-copy">
							<span className="ppa-page__eyebrow">Módulo PPA</span>
							<h1>Relatório de motoristas</h1>
							<p>
								Consulte os eventos de velocidade, aplique filtros e acompanhe a
								pontuação registrada para cada motorista.
							</p>
						</div>
					</div>

					<div className="ppa-page__summary" aria-label="Total de registros">
						<HiOutlineDatabase aria-hidden="true" />
						<div>
							<span>Registros encontrados</span>
							<strong>{totalFormatted}</strong>
						</div>
					</div>
				</header>

				<section className="ppa-page__toolbar" aria-label="Opções da tabela">
					<div className="ppa-page__toolbar-copy">
						<HiOutlineAdjustments aria-hidden="true" />
						<div>
							<strong>Filtros e visualização</strong>
							<span>
								Use os campos abaixo para refinar os resultados. As opções da
								tabela permitem exportar, redefinir e ajustar a paginação.
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
					className="ppa-page__table-card"
					aria-label="Resultados do relatório"
				>
					<div className="ppa-page__table-card-header">
						<div>
							<span className="ppa-page__table-card-eyebrow">Consulta</span>
							<h2>Eventos registrados</h2>
						</div>
						<span className="ppa-page__table-hint">
							Ordene pelas colunas com o ícone de setas
						</span>
					</div>

					<TabelaCargas
						id="tabela-mon"
						columns={columns}
						get_data={get_data}
						values={data}
						hideHeader={true}
						tipoDeBuscaPorPagina={STORAGE_COLUMNS_REPORTS}
					/>
				</section>
			</Container>
		</main>
	);
}

export default ViewReport;
