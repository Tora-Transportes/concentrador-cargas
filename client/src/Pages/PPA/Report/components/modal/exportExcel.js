import React, { useEffect, useRef, useState } from "react";
import "./idiomaCalendario";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Toast } from "primereact/toast";
import { Col, Row } from "react-bootstrap";
import { showToastMessage } from "src/Pages/Utils/toastMessage";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import "./style.css";

const formatDateForApi = (date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
};

export default function ModalExportExcel({ onHide, show, exportExcelDate }) {
	const [usarPeriodo, setUsarPeriodo] = useState(false);
	const [dataInicio, setDataInicio] = useState(null);
	const [dataFim, setDataFim] = useState(null);
	const toast = useRef(null);

	/*
	 * A cada nova abertura, a exportação começa sem filtro de período.
	 * O usuário pode habilitar o intervalo apenas quando desejar.
	 */
	useEffect(() => {
		if (show) {
			setUsarPeriodo(false);
			setDataInicio(null);
			setDataFim(null);
		}
	}, [show]);

	const handlePeriodoChange = (event) => {
		const checked = event.target.checked;
		setUsarPeriodo(checked);

		if (!checked) {
			setDataInicio(null);
			setDataFim(null);
		}
	};

	const enviarDataExcel = () => {
		/*
		 * Sem período selecionado, exporta todos os registros que atendem
		 * aos demais filtros atualmente aplicados na tabela.
		 */
		if (!usarPeriodo) {
			exportExcelDate(undefined, undefined);
			return;
		}

		if (!dataInicio || !dataFim) {
			showToastMessage(
				toast,
				"warn",
				"Ao filtrar por período, selecione a data inicial e a data final!",
				7000
			);
			return;
		}

		if (dataInicio.getTime() > dataFim.getTime()) {
			showToastMessage(
				toast,
				"warn",
				"A data inicial não pode ser maior que a data final!",
				7000
			);
			return;
		}

		/*
		 * Diferente do modal do PPO, aqui enviamos as duas datas completas.
		 * Usamos os componentes da data local em vez de toISOString() para
		 * preservar exatamente o dia selecionado pelo usuário no calendário.
		 */
		exportExcelDate(formatDateForApi(dataInicio), formatDateForApi(dataFim));
	};

	const footer = (
		<div>
			<Button className="button-export-excel" onClick={enviarDataExcel}>
				Exportar
			</Button>
			<Button variant="secondary" onClick={onHide}>
				Sair
			</Button>
		</div>
	);

	return (
		<>
			<Toast ref={toast} className="w-25" position="top-center" />
			<Dialog
				header="Exportar relatório"
				visible={show}
				className="dialog-modal-import"
				footer={footer}
				onHide={onHide}
			>
				<Card className="text-center">
					<Card.Body className="card-body-excel">
						<div className="ppa-export-period-option">
							<div className="ppa-export-period-option__copy">
								<strong>Deseja limitar a exportação por período?</strong>
								<span>
									Essa opção é opcional. Sem selecionar um período, serão
									exportados todos os registros que atendem aos filtros atuais
									da tabela.
								</span>
							</div>

							<label className="ppa-export-period-switch">
								<input
									type="checkbox"
									checked={usarPeriodo}
									onChange={handlePeriodoChange}
									aria-label="Limitar exportação por período"
								/>
								<span className="ppa-export-period-switch__slider" />
							</label>
						</div>

						{usarPeriodo && (
							<div className="ppa-export-period-fields">
								<Row className="row-main-excel">
									<Col
										lg={6}
										xs={12}
										sm={12}
										md={6}
										className="col-card-excel-inicio"
									>
										<label
											htmlFor="ppa-export-data-inicio"
											className="ppa-export-date-label"
										>
											Data inicial
										</label>
										<Calendar
											className="calendar-data-inicio"
											dateFormat="dd/mm/yy"
											iconPos="left"
											monthNavigator
											placeholder="Selecione a data inicial"
											showIcon
											showButtonBar
											id="ppa-export-data-inicio"
											value={dataInicio}
											maxDate={dataFim || undefined}
											onChange={(e) => setDataInicio(e.value)}
										/>
									</Col>

									<Col
										lg={6}
										xs={12}
										sm={12}
										md={6}
										className="col-card-excel-fim"
									>
										<label
											htmlFor="ppa-export-data-fim"
											className="ppa-export-date-label"
										>
											Data final
										</label>
										<Calendar
											className="calendar-data-fim"
											dateFormat="dd/mm/yy"
											placeholder="Selecione a data final"
											showIcon
											showButtonBar
											id="ppa-export-data-fim"
											value={dataFim}
											minDate={dataInicio || undefined}
											onChange={(e) => setDataFim(e.value)}
										/>
									</Col>
								</Row>

								<small className="ppa-export-period-hint">
									Serão exportados os registros cuja data de inclusão esteja
									entre as datas selecionadas, incluindo todo o dia inicial e
									todo o dia final.
								</small>
							</div>
						)}
					</Card.Body>
				</Card>
			</Dialog>
		</>
	);
}
