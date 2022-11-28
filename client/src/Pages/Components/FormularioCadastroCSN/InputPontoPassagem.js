import React, { useEffect, useState } from "react";
import "./formularioCadastroCSN.css";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";
import RotasSelect from "../FilialSelect/rotasSelect";
import InputCliente from "../InputCliente";

const InputsPontoPassagem = ({
	formik,
	inputColeta5,
	inputColeta6,
	inputColeta7,
	inputColeta8,
	inputColeta9,
	inputColeta10,
	inputColeta11,
	inputColeta12,
}) => {
	const [inputPontoPassagem5, setInputPontoPassagem5] = useState(true);
	const [inputPontoPassagem6, setInputPontoPassagem6] = useState(true);
	const [inputPontoPassagem7, setInputPontoPassagem7] = useState(true);
	const [inputPontoPassagem8, setInputPontoPassagem8] = useState(true);
	const [inputPontoPassagem9, setInputPontoPassagem9] = useState(true);
	const [inputPontoPassagem10, setInputPontoPassagem10] = useState(true);
	const [inputPontoPassagem11, setInputPontoPassagem11] = useState(true);
	const [inputPontoPassagem12, setInputPontoPassagem12] = useState(true);
	useEffect(() => {
		if (formik.values.ponto_passagem5.tipoServico === "Entrega") {
			setInputPontoPassagem5(false);
		} else {
			setInputPontoPassagem5(true);
		}
		if (formik.values.ponto_passagem6.tipoServico === "Entrega") {
			setInputPontoPassagem6(false);
		} else {
			setInputPontoPassagem6(true);
		}
		if (formik.values.ponto_passagem7.tipoServico === "Entrega") {
			setInputPontoPassagem7(false);
		} else {
			setInputPontoPassagem7(true);
		}
		if (formik.values.ponto_passagem8.tipoServico === "Entrega") {
			setInputPontoPassagem8(false);
		} else {
			setInputPontoPassagem8(true);
		}
		if (formik.values.ponto_passagem9.tipoServico === "Entrega") {
			setInputPontoPassagem9(false);
		} else {
			setInputPontoPassagem9(true);
		}
		if (formik.values.ponto_passagem10.tipoServico === "Entrega") {
			setInputPontoPassagem10(false);
		} else {
			setInputPontoPassagem10(true);
		}
		if (formik.values.ponto_passagem11.tipoServico === "Entrega") {
			setInputPontoPassagem11(false);
		} else {
			setInputPontoPassagem11(true);
		}
		if (formik.values.ponto_passagem12.tipoServico === "Entrega") {
			setInputPontoPassagem12(false);
		} else {
			setInputPontoPassagem12(true);
		}
	}, [formik.values]);
	return (
		<>
			<Row className="row-input-coleta">
				<Col sm={12} md={6}>
					<FloatingLabel label="*Ponto de passagem" className="mb-3">
						<Form.Control
							className="input-pontoPassagem-disabled"
							type="text"
							name="ponto_passagem.ponto"
							value={formik.values.ponto_passagem.ponto}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Coleta/Entrega" className="mb-3">
						<Form.Control
							className="input-pontoPassagem-disabled"
							type="text"
							disabled
							name="ponto_passagem.tipoServico"
							value={formik.values.ponto_passagem.tipoServico}
							onChange={formik.handleChange}
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="*Previsão" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem.previsao"
							value={formik.values.ponto_passagem.previsao}
							onChange={formik.handleChange}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>

			<Row className="row-input-coleta">
				<Col sm={12} md={6}>
					<FloatingLabel label="Ponto de passagem2" className="mb-3">
						<Form.Control
							//id="campo-aut"
							className="input-pontoPassagem-disabled"
							type="text"
							name="ponto_passagem2.ponto"
							value={formik.values.ponto_passagem2.ponto?.split("-")[1]}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Coleta/Entrega 2" className="mb-3">
						<Form.Control
							className="input-pontoPassagem-disabled"
							type="text"
							disabled
							name="ponto_passagem2.tipoServico"
							value={formik.values.ponto_passagem2.tipoServico}
							onChange={formik.handleChange}
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Previsão 2" className="mb-3">
						<Form.Control
							type="datetime-local"
							name="ponto_passagem2.previsao"
							value={formik.values.ponto_passagem2.previsao}
							onChange={formik.handleChange}
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row className="row-input-coleta">
				<Col sm={12} md={6}>
					<FloatingLabel label="Ponto de passagem3" className="mb-3">
						<Form.Control
							className="input-pontoPassagem-disabled"
							type="text"
							name="ponto_passagem3.ponto"
							value={formik.values.ponto_passagem3.ponto?.split("-")[1]}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Coleta/Entrega 3" className="mb-3">
						<Form.Control
							className="input-pontoPassagem-disabled"
							type="text"
							disabled
							name="ponto_passagem3.tipoServico"
							value={formik.values.ponto_passagem3.tipoServico}
							onChange={formik.handleChange}
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Previsão 3" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem3.previsao"
							value={formik.values.ponto_passagem3.previsao}
							onChange={formik.handleChange}
						/>
					</FloatingLabel>
				</Col>
			</Row>

			<Row className="row-input-coleta">
				<Col sm={12} md={6}>
					<InputCliente
						type="text"
						placeholder=" "
						name="ponto_passagem4.client"
						value={formik.values.ponto_passagem4.client}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						formikMain={formik}
						status={4}
						required
					/>
				</Col>
				<Col>
					<FloatingLabel label="Coleta/Entrega 4" className="mb-3">
						<Form.Control
							className="input-pontoPassagem-disabled"
							type="text"
							disabled
							name="ponto_passagem4.tipoServico"
							value={formik.values.ponto_passagem4.tipoServico}
							onChange={formik.handleChange}
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="*Previsão 4" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem4.previsao"
							value={formik.values.ponto_passagem4.previsao}
							onChange={formik.handleChange}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>

			{inputColeta5 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem5 ? (
						<Col sm={12} md={6} className="col-cod-local">
							<label>Ponto de passagem 5</label>
							<RotasSelect
								className="input-cod-local"
								name="ponto_passagem5.ponto"
								value={formik.values.ponto_passagem5.ponto}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							/>
						</Col>
					) : (
						<Col sm={12} md={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem5.client"
								value={formik.values.ponto_passagem5.client}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={5}
								required
							/>
						</Col>
					)}
					<Col>
						<FloatingLabel label="Coleta/Entrega 5" className="mb-3">
							<Form.Select
								name="ponto_passagem5.tipoServico"
								value={formik.values.ponto_passagem5.tipoServico}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							>
								<option value=""></option>
								<option value="Coleta">Coleta</option>
								<option value="Entrega">Entrega</option>
							</Form.Select>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="Previsão 5" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem5.previsao"
								value={formik.values.ponto_passagem5.previsao}
								onChange={formik.handleChange}
								required
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
			{inputColeta6 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem6 ? (
						<Col sm={12} md={6} className="col-cod-local">
							<label>Ponto de passagem 6</label>
							<RotasSelect
								className="input-cod-local"
								placeholder=" "
								name="ponto_passagem6.ponto"
								value={formik.values.ponto_passagem6.ponto}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							/>
						</Col>
					) : (
						<Col sm={12} md={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem6.client"
								value={formik.values.ponto_passagem6.client}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={6}
								required
							/>
						</Col>
					)}
					<Col>
						<FloatingLabel label="Coleta/Entrega 6" className="mb-3">
							<Form.Select
								name="ponto_passagem6.tipoServico"
								value={formik.values.ponto_passagem6.tipoServico}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							>
								<option value=""></option>
								<option value="Coleta">Coleta</option>
								<option value="Entrega">Entrega</option>
							</Form.Select>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="Previsão 6" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem6.previsao"
								value={formik.values.ponto_passagem6.previsao}
								onChange={formik.handleChange}
								required
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
			{inputColeta7 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem7 ? (
						<Col sm={12} md={6} className="col-cod-local">
							<label>Ponto de passagem 7</label>
							<RotasSelect
								className="input-cod-local"
								//id="Codigo-filial pb-5"
								placeholder=" "
								name="ponto_passagem7.ponto"
								value={formik.values.ponto_passagem7.ponto}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							/>
						</Col>
					) : (
						<Col sm={12} md={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem7.client"
								value={formik.values.ponto_passagem7.client}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={7}
								required
							/>
						</Col>
					)}
					<Col>
						<FloatingLabel label="Coleta/Entrega 7" className="mb-3">
							<Form.Select
								name="ponto_passagem7.tipoServico"
								value={formik.values.ponto_passagem7.tipoServico}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							>
								<option value=""></option>
								<option value="Coleta">Coleta</option>
								<option value="Entrega">Entrega</option>
							</Form.Select>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="Previsão 7" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem7.previsao"
								value={formik.values.ponto_passagem7.previsao}
								onChange={formik.handleChange}
								required
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
			{inputColeta8 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem8 ? (
						<Col sm={12} md={6} className="col-cod-local">
							<label>Ponto de passagem 8</label>
							<RotasSelect
								className="input-cod-local"
								//id="Codigo-filial pb-5"
								placeholder=" "
								name="ponto_passagem8.ponto"
								value={formik.values.ponto_passagem8.ponto}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							/>
						</Col>
					) : (
						<Col sm={12} md={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem8.client"
								value={formik.values.ponto_passagem8.client}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={8}
								required
							/>
						</Col>
					)}
					<Col>
						<FloatingLabel label="Coleta/Entrega 8" className="mb-3">
							<Form.Select
								name="ponto_passagem8.tipoServico"
								value={formik.values.ponto_passagem8.tipoServico}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							>
								<option value=""></option>
								<option value="Coleta">Coleta</option>
								<option value="Entrega">Entrega</option>
							</Form.Select>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="Previsão 8" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem8.previsao"
								value={formik.values.ponto_passagem8.previsao}
								onChange={formik.handleChange}
								required
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
			{inputColeta9 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem9 ? (
						<Col sm={12} md={6} className="col-cod-local">
							<label>Ponto de passagem 9</label>
							<RotasSelect
								className="input-cod-local"
								//id="Codigo-filial pb-5"
								placeholder=" "
								name="ponto_passagem9.ponto"
								value={formik.values.ponto_passagem9.ponto}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							/>
						</Col>
					) : (
						<Col sm={12} md={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem9.client"
								value={formik.values.ponto_passagem9.client}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={9}
								required
							/>
						</Col>
					)}
					<Col>
						<FloatingLabel label="Coleta/Entrega 9" className="mb-3">
							<Form.Select
								name="ponto_passagem9.tipoServico"
								value={formik.values.ponto_passagem9.tipoServico}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							>
								<option value=""></option>
								<option value="Coleta">Coleta</option>
								<option value="Entrega">Entrega</option>
							</Form.Select>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="Previsão 9" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem9.previsao"
								value={formik.values.ponto_passagem9.previsao}
								onChange={formik.handleChange}
								required
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
			{inputColeta10 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem10 ? (
						<Col sm={12} md={6} className="col-cod-local">
							<label>Ponto de passagem 10</label>
							<RotasSelect
								className="input-cod-local"
								//id="Codigo-filial pb-5"
								placeholder=" "
								name="ponto_passagem10.ponto"
								value={formik.values.ponto_passagem10.ponto}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							/>
						</Col>
					) : (
						<Col sm={12} md={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem10.client"
								value={formik.values.ponto_passagem10.client}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={10}
								required
							/>
						</Col>
					)}
					<Col>
						<FloatingLabel label="Coleta/Entrega 10" className="mb-3">
							<Form.Select
								name="ponto_passagem10.tipoServico"
								value={formik.values.ponto_passagem10.tipoServico}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							>
								<option value=""></option>
								<option value="Coleta">Coleta</option>
								<option value="Entrega">Entrega</option>
							</Form.Select>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="Previsão 10" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem10.previsao"
								value={formik.values.ponto_passagem10.previsao}
								onChange={formik.handleChange}
								required
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
			{inputColeta11 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem11 ? (
						<Col sm={12} md={6} className="col-cod-local">
							<label>Ponto de passagem 11</label>
							<RotasSelect
								className="input-cod-local"
								//id="Codigo-filial pb-5"
								placeholder=" "
								name="ponto_passagem11.ponto"
								value={formik.values.ponto_passagem11.ponto}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							/>
						</Col>
					) : (
						<Col sm={12} md={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem11.client"
								value={formik.values.ponto_passagem11.client}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={11}
								required
							/>
						</Col>
					)}
					<Col>
						<FloatingLabel label="Coleta/Entrega 11" className="mb-3">
							<Form.Select
								name="ponto_passagem11.tipoServico"
								value={formik.values.ponto_passagem11.tipoServico}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							>
								<option value=""></option>
								<option value="Coleta">Coleta</option>
								<option value="Entrega">Entrega</option>
							</Form.Select>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="Previsão 11" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem11.previsao"
								value={formik.values.ponto_passagem11.previsao}
								onChange={formik.handleChange}
								required
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
			{inputColeta12 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem12 ? (
						<Col sm={12} md={6} className="col-cod-local">
							<label>Ponto de passagem 12</label>
							<RotasSelect
								className="input-cod-local"
								//id="Codigo-filial pb-5"
								placeholder=" "
								name="ponto_passagem12.ponto"
								value={formik.values.ponto_passagem12.ponto}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							/>
						</Col>
					) : (
						<Col sm={12} md={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem12.client"
								value={formik.values.ponto_passagem12.client}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={10}
								required
							/>
						</Col>
					)}
					<Col>
						<FloatingLabel label="Coleta/Entrega 12" className="mb-3">
							<Form.Select
								name="ponto_passagem12.tipoServico"
								value={formik.values.ponto_passagem12.tipoServico}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
							>
								<option value=""></option>
								<option value="Coleta">Coleta</option>
								<option value="Entrega">Entrega</option>
							</Form.Select>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="Previsão 12" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem12.previsao"
								value={formik.values.ponto_passagem12.previsao}
								onChange={formik.handleChange}
								required
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
		</>
	);
};

export default InputsPontoPassagem;
