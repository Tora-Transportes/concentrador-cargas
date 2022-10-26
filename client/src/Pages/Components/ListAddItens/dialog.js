import { useFormik } from "formik";
import { Button } from "primereact/button";
import React from "react";
import { Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import InputLocalizacao from "../InputLocalizacao";

export const DetalhesDialogParadas = ({
	setVisibleDialog,
	formik,
	addItem,
}) => {
	const formikDialog = useFormik({
		initialValues: {
			peso: "",
			numeroCte: "",
			servico: "",
		},
	});

	const valuesFormDialog = async () => {
		addItem(formik.values, formikDialog.values);
		setVisibleDialog(false);
	};

	return (
		<Container fluid className="text-center mb-5 mt-4">
			<Row>
				<Col sm={12} md={6}>
					<FloatingLabel label="Digite o nome da cidade" className="mb-3">
						<>
							<InputLocalizacao
								keyDataList="parada_intemediaria"
								type="text"
								placeholder=" "
								name="parada_intemediaria"
								value={formik.values.parada_intemediaria}
								onChange={formik.handleChange}
							/>
						</>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Escolher o tipo de serviço" className="mb-3">
						<Form.Select
							placeholder="Serviço"
							value={formikDialog.values.servico}
							onChange={formikDialog.handleChange}
							name="servico"
						>
							<option></option>
							<option value="Coleta">Coleta</option>
							<option value="Entrega">Entrega</option>
						</Form.Select>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col sm={12} md={6}>
					<FloatingLabel label="Peso da carga" className="mb-3">
						<Form.Control
							type="text"
							name="peso"
							value={formikDialog.values.peso}
							onChange={formikDialog.handleChange}
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Número CTE" className="mb-3">
						<Form.Control
							type="text"
							name="numeroCte"
							value={formikDialog.values.numeroCte}
							onChange={formikDialog.handleChange}
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col className="text-end">
					<>
						<Button
							label="salvar"
							className="p-button-raised p-button-success p-button-text me-2"
							icon="pi pi-check"
							onClick={valuesFormDialog}
						/>
						<Button
							label="voltar"
							className="p-button-raised p-button-secondary p-button-text"
							icon="pi pi-times"
							onClick={() => setVisibleDialog(false)}
						/>
					</>
				</Col>
			</Row>
		</Container>
	);
};
