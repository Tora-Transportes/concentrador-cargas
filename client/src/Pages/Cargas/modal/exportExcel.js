import React, { useState, useRef } from "react";
import "./idiomaCalendario";
import "./modal.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Toast } from "primereact/toast";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { showToastMessage } from "src/Pages/Utils/toastMessage";
import FilialSelect from "src/Pages/Components/FilialSelect";
import diffiInDays from "src/Pages/Utils/diffInDays";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
export default function ModalExportExcel({
	onHide,
	show,
	exportExcelDate,
	pagina,
}) {
	const [dataInicio, setDataInicio] = useState();
	const [dataFim, setDataFim] = useState();
	const [codigoFilial, setCodigoFilial] = useState();
	const [categoria, setCategoria] = useState();
	const toast = useRef(null);

	const fieldRequered = pagina === "coordenadas" ? categoria : codigoFilial;
	const field =
		pagina === "coordenadas" ? "categoria veículo" : "codigo filial";

	const enviarDataExcel = () => {
		if (!dataInicio || !dataFim || !fieldRequered) {
			const message = `Data início, data fim e ${field} são campos obrigatórios!`;
			showToastMessage(toast, "warn", message, 7000);
		} else if (new Date(dataInicio) > new Date(dataFim)) {
			const message = "Data início deve ser maior ou igual a data fim!";
			showToastMessage(toast, "warn", message, 7000);
		} else if (diffiInDays(dataInicio, dataFim) > 31) {
			const message =
				"A diferença entre as datas início e fim não pode ser maior que 31 dias!";
			showToastMessage(toast, "warn", message, 7000);
		} else {
			exportExcelDate(
				dataInicio?.toISOString().split("T")[0],
				dataFim?.toISOString().split("T")[0],
				fieldRequered
			);
		}
	};
	const footer = (
		<div>
			<Button variant="success" onClick={enviarDataExcel}>
				Importar
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
				header="Importar excel por filtro de data:"
				visible={show}
				style={{ width: "50vw" }}
				footer={footer}
				onHide={onHide}
			>
				<Card className="text-center">
					<Card.Body className="card-body-excel">
						<Row className="row-main-excel">
							<Col md={12} className="col-card-excel-inicio">
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
							<Col md={12} className="col-card-excel-fim">
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
							{pagina === "coordenadas" ? (
								<Col sm={12} lg={12}>
									<FloatingLabel label="*Categoria" className="mb-3">
										<Form.Select
											placeholder="Categoria"
											value={categoria}
											onChange={(e) => setCategoria(e.target.value)}
											name="categoria"
										>
											<option></option>
											<option value="A">Agregado</option>
											<option value="C">Carreteiro</option>
											<option value="F">Frota</option>
										</Form.Select>
									</FloatingLabel>
								</Col>
							) : (
								<Col sm={12} lg={12}>
									<FloatingLabel label="*Código da filial" className="mb-3">
										<FilialSelect
											placeholder=" "
											name="fk_filial"
											value={codigoFilial || ""}
											onChange={(event) => setCodigoFilial(event.target.value)}
										/>
									</FloatingLabel>
								</Col>
							)}
						</Row>
					</Card.Body>
				</Card>
			</Dialog>
		</>
	);
}
