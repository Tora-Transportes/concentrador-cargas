import React, { useState, useRef } from "react";
import "./idiomaCalendario";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Toast } from "primereact/toast";
import { showToastMessage } from "src/Pages/Utils/toastMessage";
import diffiInDays from "src/Pages/Utils/diffInDays";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import "./modal.css";
import { Col, Row } from "react-bootstrap";

export default function ModalFiltroDataViewCarga({
	onHide,
	show,
	isCamposFilter,
	get_data,
	refValueFiltroDate,
}) {
	const [dataInicio, setDataInicio] = useState();
	const [dataFim, setDataFim] = useState();
	const toast = useRef(null);

	const filtrarPorData = async () => {
		if (!dataInicio || !dataFim) {
			const message = `Data início, data fim são campos obrigatórios!`;
			showToastMessage(toast, "warn", message, 7000);
		} else if (new Date(dataInicio) > new Date(dataFim)) {
			const message = "Data de início deve ser menor ou igual a data fim!";
			showToastMessage(toast, "warn", message, 7000);
		} else if (diffiInDays(dataInicio, dataFim) > 30) {
			const message =
				"O período entre a data de início e fim não pode ser maior que 30 dias!";
			showToastMessage(toast, "warn", message, 7000);
		} else {
			const dataFilter = {
				...isCamposFilter,
				countGetRota: 2,
				filters: {
					...isCamposFilter.filters,
					busca_inicio: dataInicio,
					busca_fim: dataFim,
				},
			};
			await get_data(dataFilter);
			onHide();
		}
	};

	const clearfilter = async () => {
		setDataInicio("");
		setDataFim("");
		refValueFiltroDate.current = null;
		const options = {
			filters: {},
			orderBy: {
				column: "",
				direction: "asc",
			},
			page: 1,
		};
		await get_data(options);
	};
	const footer = (
		<div>
			<Button className="button-filtrar" onClick={filtrarPorData}>
				Filtrar
			</Button>
			<Button className="button-clear-filter" onClick={clearfilter}>
				Limpar Filtro
			</Button>
			<Button className="button-sair" variant="secondary" onClick={onHide}>
				Sair
			</Button>
		</div>
	);
	return (
		<>
			<Toast ref={toast} className="w-25" position="top-center"></Toast>
			<Dialog
				header="Filtrar os dados por data de cadastro:"
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
