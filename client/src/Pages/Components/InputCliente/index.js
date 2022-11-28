import React, { useState, useEffect, useRef } from "react";
import {
	Form,
	Modal,
	Button,
	ListGroup,
	FloatingLabel,
	Row,
	Col,
} from "react-bootstrap";
import { useFormik } from "formik";
import ServiceRecomendacoes from "../../../services/ServiceRecomendacoes";
import swal from "sweetalert";

function InputCliente({ onChange, label, status, formikMain, ...props }) {
	const [recomendacoes, setRecomendacoes] = useState([]);
	const input = useRef(null);
	const formik = useFormik({
		initialValues: {
			show: false,
			cnpj: "",
			cidade: "",
			uf: "",
			nome: "",
		},
	});

	function selectValue(value) {
		const event = { target: input.current };
		if (typeof onChange === "function") {
			if (value === null) {
				input.current.value = "";
			} else {
				input.current.value = `${value.organizacao} - ${value.documento_federal} - ${value.cidade}/${value.uf}`;
			}
			formik.setFieldValue("show", false);
			if (status) {
				if (value?.latitude === null || value?.longitude === null) {
					swal(
						"Ops!",
						`Por favor atualize os dados do cliente no SIT para continuar.`,
						"warning"
					);
				} else {
					formikMain.setFieldValue(
						`ponto_passagem${status}.latitude`,
						value?.latitude
					);
					formikMain.setFieldValue(
						`ponto_passagem${status}.longitude`,
						value.longitude
					);
					onChange(event);
				}
			} else {
				onChange(event);
			}
		}
	}

	useEffect(() => {
		if (formik.values.show) {
			const run = async function () {
				setRecomendacoes(
					(await ServiceRecomendacoes.organizacoes(formik.values)).data.data
				);
			};
			run();
		}
	}, [formik.values]);

	return (
		<>
			<FloatingLabel
				label={label !== undefined || "*Informe um Cliente"}
				className="mb-3"
			>
				<Form.Control
					{...props}
					onFocus={() => formik.setFieldValue("show", true)}
					onChange={() => formik.setFieldValue("show", true)}
					ref={input}
				/>
			</FloatingLabel>

			{formik.values.show && (
				<Modal
					show={formik.values.show}
					onHide={() => formik.setFieldValue("show", false)}
					size="lg"
				>
					<Modal.Header closeButton>
						<Modal.Title>Filtro Cliente</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Row>
							<Col sm={12} md={6}>
								<FloatingLabel label="Nome cliente" className="mb-3">
									<Form.Control
										type="text"
										name="nome"
										value={formik.values.nome}
										onChange={formik.handleChange}
									/>
								</FloatingLabel>
							</Col>
							<Col>
								<FloatingLabel label="CNPJ" className="mb-3">
									<Form.Control
										type="text"
										name="cnpj"
										value={formik.values.cnpj}
										onChange={formik.handleChange}
									/>
								</FloatingLabel>
							</Col>
						</Row>
						<Row>
							<Col>
								<FloatingLabel label="UF" className="mb-3">
									<Form.Select
										name="uf"
										value={formik.values.uf}
										onChange={formik.handleChange}
									>
										<option value=""></option>
										<option value="MG">MG</option>
										<option value="RJ">RJ</option>
										<option value="RN">RN</option>
										<option value="AL">AL</option>
										<option value="ES">ES</option>
										<option value="PR">PR</option>
										<option value="RS">RS</option>
										<option value="SP">SP</option>
										<option value="AC">AC</option>
										<option value="AM">AM</option>
										<option value="MA">MA</option>
										<option value="PB">PB</option>
										<option value="PE">PE</option>
										<option value="RR">RR</option>
										<option value="SE">SE</option>
										<option value="AP">AP</option>
										<option value="BA">BA</option>
										<option value="CE">CE</option>
										<option value="DF">DF</option>
										<option value="GO">GO</option>
										<option value="MT">MT</option>
										<option value="RO">RO</option>
										<option value="SC">SC</option>
										<option value="MS">MS</option>
										<option value="PI">PI</option>
										<option value="TO">TO</option>
										<option value="PA">PA</option>
										<option value="NC">NC</option>
									</Form.Select>
								</FloatingLabel>
							</Col>
							<Col>
								<FloatingLabel label="Cidade" className="mb-3">
									<Form.Control
										type="text"
										name="cidade"
										value={formik.values.cidade}
										onChange={formik.handleChange}
									/>
								</FloatingLabel>
							</Col>
						</Row>
						<Row>
							<Col>
								<Button onClick={() => selectValue(null)}>
									Limpar Seleção
								</Button>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Body>
						<ListGroup>
							{recomendacoes?.map((i) => (
								<ListGroup.Item key={i.documento_federal}>
									<Button onClick={() => selectValue(i)} className="w-100">
										{i.organizacao} - {i.cidade}/{i.uf} - {i.documento_federal}
									</Button>
								</ListGroup.Item>
							))}
						</ListGroup>
					</Modal.Body>
					<Modal.Footer></Modal.Footer>
				</Modal>
			)}
		</>
	);
}

export default InputCliente;
