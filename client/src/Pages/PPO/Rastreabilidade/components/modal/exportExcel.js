import React, { useState, useRef } from "react";
import "./idiomaCalendario";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Toast } from "primereact/toast";
import { Col, Row } from "react-bootstrap";
import { showToastMessage } from "src/Pages/Utils/toastMessage";
import diffiInDays from "src/Pages/Utils/diffInDays";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import "./style.css";

export default function ModalExportExcel({ onHide, show, exportExcelDate }) {
	const [dataInicio, setDataInicio] = useState();
	const [dataFim, setDataFim] = useState();
	const toast = useRef(null);

	const enviarDataExcel = () => {
		const dataI = dataInicio?.toISOString().split("T")[0].split("-");
		const dataF = dataFim?.toISOString().split("T")[0].split("-");

		if (!dataInicio || !dataFim) {
			const message = `Data início, data fim são campos obrigatórios!`;
			showToastMessage(toast, "warn", message, 7000);
		} else if (new Date(dataInicio) > new Date(dataFim)) {
			const message = "Data de início deve ser menor ou igual a data fim!";
			showToastMessage(toast, "warn", message, 7000);
		} else if (diffiInDays(dataInicio, dataFim) > 31) {
			const message =
				"O período entre a data de início e fim não pode ser maior que 31 dias!";
			showToastMessage(toast, "warn", message, 7000);
		} else if (dataI[0] != dataF[0] || dataI[1] != dataF[1]) {
			const message = "As datas deverão estar no mesmo mês e ano";
			showToastMessage(toast, "warn", message, 7000);
		} else {
			exportExcelDate(
				`${dataI[0]}-${dataI[1]}-${dataI[2]}`,
				`${dataF[0]}-${dataF[1]}-${dataF[2]}`
			);
		}
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
			<Toast ref={toast} className="w-25" position="top-center"></Toast>
			<Dialog
				header="Exportar excel por filtro de data:"
				visible={show}
				className="dialog-modal-import"
				footer={footer}
				onHide={onHide}
			>
				<Card className="text-center">
					<Card.Body className="card-body-excel">
						<Row className="row-main-excel">
							<Col
								lg={12}
								xs={12}
								sm={12}
								md={12}
								className="col-card-excel-inicio"
							>
								<Calendar
									className="calendar-data-inicio"
									dateFormat="dd/mm/yy"
									iconPos="left"
									monthNavigator
									placeholder="Data início"
									showIcon
									id="data-inicio"
									value={dataInicio || ""}
									onChange={(e) => {
										setDataInicio(e.target.value);
									}}
								/>
							</Col>
							<Col className="col-card-excel-fim">
								<Calendar
									className="calendar-data-fim"
									dateFormat="dd/mm/yy"
									type="search"
									placeholder="Data fim"
									showIcon
									id="data-fim"
									value={dataFim || ""}
									onChange={(e) => {
										setDataFim(e.target.value);
									}}
								/>
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</Dialog>
		</>
	);
}
