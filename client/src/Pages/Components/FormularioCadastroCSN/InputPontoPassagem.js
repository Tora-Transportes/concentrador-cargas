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
	fkSituacao,
}) => {
	const [inputPontoPassagem5, setInputPontoPassagem5] = useState(true);
	const [inputPontoPassagem6, setInputPontoPassagem6] = useState(true);
	const [inputPontoPassagem7, setInputPontoPassagem7] = useState(true);
	const [inputPontoPassagem8, setInputPontoPassagem8] = useState(true);
	const [inputPontoPassagem9, setInputPontoPassagem9] = useState(true);
	const [inputPontoPassagem10, setInputPontoPassagem10] = useState(true);

	const disabledValidEfetiva = formik.values?.fk_situacao === 6 ? true : false;
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
	}, [formik.values]);
	return (
		<>
			<Row className="row-input-coleta">
				<Col sm={12} md={6}>
					<FloatingLabel label="*Ponto de passagem" className="mb-3">
						<Form.Control
							type="text"
							name="ponto_passagem.ponto"
							value={formik.values.ponto_passagem.ponto?.split("-")[1]}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Coleta/Entrega" className="mb-3">
						<Form.Control
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
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				{fkSituacao && (
					<Col>
						<FloatingLabel label="Data Coleta Efetiva" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem.coletaEfetiva_posto30"
								value={formik.values.ponto_passagem.coletaEfetiva_posto30 || ""}
								onChange={formik.handleChange}
								disabled={disabledValidEfetiva}
								required
							/>
						</FloatingLabel>
					</Col>
				)}
			</Row>

			<Row className="row-input-coleta">
				<Col sm={12} md={6}>
					<FloatingLabel label="Ponto de passagem2" className="mb-3">
						<Form.Control
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
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				{fkSituacao && (
					<Col>
						<FloatingLabel label="Data Coleta Efetiva" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem2.coletaEfetiva_mundo"
								value={formik.values.ponto_passagem2.coletaEfetiva_mundo || ""}
								onChange={formik.handleChange}
								disabled={disabledValidEfetiva}
								required
							/>
						</FloatingLabel>
					</Col>
				)}
			</Row>
			<Row className="row-input-coleta">
				<Col sm={12} md={6}>
					<FloatingLabel label="Ponto de passagem3" className="mb-3">
						<Form.Control
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
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				{fkSituacao && (
					<Col>
						<FloatingLabel label="Data Coleta Efetiva" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem3.coletaEfetiva_peacao"
								value={formik.values.ponto_passagem3.coletaEfetiva_peacao || ""}
								onChange={formik.handleChange}
								disabled={disabledValidEfetiva}
								required
							/>
						</FloatingLabel>
					</Col>
				)}
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
						disabled={fkSituacao}
					/>
				</Col>
				<Col>
					<FloatingLabel label="Coleta/Entrega 4" className="mb-3">
						<Form.Control
							type="text"
							name="ponto_passagem4.tipoServico"
							value={formik.values.ponto_passagem4.tipoServico}
							onChange={formik.handleChange}
							required
							disabled
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
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				{fkSituacao && (
					<Col>
						<FloatingLabel label="Data Entrega Efetiva" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem4.entregaEfetiva"
								value={formik.values.ponto_passagem4.entregaEfetiva || ""}
								onChange={formik.handleChange}
								disabled={disabledValidEfetiva}
								required
							/>
						</FloatingLabel>
					</Col>
				)}
			</Row>

			{inputColeta5 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem5 ? (
						<Col
							sm={12}
							md={6}
							style={{ backgroundColor: fkSituacao ? "#e9ecef" : "#FFF" }}
							className="col-cod-local"
						>
							<label>Ponto de passagem 5</label>
							<RotasSelect
								className="input-cod-local"
								name="ponto_passagem5.ponto"
								value={formik.values.ponto_passagem5.ponto?.split("-")[1]}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
								disabled={fkSituacao}
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
								disabled={fkSituacao}
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
								disabled={fkSituacao}
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
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<Col>
							<FloatingLabel label="Data Entrega Efetiva" className="mb-3">
								<Form.Control
									type="datetime-local"
									placeholder=" "
									name={
										inputPontoPassagem5
											? "ponto_passagem5.coletaEfetiva"
											: "ponto_passagem5.entregaEfetiva"
									}
									value={
										inputPontoPassagem5
											? formik.values.ponto_passagem5.coletaEfetiva || ""
											: formik.values.ponto_passagem5.entregaEfetiva || ""
									}
									onChange={formik.handleChange}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
					)}
				</Row>
			)}
			{inputColeta6 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem6 ? (
						<Col
							sm={12}
							md={6}
							style={{ backgroundColor: fkSituacao ? "#e9ecef" : "#FFF" }}
							className="col-cod-local"
						>
							<label>Ponto de passagem 6</label>
							<RotasSelect
								className="input-cod-local"
								placeholder=" "
								name="ponto_passagem6.ponto"
								value={formik.values.ponto_passagem6.ponto?.split("-")[1] || ""}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								disabled={fkSituacao}
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
								disabled={fkSituacao}
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
								disabled={fkSituacao}
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
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<Col>
							<FloatingLabel label="Data Entrega Efetiva" className="mb-3">
								<Form.Control
									type="datetime-local"
									placeholder=" "
									name={
										inputPontoPassagem6
											? "ponto_passagem6.coletaEfetiva"
											: "ponto_passagem6.entregaEfetiva"
									}
									value={
										inputPontoPassagem6
											? formik.values.ponto_passagem6.coletaEfetiva || ""
											: formik.values.ponto_passagem6.entregaEfetiva || ""
									}
									onChange={formik.handleChange}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
					)}
				</Row>
			)}
			{inputColeta7 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem7 ? (
						<Col
							sm={12}
							md={6}
							style={{ backgroundColor: fkSituacao ? "#e9ecef" : "#FFF" }}
							className="col-cod-local"
						>
							<label>Ponto de passagem 7</label>
							<RotasSelect
								className="input-cod-local"
								placeholder=" "
								name="ponto_passagem7.ponto"
								value={formik.values.ponto_passagem7.ponto?.split("-")[1]}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								disabled={fkSituacao}
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
								disabled={fkSituacao}
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
								disabled={fkSituacao}
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
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<Col>
							<FloatingLabel label="Data Entrega Efetiva" className="mb-3">
								<Form.Control
									type="datetime-local"
									placeholder=" "
									name={
										inputPontoPassagem7
											? "ponto_passagem7.coletaEfetiva"
											: "ponto_passagem7.entregaEfetiva"
									}
									value={
										inputPontoPassagem7
											? formik.values.ponto_passagem7.coletaEfetiva || ""
											: formik.values.ponto_passagem7.entregaEfetiva || ""
									}
									onChange={formik.handleChange}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
					)}
				</Row>
			)}
			{inputColeta8 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem8 ? (
						<Col
							sm={12}
							md={6}
							style={{ backgroundColor: fkSituacao ? "#e9ecef" : "#FFF" }}
							className="col-cod-local"
						>
							<label>Ponto de passagem 8</label>
							<RotasSelect
								className="input-cod-local"
								placeholder=" "
								name="ponto_passagem8.ponto"
								value={formik.values.ponto_passagem8.ponto?.split("-")[1]}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
								disabled={fkSituacao}
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
								disabled={fkSituacao}
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
								disabled={fkSituacao}
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
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<Col>
							<FloatingLabel label="Data Entrega Efetiva" className="mb-3">
								<Form.Control
									type="datetime-local"
									placeholder=" "
									name={
										inputPontoPassagem8
											? "ponto_passagem8.coletaEfetiva"
											: "ponto_passagem8.entregaEfetiva"
									}
									value={
										inputPontoPassagem8
											? formik.values.ponto_passagem8.coletaEfetiva || ""
											: formik.values.ponto_passagem8.entregaEfetiva || ""
									}
									onChange={formik.handleChange}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
					)}
				</Row>
			)}
			{inputColeta9 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem9 ? (
						<Col
							sm={12}
							md={6}
							style={{ backgroundColor: fkSituacao ? "#e9ecef" : "#FFF" }}
							className="col-cod-local"
						>
							<label>Ponto de passagem 9</label>
							<RotasSelect
								className="input-cod-local"
								placeholder=" "
								name="ponto_passagem9.ponto"
								value={formik.values.ponto_passagem9.ponto?.split("-")[1]}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
								disabled={fkSituacao}
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
								disabled={fkSituacao}
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
								disabled={fkSituacao}
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
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<Col>
							<FloatingLabel label="Data Entrega Efetiva" className="mb-3">
								<Form.Control
									type="datetime-local"
									placeholder=" "
									name={
										inputPontoPassagem9
											? "ponto_passagem9.coletaEfetiva"
											: "ponto_passagem9.entregaEfetiva"
									}
									value={
										inputPontoPassagem9
											? formik.values.ponto_passagem9.coletaEfetiva || ""
											: formik.values.ponto_passagem9.entregaEfetiva || ""
									}
									onChange={formik.handleChange}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
					)}
				</Row>
			)}
			{inputColeta10 && (
				<Row className="row-input-coleta">
					{inputPontoPassagem10 ? (
						<Col
							sm={12}
							md={6}
							style={{ backgroundColor: fkSituacao ? "#e9ecef" : "#FFF" }}
							className="col-cod-local"
						>
							<label>Ponto de passagem 10</label>
							<RotasSelect
								className="input-cod-local"
								placeholder=" "
								name="ponto_passagem10.ponto"
								value={formik.values.ponto_passagem10.ponto?.split("-")[1]}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
								disabled={fkSituacao}
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
								disabled={fkSituacao}
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
								disabled={fkSituacao}
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
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<Col>
							<FloatingLabel label="Data Entrega Efetiva" className="mb-3">
								<Form.Control
									type="datetime-local"
									placeholder=" "
									name={
										inputPontoPassagem10
											? "ponto_passagem10.coletaEfetiva"
											: "ponto_passagem10.entregaEfetiva"
									}
									value={
										inputPontoPassagem10
											? formik.values.ponto_passagem10.coletaEfetiva || ""
											: formik.values.ponto_passagem10.entregaEfetiva || ""
									}
									onChange={formik.handleChange}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
					)}
				</Row>
			)}
		</>
	);
};

export default InputsPontoPassagem;
