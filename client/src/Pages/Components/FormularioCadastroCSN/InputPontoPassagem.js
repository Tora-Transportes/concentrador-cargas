import React, { useEffect, useState } from "react";
import "./formularioCadastroCSN.css";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";
import RotasSelect from "../FilialSelect/rotasSelect";
import InputCliente from "../InputCliente";
import { funcDuracaoProcesso } from "./management";

const InputsPontoPassagem = ({
	formik,
	inputColeta5,
	inputColeta6,
	inputColeta7,
	inputColeta8,
	inputColeta9,
	inputColeta10,
	fkSituacao,
	isPermissionUser,
}) => {
	const [inputPontoPassagem5, setInputPontoPassagem5] = useState(true);
	const [inputPontoPassagem6, setInputPontoPassagem6] = useState(true);
	const [inputPontoPassagem7, setInputPontoPassagem7] = useState(true);
	const [inputPontoPassagem8, setInputPontoPassagem8] = useState(true);
	const [inputPontoPassagem9, setInputPontoPassagem9] = useState(true);
	const [inputPontoPassagem10, setInputPontoPassagem10] = useState(true);

	const disabledValidEfetiva =
		[6, 9].includes(formik.values?.fk_situacao) && isPermissionUser
			? true
			: false;
	const colorInputEfetivo = [6, 9].includes(formik.values?.fk_situacao)
		? "input-efetivo"
		: "";

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

	const handleEnter = (event) => {
		if (event.key === "Enter") {
			const form = event.target.form;
			const index = [...form].indexOf(event.target);
			if (index == 3) {
				form.elements[index + 3].focus();
				event.preventDefault();
			} else {
				form.elements[index + 1].focus();
				event.preventDefault();
			}
		}
	};

	return (
		<>
			<Row className="row-input-coleta">
				<Col sm={12} md={12} lg={12} xxl={6}>
					<FloatingLabel label="*Ponto de passagem" className="mb-3">
						<Form.Control
							type="text"
							name="ponto_passagem.ponto"
							value={formik.values.ponto_passagem.ponto?.split("-")[1]}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col className="input-ponto-passagem-coleta-entrega">
					<FloatingLabel label="Coleta/Entrega" className="mb-3">
						<Form.Control
							type="text"
							disabled
							name="ponto_passagem.tipoServico"
							value={formik.values.ponto_passagem.tipoServico}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="*Previsão inicio" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem.previsao"
							value={formik.values.ponto_passagem.previsao}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="*Previsão fim" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem.previsaoSaida"
							value={formik.values.ponto_passagem.previsaoSaida}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				{fkSituacao && (
					<>
						<Col>
							<FloatingLabel
								label="*Data Coleta Efetivo inicio"
								className="mb-3"
							>
								<Form.Control
									className={colorInputEfetivo}
									type="datetime-local"
									placeholder=" "
									name="ponto_passagem.coletaEfetiva_posto30"
									value={
										formik.values.ponto_passagem.coletaEfetiva_posto30 || ""
									}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
						<Col>
							<FloatingLabel label="*Data Coleta Efetivo fim" className="mb-3">
								<Form.Control
									className={colorInputEfetivo}
									type="datetime-local"
									placeholder=" "
									name="ponto_passagem.coletaEfetivaSaida"
									value={formik.values.ponto_passagem.coletaEfetivaSaida || ""}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									onBlur={() =>
										funcDuracaoProcesso(
											formik,
											1,
											formik.values.ponto_passagem.coletaEfetivaSaida
										)
									}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
						<Col className="col-temp-servic-local">
							<FloatingLabel
								label="Duração processo"
								className="mb-3 floatingLabel-temp-servic-local"
							>
								<Form.Control
									type="text"
									disabled={true}
									name="ponto_passagem.tempServicoLocal"
									value={formik.values.ponto_passagem.tempServicoLocal || ""}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
								/>
							</FloatingLabel>
						</Col>
					</>
				)}
			</Row>

			<Row className="row-input-coleta">
				<Col sm={12} md={12} lg={12} xxl={6}>
					<FloatingLabel label="Ponto de passagem 2" className="mb-3">
						<Form.Control
							type="text"
							name="ponto_passagem2.ponto"
							value={formik.values.ponto_passagem2.ponto?.split("-")[1]}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col className="input-ponto-passagem-coleta-entrega">
					<FloatingLabel label="Coleta/Entrega 2" className="mb-3">
						<Form.Control
							type="text"
							disabled
							name="ponto_passagem2.tipoServico"
							value={formik.values.ponto_passagem2.tipoServico}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="*Previsão inicio 2" className="mb-3">
						<Form.Control
							type="datetime-local"
							name="ponto_passagem2.previsao"
							value={formik.values.ponto_passagem2.previsao}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="*Previsão fim 2" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem2.previsaoSaida"
							value={formik.values.ponto_passagem2.previsaoSaida}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				{fkSituacao && (
					<>
						<Col>
							<FloatingLabel
								label="*Data Coleta Efetivo inicio"
								className="mb-3"
							>
								<Form.Control
									className={colorInputEfetivo}
									type="datetime-local"
									placeholder=" "
									name="ponto_passagem2.coletaEfetiva_mundo"
									value={
										formik.values.ponto_passagem2.coletaEfetiva_mundo || ""
									}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
						<Col>
							<FloatingLabel label="*Data Coleta Efetivo fim" className="mb-3">
								<Form.Control
									className={colorInputEfetivo}
									type="datetime-local"
									placeholder=" "
									name="ponto_passagem2.coletaEfetivaSaida"
									value={formik.values.ponto_passagem2.coletaEfetivaSaida || ""}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									onBlur={() =>
										funcDuracaoProcesso(
											formik,
											2,
											formik.values.ponto_passagem2.coletaEfetivaSaida
										)
									}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
						<Col className="col-temp-servic-local">
							<FloatingLabel
								label="Duração processo"
								className="mb-3 floatingLabel-temp-servic-local"
							>
								<Form.Control
									type="text"
									disabled={true}
									name="ponto_passagem2.tempServicoLocal"
									value={formik.values.ponto_passagem2.tempServicoLocal || ""}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
								/>
							</FloatingLabel>
						</Col>
					</>
				)}
			</Row>
			<Row className="row-input-coleta">
				<Col sm={12} md={12} lg={12} xxl={6}>
					<FloatingLabel label="Ponto de passagem 3" className="mb-3">
						<Form.Control
							type="text"
							name="ponto_passagem3.ponto"
							value={formik.values.ponto_passagem3.ponto?.split("-")[1]}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col className="input-ponto-passagem-coleta-entrega">
					<FloatingLabel label="Coleta/Entrega 3" className="mb-3">
						<Form.Control
							type="text"
							disabled
							name="ponto_passagem3.tipoServico"
							value={formik.values.ponto_passagem3.tipoServico}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="*Previsão inicio 3" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem3.previsao"
							value={formik.values.ponto_passagem3.previsao}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="*Previsão fim 3" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem3.previsaoSaida"
							value={formik.values.ponto_passagem3.previsaoSaida}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				{fkSituacao && (
					<>
						<Col>
							<FloatingLabel
								label="*Data Coleta Efetivo inicio"
								className="mb-3"
							>
								<Form.Control
									className={colorInputEfetivo}
									type="datetime-local"
									placeholder=" "
									name="ponto_passagem3.coletaEfetiva_peacao"
									value={
										formik.values.ponto_passagem3.coletaEfetiva_peacao || ""
									}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
						<Col>
							<FloatingLabel label="*Data Coleta Efetivo fim" className="mb-3">
								<Form.Control
									className={colorInputEfetivo}
									type="datetime-local"
									placeholder=" "
									name="ponto_passagem3.coletaEfetivaSaida"
									value={formik.values.ponto_passagem3.coletaEfetivaSaida || ""}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									onBlur={() =>
										funcDuracaoProcesso(
											formik,
											3,
											formik.values.ponto_passagem3.coletaEfetivaSaida
										)
									}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
						<Col className="col-temp-servic-local">
							<FloatingLabel
								label="Duração processo"
								className="mb-3 floatingLabel-temp-servic-local"
							>
								<Form.Control
									type="text"
									disabled={true}
									name="ponto_passagem3.tempServicoLocal"
									value={formik.values.ponto_passagem3.tempServicoLocal || ""}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
								/>
							</FloatingLabel>
						</Col>
					</>
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
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
								disabled={fkSituacao}
							/>
						</Col>
					) : (
						<Col sm={12} md={12} lg={12} xxl={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem5.client"
								value={formik.values.ponto_passagem5.client}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={5}
								required
								disabled={fkSituacao}
							/>
						</Col>
					)}
					<Col className="input-ponto-passagem-coleta-entrega">
						<FloatingLabel label="Coleta/Entrega 5" className="mb-3">
							<Form.Select
								name="ponto_passagem5.tipoServico"
								value={formik.values.ponto_passagem5.tipoServico}
								onKeyDown={handleEnter}
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
						<FloatingLabel label="*Previsão inicio 5" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem5.previsao"
								value={formik.values.ponto_passagem5.previsao}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="*Previsão fim 5" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem5.previsaoSaida"
								value={formik.values.ponto_passagem5.previsaoSaida}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<>
							<Col>
								<FloatingLabel
									label="Data Coleta/Entrega Efetivo"
									className="mb-3"
								>
									<Form.Control
										className={colorInputEfetivo}
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
										onKeyDown={handleEnter}
										disabled={disabledValidEfetiva}
										required
									/>
								</FloatingLabel>
							</Col>
							<Col>
								<FloatingLabel
									label="*Data Coleta Efetivo fim"
									className="mb-3"
								>
									<Form.Control
										className={colorInputEfetivo}
										type="datetime-local"
										placeholder=" "
										name="ponto_passagem5.coletaEfetivaSaida"
										value={
											inputPontoPassagem5
												? formik.values.ponto_passagem5.coletaEfetivaSaida || ""
												: formik.values.ponto_passagem5.entregaEfetivaSaida ||
												  ""
										}
										onKeyDown={handleEnter}
										onChange={formik.handleChange}
										onBlur={() =>
											funcDuracaoProcesso(
												formik,
												5,
												formik.values.ponto_passagem5.coletaEfetivaSaida
											)
										}
										disabled={disabledValidEfetiva}
										required
									/>
								</FloatingLabel>
							</Col>
							<Col className="col-temp-servic-local">
								<FloatingLabel
									label="Duração processo"
									className="mb-3 floatingLabel-temp-servic-local"
								>
									<Form.Control
										type="text"
										disabled={true}
										name="ponto_passagem5.tempServicoLocal"
										value={
											formik.values.ponto_passagem5.tempServicoLocal
												? formik.values.ponto_passagem5.tempServicoLocal || ""
												: formik.values.ponto_passagem5
														.tempServicoLocalEntrega || ""
										}
										onKeyDown={handleEnter}
										onChange={formik.handleChange}
									/>
								</FloatingLabel>
							</Col>
						</>
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
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								disabled={fkSituacao}
								required
							/>
						</Col>
					) : (
						<Col sm={12} md={12} lg={12} xxl={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem6.client"
								value={formik.values.ponto_passagem6.client}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={6}
								disabled={fkSituacao}
								required
							/>
						</Col>
					)}
					<Col className="input-ponto-passagem-coleta-entrega">
						<FloatingLabel label="Coleta/Entrega 6" className="mb-3">
							<Form.Select
								name="ponto_passagem6.tipoServico"
								value={formik.values.ponto_passagem6.tipoServico}
								onKeyDown={handleEnter}
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
						<FloatingLabel label="*Previsão inicio 6" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem6.previsao"
								value={formik.values.ponto_passagem6.previsao}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="*Previsão fim 6" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem6.previsaoSaida"
								value={formik.values.ponto_passagem6.previsaoSaida}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<>
							<Col>
								<FloatingLabel
									label="Data Coleta/Entrega Efetivo"
									className="mb-3"
								>
									<Form.Control
										className={colorInputEfetivo}
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
										onKeyDown={handleEnter}
										disabled={disabledValidEfetiva}
										required
									/>
								</FloatingLabel>
							</Col>
							<Col>
								<FloatingLabel
									label="Data Coleta/Entrega Efetivo fim"
									className="mb-3"
								>
									<Form.Control
										className={colorInputEfetivo}
										type="datetime-local"
										placeholder=" "
										name="ponto_passagem6.entregaEfetivaSaida"
										value={
											inputPontoPassagem6
												? formik.values.ponto_passagem6.coletaEfetivaSaida || ""
												: formik.values.ponto_passagem6.entregaEfetivaSaida ||
												  ""
										}
										onKeyDown={handleEnter}
										onChange={formik.handleChange}
										onBlur={() =>
											funcDuracaoProcesso(
												formik,
												6,
												formik.values.ponto_passagem6.coletaEfetiva
											)
										}
										disabled={disabledValidEfetiva}
										required
									/>
								</FloatingLabel>
							</Col>
							<Col className="col-temp-servic-local">
								<FloatingLabel
									label="Duração processo"
									className="mb-3 floatingLabel-temp-servic-local"
								>
									<Form.Control
										type="text"
										disabled={true}
										name="ponto_passagem6.tempServicoLocal"
										value={
											formik.values.ponto_passagem6.tempServicoLocal
												? formik.values.ponto_passagem6.tempServicoLocal || ""
												: formik.values.ponto_passagem6
														.tempServicoLocalEntrega || ""
										}
										onKeyDown={handleEnter}
										onChange={formik.handleChange}
									/>
								</FloatingLabel>
							</Col>
						</>
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
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								disabled={fkSituacao}
								required
							/>
						</Col>
					) : (
						<Col sm={12} md={12} lg={12} xxl={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem7.client"
								value={formik.values.ponto_passagem7.client}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={7}
								disabled={fkSituacao}
								required
							/>
						</Col>
					)}
					<Col className="input-ponto-passagem-coleta-entrega">
						<FloatingLabel label="Coleta/Entrega 7" className="mb-3">
							<Form.Select
								name="ponto_passagem7.tipoServico"
								value={formik.values.ponto_passagem7.tipoServico}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
								disabled={fkSituacao}
							>
								<option value=""></option>
								<option onKeyDown={handleEnter} value="Coleta">
									Coleta
								</option>
								<option value="Entrega">Entrega</option>
							</Form.Select>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="*Previsão inicio 7" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem7.previsao"
								value={formik.values.ponto_passagem7.previsao}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="*Previsão fim 7" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem7.previsaoSaida"
								value={formik.values.ponto_passagem7.previsaoSaida}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<>
							<Col>
								<FloatingLabel
									label="Data Coleta/Entrega Efetivo"
									className="mb-3"
								>
									<Form.Control
										className={colorInputEfetivo}
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
										onKeyDown={handleEnter}
										disabled={disabledValidEfetiva}
										required
									/>
								</FloatingLabel>
							</Col>
							<Col>
								<FloatingLabel
									label="Data Coleta/Entrega Efetivo fim"
									className="mb-3"
								>
									<Form.Control
										className={colorInputEfetivo}
										type="datetime-local"
										placeholder=" "
										name="ponto_passagem7.coletaEfetivaSaida"
										value={
											inputPontoPassagem7
												? formik.values.ponto_passagem7.coletaEfetivaSaida || ""
												: formik.values.ponto_passagem7.entregaEfetivaSaida ||
												  ""
										}
										onKeyDown={handleEnter}
										onChange={formik.handleChange}
										onBlur={() =>
											funcDuracaoProcesso(
												formik,
												7,
												formik.values.ponto_passagem7.coletaEfetivaSaida
											)
										}
										disabled={disabledValidEfetiva}
										required
									/>
								</FloatingLabel>
							</Col>
							<Col className="col-temp-servic-local">
								<FloatingLabel
									label="Duração processo"
									className="mb-3 floatingLabel-temp-servic-local"
								>
									<Form.Control
										type="text"
										disabled={true}
										name="ponto_passagem7.tempServicoLocal"
										value={
											formik.values.ponto_passagem7.tempServicoLocal
												? formik.values.ponto_passagem7.tempServicoLocal || ""
												: formik.values.ponto_passagem7
														.tempServicoLocalEntrega || ""
										}
										onKeyDown={handleEnter}
										onChange={formik.handleChange}
									/>
								</FloatingLabel>
							</Col>
						</>
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
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
								disabled={fkSituacao}
							/>
						</Col>
					) : (
						<Col sm={12} md={12} lg={12} xxl={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem8.client"
								value={formik.values.ponto_passagem8.client}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={8}
								required
								disabled={fkSituacao}
							/>
						</Col>
					)}
					<Col className="input-ponto-passagem-coleta-entrega">
						<FloatingLabel label="Coleta/Entrega 8" className="mb-3">
							<Form.Select
								name="ponto_passagem8.tipoServico"
								value={formik.values.ponto_passagem8.tipoServico}
								onKeyDown={handleEnter}
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
						<FloatingLabel label="*Previsão inicio 8" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem8.previsao"
								value={formik.values.ponto_passagem8.previsao}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="*Previsão fim 8" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem8.previsaoSaida"
								value={formik.values.ponto_passagem8.previsaoSaida}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<>
							<Col>
								<FloatingLabel
									label="Data Coleta/Entrega Efetivo"
									className="mb-3"
								>
									<Form.Control
										className={colorInputEfetivo}
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
										onKeyDown={handleEnter}
										disabled={disabledValidEfetiva}
										required
									/>
								</FloatingLabel>
							</Col>
							<Col>
								<FloatingLabel
									label="Data Coleta/Entrega Efetivo fim"
									className="mb-3"
								>
									<Form.Control
										className={colorInputEfetivo}
										type="datetime-local"
										placeholder=" "
										name="ponto_passagem8.coletaEfetivaSaida"
										value={
											inputPontoPassagem8
												? formik.values.ponto_passagem8.coletaEfetivaSaida || ""
												: formik.values.ponto_passagem8.entregaEfetivaSaida ||
												  ""
										}
										onKeyDown={handleEnter}
										onChange={formik.handleChange}
										onBlur={() =>
											funcDuracaoProcesso(
												formik,
												8,
												formik.values.ponto_passagem8.coletaEfetivaSaida
											)
										}
										disabled={disabledValidEfetiva}
										required
									/>
								</FloatingLabel>
							</Col>
							<Col className="col-temp-servic-local">
								<FloatingLabel
									label="Duração processo"
									className="mb-3 floatingLabel-temp-servic-local"
								>
									<Form.Control
										type="text"
										disabled={true}
										name="ponto_passagem8.tempServicoLocal"
										value={
											formik.values.ponto_passagem8.tempServicoLocal
												? formik.values.ponto_passagem8.tempServicoLocal || ""
												: formik.values.ponto_passagem8
														.tempServicoLocalEntrega || ""
										}
										onKeyDown={handleEnter}
										onChange={formik.handleChange}
									/>
								</FloatingLabel>
							</Col>
						</>
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
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
								disabled={fkSituacao}
							/>
						</Col>
					) : (
						<Col sm={12} md={12} lg={12} xxl={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem9.client"
								value={formik.values.ponto_passagem9.client}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={9}
								required
								disabled={fkSituacao}
							/>
						</Col>
					)}
					<Col className="input-ponto-passagem-coleta-entrega">
						<FloatingLabel label="Coleta/Entrega 9" className="mb-3">
							<Form.Select
								name="ponto_passagem9.tipoServico"
								value={formik.values.ponto_passagem9.tipoServico}
								onKeyDown={handleEnter}
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
						<FloatingLabel label="*Previsão inicio 9" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem9.previsao"
								value={formik.values.ponto_passagem9.previsao}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="*Previsão fim 9" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem9.previsaoSaida"
								value={formik.values.ponto_passagem9.previsaoSaida}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="*Previsão fim 9" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem9.previsaoSaida"
								value={formik.values.ponto_passagem9.previsaoSaida}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<>
							<Col>
								<FloatingLabel
									label="Data Coleta/Entrega Efetivo"
									className="mb-3"
								>
									<Form.Control
										className={colorInputEfetivo}
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
										onKeyDown={handleEnter}
										disabled={disabledValidEfetiva}
										required
									/>
								</FloatingLabel>
							</Col>
							<Col>
								<FloatingLabel
									label="*Data Coleta Efetivo fim"
									className="mb-3"
								>
									<Form.Control
										className={colorInputEfetivo}
										type="datetime-local"
										placeholder=" "
										name="ponto_passagem9.coletaEfetivaSaida"
										value={
											inputPontoPassagem9
												? formik.values.ponto_passagem9.coletaEfetivaSaida || ""
												: formik.values.ponto_passagem9.entregaEfetivaSaida ||
												  ""
										}
										onKeyDown={handleEnter}
										onChange={formik.handleChange}
										onBlur={() =>
											funcDuracaoProcesso(
												formik,
												9,
												formik.values.ponto_passagem9.coletaEfetivaSaida
											)
										}
										disabled={disabledValidEfetiva}
										required
									/>
								</FloatingLabel>
							</Col>
							<Col className="col-temp-servic-local">
								<FloatingLabel
									label="Duração processo"
									className="mb-3 floatingLabel-temp-servic-local"
								>
									<Form.Control
										type="text"
										disabled={true}
										name="ponto_passagem9.tempServicoLocal"
										value={
											formik.values.ponto_passagem9.tempServicoLocal
												? formik.values.ponto_passagem9.tempServicoLocal || ""
												: formik.values.ponto_passagem9
														.tempServicoLocalEntrega || ""
										}
										onKeyDown={handleEnter}
										onChange={formik.handleChange}
									/>
								</FloatingLabel>
							</Col>
						</>
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
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								required
								disabled={fkSituacao}
							/>
						</Col>
					) : (
						<Col sm={12} md={12} lg={12} xxl={6}>
							<InputCliente
								type="text"
								placeholder=" "
								name="ponto_passagem10.client"
								value={formik.values.ponto_passagem10.client}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikMain={formik}
								status={10}
								required
								disabled={fkSituacao}
							/>
						</Col>
					)}
					<Col className="input-ponto-passagem-coleta-entrega">
						<FloatingLabel label="Coleta/Entrega 10" className="mb-3">
							<Form.Select
								name="ponto_passagem10.tipoServico"
								value={formik.values.ponto_passagem10.tipoServico}
								onKeyDown={handleEnter}
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
						<FloatingLabel label="*Previsão inicio 10" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem10.previsao"
								value={formik.values.ponto_passagem10.previsao}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="*Previsão fim 10" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem10.previsaoSaida"
								value={formik.values.ponto_passagem10.previsaoSaida}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<>
							<Col>
								<FloatingLabel
									label="*Data Coleta/Entrega Efetivo"
									className="mb-3"
								>
									<Form.Control
										className={colorInputEfetivo}
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
										onKeyDown={handleEnter}
										disabled={disabledValidEfetiva}
										required
									/>
								</FloatingLabel>
							</Col>
							<Col>
								<FloatingLabel
									label="*Data Entrega Efetivo fim"
									className="mb-3"
								>
									<Form.Control
										className={colorInputEfetivo}
										type="datetime-local"
										placeholder=" "
										name="ponto_passagem10.coletaEfetivaSaida"
										value={
											inputPontoPassagem10
												? formik.values.ponto_passagem10.coletaEfetivaSaida ||
												  ""
												: formik.values.ponto_passagem10.entregaEfetivaSaida ||
												  ""
										}
										onKeyDown={handleEnter}
										onChange={formik.handleChange}
										onBlur={() =>
											funcDuracaoProcesso(
												formik,
												10,
												formik.values.ponto_passagem10.coletaEfetivaSaida
											)
										}
										disabled={disabledValidEfetiva}
										required
									/>
								</FloatingLabel>
							</Col>
							<Col className="col-temp-servic-local">
								<FloatingLabel
									label="Duração processo"
									className="mb-3 floatingLabel-temp-servic-local"
								>
									<Form.Control
										type="text"
										disabled={true}
										name="ponto_passagem10.tempServicoLocal"
										value={
											formik.values.ponto_passagem10.tempServicoLocal
												? formik.values.ponto_passagem10.tempServicoLocal || ""
												: formik.values.ponto_passagem10
														.tempServicoLocalEntrega || ""
										}
										onKeyDown={handleEnter}
										onChange={formik.handleChange}
									/>
								</FloatingLabel>
							</Col>
						</>
					)}
				</Row>
			)}
			<Row className="row-input-coleta">
				<Col sm={12} md={12} lg={12} xxl={6}>
					<InputCliente
						type="text"
						placeholder=" "
						name="ponto_passagem4.client"
						value={formik.values.ponto_passagem4.client}
						onKeyDown={handleEnter}
						onChange={formik.handleChange}
						//onBlur={formik.handleBlur}
						onBlur={() =>
							formik.setFieldValue("ponto_passagem4.entregaFinal", 1)
						}
						formikMain={formik}
						status={4}
						required
						disabled={fkSituacao}
					/>
				</Col>
				<Col className="input-ponto-passagem-coleta-entrega">
					<FloatingLabel label="Coleta/Entrega 4  " className="mb-3">
						<Form.Control
							type="text"
							name="ponto_passagem4.tipoServico"
							value={formik.values.ponto_passagem4.tipoServico}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							required
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="*Previsão inicio 4" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem4.previsao"
							value={formik.values.ponto_passagem4.previsao}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="*Previsão fim 4" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem4.previsaoSaida"
							value={formik.values.ponto_passagem4.previsaoSaida}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				{fkSituacao && (
					<>
						<Col md={4} lg={4}>
							<FloatingLabel
								label="*Data Entrega Efetivo inicio"
								className="mb-3"
							>
								<Form.Control
									className={colorInputEfetivo}
									type="datetime-local"
									placeholder=" "
									name="ponto_passagem4.entregaEfetiva"
									value={formik.values.ponto_passagem4.entregaEfetiva || ""}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
						<Col>
							<FloatingLabel label="*Data Entrega Efetivo fim" className="mb-3">
								<Form.Control
									className={colorInputEfetivo}
									type="datetime-local"
									placeholder=" "
									name="ponto_passagem4.entregaEfetivaSaida"
									value={
										formik.values.ponto_passagem4.entregaEfetivaSaida || ""
									}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									onBlur={() =>
										funcDuracaoProcesso(
											formik,
											4,
											formik.values.ponto_passagem4.entregaEfetivaSaida
										)
									}
									disabled={disabledValidEfetiva}
									required
								/>
							</FloatingLabel>
						</Col>
						<Col className="col-temp-servic-local">
							<FloatingLabel
								label="Duração processo"
								className="mb-3 floatingLabel-temp-servic-local"
							>
								<Form.Control
									type="text"
									disabled={true}
									name="ponto_passagem4.tempServicoLocalEntrega"
									value={
										formik.values.ponto_passagem4.tempServicoLocalEntrega || ""
									}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
								/>
							</FloatingLabel>
						</Col>
					</>
				)}
			</Row>
		</>
	);
};

export default InputsPontoPassagem;
