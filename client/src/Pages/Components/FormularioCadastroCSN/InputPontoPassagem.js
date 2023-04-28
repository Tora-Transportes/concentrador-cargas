import React, { useEffect, useRef, useState } from "react";
import "./formularioCadastroCSN.css";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";
import swal from "sweetalert";
import RotasSelect from "../FilialSelect/rotasSelect";
import InputCliente from "../InputCliente";
import { MontarBoryEditPatch } from "./management";
import { funcCompareDateOneYear } from "src/Pages/Utils/formatDate";
import ServicesPontoParada from "src/services/ServicesPontoParada";
import { Toast } from "primereact/toast";

const InputsPontoPassagem = ({ dataComponenteViews }) => {
	const {
		formik,
		inputColeta5,
		inputColeta6,
		inputColeta7,
		fkSituacao,
		isPermissionUserEdit,
		isDateErrorInput,
		setDateErrorInput,
		isAlteracaoParcial,
	} = dataComponenteViews;
	const [inputPontoPassagem5, setInputPontoPassagem5] = useState(true);
	const [inputPontoPassagem6, setInputPontoPassagem6] = useState(true);
	const [inputPontoPassagem7, setInputPontoPassagem7] = useState(true);
	const alertDataSalva = useRef(null);
	const disabledValidEfetiva =
		[5, 6, 9].includes(formik.values.fk_situacao) && !isPermissionUserEdit
			? true
			: false;
	const colorInputEfetivo = ![6, 9].includes(formik.values?.fk_situacao)
		? ""
		: isPermissionUserEdit === false
		? "input-efetivo"
		: "";

	useEffect(() => {
		if (formik.values?.ponto_passagem5.tipoServico === "Entrega") {
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
	}, [formik.values]);

	const savePontoPassagemEdit = async (date, id, positionInput) => {
		const bodySave = MontarBoryEditPatch(
			positionInput,
			date,
			formik,
			id,
			isAlteracaoParcial
		);
		if (isAlteracaoParcial) {
			const result = await ServicesPontoParada.updatePatchCSN(id, bodySave);
			if (result?.status === 200)
				alertDataSalva.current.show({
					severity: "success",
					detail: "Data salva com sucesso.",
					life: 2000,
				});
		}
	};

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

	const validarDatas = async (date, positionInput, id) => {
		const resultValidation = funcCompareDateOneYear(date);
		if (resultValidation?.error) {
			const arrayErrorEdit = [...isDateErrorInput];
			arrayErrorEdit[positionInput].error = true;
			setDateErrorInput(arrayErrorEdit);
			swal("", resultValidation.message, "info");
		} else {
			const arrayErrorEdit = [...isDateErrorInput];
			arrayErrorEdit[positionInput].error = false;
			setDateErrorInput(arrayErrorEdit);
			if (id && date !== null) {
				savePontoPassagemEdit(date, id, positionInput);
			}
		}
	};

	return (
		<>
			<Toast ref={alertDataSalva} position="top-center" />
			<Row className="row-input-coleta-inicio">
				<Col xs={12} sm={12} md={6} lg={6} xxl={6}>
					<FloatingLabel label="*Ponto de Passagem" className="mb-3">
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
				<Col md={6} lg={6} className="input-ponto-passagem-coleta-entrega">
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
				<Col md={6} lg={6}>
					<FloatingLabel label="*Previsão Início" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem.previsao"
							value={formik.values.ponto_passagem.previsao || ""}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							isInvalid={isDateErrorInput[0]?.error}
							max="9999-12-12T00:00"
							onBlur={() => {
								validarDatas(formik.values.ponto_passagem.previsao, 0);
							}}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				<Col md={6} lg={6}>
					<FloatingLabel label="*Previsão Fim" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem.previsaoSaida"
							value={formik.values.ponto_passagem.previsaoSaida || ""}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							isInvalid={isDateErrorInput[1]?.error}
							max="9999-12-12T00:00"
							onBlur={() => {
								validarDatas(formik.values.ponto_passagem.previsaoSaida, 1);
							}}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				{fkSituacao && (
					<>
						<Col xs={12} sm={6} md={4} lg={4}>
							<FloatingLabel label="*Data Coleta Início" className="mb-3">
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
									isInvalid={isDateErrorInput[2]?.error}
									max="9999-12-12T00:00"
									onBlur={() => {
										validarDatas(
											formik.values.ponto_passagem.coletaEfetiva_posto30,
											2,
											formik.values.ponto_passagem.id
										);
									}}
									disabled={disabledValidEfetiva}
									//required
								/>
								{isDateErrorInput[2].error && (
									<p className="text-danger">Campo Obrigatório!</p>
								)}
							</FloatingLabel>
						</Col>
						<Col xs={12} sm={6} md={4} lg={4}>
							<FloatingLabel label="*Data Coleta Fim" className="mb-3">
								<Form.Control
									className={colorInputEfetivo}
									type="datetime-local"
									placeholder=" "
									name="ponto_passagem.coletaEfetivaSaida"
									value={formik.values.ponto_passagem.coletaEfetivaSaida || ""}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									isInvalid={isDateErrorInput[3]?.error}
									max="9999-12-12T00:00"
									onBlur={() => {
										validarDatas(
											formik.values.ponto_passagem.coletaEfetivaSaida,
											3,
											formik.values.ponto_passagem.id
										);
									}}
									disabled={disabledValidEfetiva}
									//required
								/>
								{isDateErrorInput[3].error && (
									<p className="text-danger">Campo Obrigatório!</p>
								)}
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
			<br />
			<Row className="row-input-coleta-inicio">
				<Col sm={12} md={6} lg={6} xxl={6}>
					<FloatingLabel label="Ponto de Passagem 2" className="mb-3">
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
				<Col md={6} lg={6} className="input-ponto-passagem-coleta-entrega">
					<FloatingLabel label="Coleta/Entrega" className="mb-3">
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
				<Col md={6} lg={6}>
					<FloatingLabel label="*Previsão Início 2" className="mb-3">
						<Form.Control
							type="datetime-local"
							name="ponto_passagem2.previsao"
							value={formik.values.ponto_passagem2.previsao}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							isInvalid={isDateErrorInput[4]?.error}
							max="9999-12-12T00:00"
							onBlur={() => {
								validarDatas(formik.values.ponto_passagem2.previsao, 4);
							}}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				<Col md={6} lg={6}>
					<FloatingLabel label="*Previsão Fim 2" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem2.previsaoSaida"
							value={formik.values.ponto_passagem2.previsaoSaida}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							isInvalid={isDateErrorInput[5]?.error}
							max="9999-12-12T00:00"
							onBlur={() => {
								validarDatas(formik.values.ponto_passagem2.previsaoSaida, 5);
							}}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				{fkSituacao && (
					<>
						<Col xs={12} sm={6} md={4} lg={4}>
							<FloatingLabel label="*Data Coleta Início" className="mb-3">
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
									isInvalid={isDateErrorInput[6]?.error}
									max="9999-12-12T00:00"
									onBlur={() => {
										validarDatas(
											formik.values.ponto_passagem2.coletaEfetiva_mundo,
											6,
											formik.values.ponto_passagem2.id
										);
									}}
									disabled={disabledValidEfetiva}
									//required
								/>
								{isDateErrorInput[6]?.error && (
									<p className="text-danger">Campo Obrigatório!</p>
								)}
							</FloatingLabel>
						</Col>
						<Col xs={12} sm={6} md={4} lg={4}>
							<FloatingLabel label="*Data Coleta Fim" className="mb-3">
								<Form.Control
									className={colorInputEfetivo}
									type="datetime-local"
									placeholder=" "
									name="ponto_passagem2.coletaEfetivaSaida"
									value={formik.values.ponto_passagem2.coletaEfetivaSaida || ""}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									isInvalid={isDateErrorInput[7]?.error}
									max="9999-12-12T00:00"
									onBlur={() => {
										validarDatas(
											formik.values.ponto_passagem2.coletaEfetivaSaida,
											7,
											formik.values.ponto_passagem2.id
										);
									}}
									disabled={disabledValidEfetiva}
									//required
								/>
								{isDateErrorInput[7]?.error && (
									<p className="text-danger">Campo Obrigatório!</p>
								)}
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
			<br />
			<Row className="row-input-coleta-inicio">
				<Col sm={12} md={6} lg={6} xxl={6}>
					<FloatingLabel label="Ponto de Passagem 3" className="mb-3">
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
				<Col md={6} lg={6} className="input-ponto-passagem-coleta-entrega">
					<FloatingLabel label="Coleta/Entrega" className="mb-3">
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
				<Col md={6} lg={6}>
					<FloatingLabel label="*Previsão Início 3" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem3.previsao"
							value={formik.values.ponto_passagem3.previsao}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							isInvalid={isDateErrorInput[8]?.error}
							max="9999-12-12T00:00"
							onBlur={() => {
								validarDatas(formik.values.ponto_passagem3.previsao, 8);
							}}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				<Col md={6} lg={6}>
					<FloatingLabel label="*Previsão Fim 3" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem3.previsaoSaida"
							value={formik.values.ponto_passagem3.previsaoSaida}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							isInvalid={isDateErrorInput[9]?.error}
							max="9999-12-12T00:00"
							onBlur={() => {
								validarDatas(formik.values.ponto_passagem3.previsaoSaida, 9);
							}}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				{fkSituacao && (
					<>
						<Col xs={12} sm={6} md={4} lg={4}>
							<FloatingLabel label="*Data Coleta Início" className="mb-3">
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
									isInvalid={isDateErrorInput[10]?.error}
									max="9999-12-12T00:00"
									onBlur={() => {
										validarDatas(
											formik.values.ponto_passagem3.coletaEfetiva_peacao,
											10,
											formik.values.ponto_passagem3.id
										);
									}}
									disabled={disabledValidEfetiva}
									//required
								/>
								{isDateErrorInput[10]?.error && (
									<p className="text-danger">Campo Obrigatório!</p>
								)}
							</FloatingLabel>
						</Col>
						<Col xs={12} sm={6} md={4} lg={4}>
							<FloatingLabel label="*Data Coleta Fim" className="mb-3">
								<Form.Control
									className={colorInputEfetivo}
									type="datetime-local"
									placeholder=" "
									name="ponto_passagem3.coletaEfetivaSaida"
									value={formik.values.ponto_passagem3.coletaEfetivaSaida || ""}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									isInvalid={isDateErrorInput[11]?.error}
									max="9999-12-12T00:00"
									onBlur={() => {
										validarDatas(
											formik.values.ponto_passagem3.coletaEfetivaSaida,
											11,
											formik.values.ponto_passagem3.id
										);
									}}
									disabled={disabledValidEfetiva}
									//required
								/>
								{isDateErrorInput[11]?.error && (
									<p className="text-danger">Campo Obrigatório!</p>
								)}
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
			<br />
			{inputColeta5 && (
				<Row className="row-input-coleta">
					<div className="div-input-passagem">
						{inputPontoPassagem5 ? (
							<Col
								sm={12}
								md={6}
								lg={6}
								xxl={6}
								style={{ backgroundColor: fkSituacao ? "#e9ecef" : "#FFF" }}
								className="col-input-passagem"
							>
								<label>Ponto de Passagem 5</label>
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
							<Col xs={12} sm={12} md={6} lg={6} xxl={6}>
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
						<Col className="ponto-coleta-entrega">
							<FloatingLabel
								label="Coleta/Entrega"
								className="floating-coleta-entrega"
							>
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
					</div>
					<Col xs={12} sm={6} md={6} lg={6}>
						<FloatingLabel
							label="*Previsão Início 5"
							className="mb-3 previsao-inicio"
						>
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem5.previsao"
								value={formik.values.ponto_passagem5.previsao}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								isInvalid={isDateErrorInput[12]?.error}
								max="9999-12-12T00:00"
								onBlur={() => {
									validarDatas(formik.values.ponto_passagem5.previsao, 12);
								}}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					<Col xs={12} sm={6} md={6} lg={6}>
						<FloatingLabel
							label="*Previsão Fim 5"
							className="mb-3 previsao-fim"
						>
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem5.previsaoSaida"
								value={formik.values.ponto_passagem5.previsaoSaida}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								isInvalid={isDateErrorInput[13]?.error}
								max="9999-12-12T00:00"
								onBlur={() => {
									validarDatas(formik.values.ponto_passagem5.previsaoSaida, 13);
								}}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<>
							<Row>
								<Col xs={12} sm={6} md={4} lg={4}>
									<FloatingLabel
										label="Data Coleta/Entrega"
										className="data-coleta-entrega"
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
											isInvalid={isDateErrorInput[13]?.error}
											max="9999-12-12T00:00"
											onBlur={() => {
												validarDatas(
													formik.values.ponto_passagem5.coletaEfetiva,
													13,
													formik.values.ponto_passagem5.id
												);
											}}
											onKeyDown={handleEnter}
											disabled={disabledValidEfetiva}
											required
										/>
									</FloatingLabel>
								</Col>
								<Col xs={12} sm={6} md={4} lg={4}>
									<FloatingLabel
										label="*Data Coleta Fim"
										className="data-coleta-entrega-fim"
									>
										<Form.Control
											className={colorInputEfetivo}
											type="datetime-local"
											placeholder=" "
											name="ponto_passagem5.coletaEfetivaSaida"
											value={
												inputPontoPassagem5
													? formik.values.ponto_passagem5.coletaEfetivaSaida ||
													  ""
													: formik.values.ponto_passagem5.entregaEfetivaSaida ||
													  ""
											}
											onKeyDown={handleEnter}
											onChange={formik.handleChange}
											isInvalid={isDateErrorInput[14]?.error}
											max="9999-12-12T00:00"
											onBlur={() => {
												validarDatas(
													formik.values.ponto_passagem5.coletaEfetivaSaida,
													14,
													formik.values.ponto_passagem5.id
												);
											}}
											disabled={disabledValidEfetiva}
											//required
										/>
										{isDateErrorInput[14]?.error && (
											<p className="text-danger">Campo Obrigatório!</p>
										)}
									</FloatingLabel>
								</Col>
								<Col className="col-temp-servic-local">
									<FloatingLabel
										label="Duração processo"
										className="duracao-processo-2"
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
							</Row>
						</>
					)}
				</Row>
			)}
			{inputColeta6 && (
				<Row className="row-input-coleta">
					<div className="div-input-passagem">
						{inputPontoPassagem6 ? (
							<Col
								sm={12}
								md={6}
								style={{ backgroundColor: fkSituacao ? "#e9ecef" : "#FFF" }}
								className="col-input-passagem"
							>
								<label>Ponto de Passagem 6</label>
								<RotasSelect
									className="input-cod-local"
									placeholder=" "
									name="ponto_passagem6.ponto"
									value={
										formik.values.ponto_passagem6.ponto?.split("-")[1] || ""
									}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={fkSituacao}
									required
								/>
							</Col>
						) : (
							<Col sm={12} md={6} lg={6} xxl={6}>
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
						<Col className="ponto-coleta-entrega">
							<FloatingLabel
								label="Coleta/Entrega"
								className="floating-coleta-entrega"
							>
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
					</div>
					<Col xs={12} sm={6} md={6} lg={6}>
						<FloatingLabel
							label="*Previsão Início 6"
							className="mb-3 previsao-inicio"
						>
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem6.previsao"
								value={formik.values.ponto_passagem6.previsao}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								isInvalid={isDateErrorInput[15]?.error}
								max="9999-12-12T00:00"
								onBlur={() => {
									validarDatas(formik.values.ponto_passagem6.previsao, 15);
								}}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					<Col xs={12} sm={6} md={6} lg={6}>
						<FloatingLabel
							label="*Previsão Fim 6"
							className="mb-3 previsao-fim"
						>
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem6.previsaoSaida"
								value={formik.values.ponto_passagem6.previsaoSaida}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								isInvalid={isDateErrorInput[16]?.error}
								max="9999-12-12T00:00"
								onBlur={() => {
									validarDatas(formik.values.ponto_passagem6.previsaoSaida, 16);
								}}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<>
							<Row>
								<Col xs={12} sm={6} md={4} lg={4}>
									<FloatingLabel
										label="Data Coleta/Entrega"
										className="data-coleta-entrega"
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
											isInvalid={isDateErrorInput[17]?.error}
											max="9999-12-12T00:00"
											onBlur={() => {
												validarDatas(
													formik.values.ponto_passagem6.coletaEfetiva,
													17,
													formik.values.ponto_passagem6.id
												);
											}}
											onKeyDown={handleEnter}
											disabled={disabledValidEfetiva}
											required
										/>
									</FloatingLabel>
								</Col>
								<Col xs={12} sm={6} md={4} lg={4}>
									<FloatingLabel
										label="Data Coleta/Entrega Fim"
										className="data-coleta-entrega-fim"
									>
										<Form.Control
											className={colorInputEfetivo}
											type="datetime-local"
											placeholder=" "
											name="ponto_passagem6.entregaEfetivaSaida"
											value={
												inputPontoPassagem6
													? formik.values.ponto_passagem6.coletaEfetivaSaida ||
													  ""
													: formik.values.ponto_passagem6.entregaEfetivaSaida ||
													  ""
											}
											onKeyDown={handleEnter}
											onChange={formik.handleChange}
											isInvalid={isDateErrorInput[18]?.error}
											max="9999-12-12T00:00"
											onBlur={() => {
												validarDatas(
													formik.values.ponto_passagem6.entregaEfetivaSaida,
													18,
													formik.values.ponto_passagem6.id
												);
											}}
											disabled={disabledValidEfetiva}
											required
										/>
									</FloatingLabel>
								</Col>
								<Col className="col-temp-servic-local2">
									<FloatingLabel
										label="Duração processo"
										className="duracao-processo"
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
							</Row>
						</>
					)}
				</Row>
			)}
			{inputColeta7 && (
				<Row className="row-input-coleta">
					<div className="div-input-passagem">
						{inputPontoPassagem7 ? (
							<Col
								sm={12}
								md={6}
								style={{ backgroundColor: fkSituacao ? "#e9ecef" : "#FFF" }}
								className="col-input-passagem"
							>
								<label>Ponto de Passagem 7</label>
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
							<Col sm={12} md={6} lg={6} xxl={6}>
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
						<Col className="ponto-coleta-entrega">
							<FloatingLabel
								label="Coleta/Entrega"
								className="floating-coleta-entrega"
							>
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
					</div>
					<Col xs={12} sm={6} md={6} lg={6}>
						<FloatingLabel
							label="*Previsão Início 7"
							className="mb-3 previsao-inicio"
						>
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem7.previsao"
								value={formik.values.ponto_passagem7.previsao}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								isInvalid={isDateErrorInput[19]?.error}
								max="9999-12-12T00:00"
								onBlur={() => {
									validarDatas(formik.values.ponto_passagem7.previsao, 19);
								}}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					<Col xs={12} sm={6} md={6} lg={6}>
						<FloatingLabel
							label="*Previsão Fim 7"
							className="mb-3 previsao-fim"
						>
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem7.previsaoSaida"
								value={formik.values.ponto_passagem7.previsaoSaida}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								isInvalid={isDateErrorInput[20]?.error}
								max="9999-12-12T00:00"
								onBlur={() => {
									validarDatas(formik.values.ponto_passagem7.previsaoSaida, 20);
								}}
								required
								disabled={fkSituacao}
							/>
						</FloatingLabel>
					</Col>
					{fkSituacao && (
						<>
							<Row>
								<Col xs={12} sm={6} md={4} lg={4}>
									<FloatingLabel
										label="Data Coleta/Entrega"
										className="data-coleta-entrega"
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
								<Col xs={12} sm={6} md={4} lg={4}>
									<FloatingLabel
										label="Data Coleta/Entrega Fim"
										className="data-coleta-entrega-fim"
									>
										<Form.Control
											className={colorInputEfetivo}
											type="datetime-local"
											placeholder=" "
											name="ponto_passagem7.coletaEfetivaSaida"
											value={
												inputPontoPassagem7
													? formik.values.ponto_passagem7.coletaEfetivaSaida ||
													  ""
													: formik.values.ponto_passagem7.entregaEfetivaSaida ||
													  ""
											}
											onKeyDown={handleEnter}
											onChange={formik.handleChange}
											disabled={disabledValidEfetiva}
											required
										/>
									</FloatingLabel>
								</Col>
								<Col className="col-temp-servic-local2">
									<FloatingLabel
										label="Duração processo"
										className="duracao-processo"
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
							</Row>
						</>
					)}
				</Row>
			)}
			<Row className="row-input-coleta">
				<Col sm={12} md={6} lg={6} xxl={6}>
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
				<Col md={6} lg={6} className="input-ponto-passagem-coleta-entrega">
					<FloatingLabel label="Coleta/Entrega" className="mb-3">
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
				<Col xs={12} sm={6} md={6} lg={6}>
					<FloatingLabel label="*Previsão Início 4" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem4.previsao"
							value={formik.values.ponto_passagem4.previsao}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							isInvalid={isDateErrorInput[21]?.error}
							max="9999-12-12T00:00"
							onBlur={() => {
								validarDatas(formik.values.ponto_passagem4.previsao, 21);
							}}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				<Col xs={12} sm={6} md={6} lg={6}>
					<FloatingLabel label="*Previsão Fim 4" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem4.previsaoSaida"
							value={formik.values.ponto_passagem4.previsaoSaida}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							isInvalid={isDateErrorInput[22]?.error}
							max="9999-12-12T00:00"
							onBlur={() => {
								validarDatas(formik.values.ponto_passagem4.previsaoSaida, 22);
							}}
							required
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				{fkSituacao && (
					<>
						<Col xs={12} sm={6} md={6} lg={4}>
							<FloatingLabel label="*Data Entrega Início" className="mb-3">
								<Form.Control
									className={colorInputEfetivo}
									type="datetime-local"
									placeholder=" "
									name="ponto_passagem4.entregaEfetiva"
									value={formik.values.ponto_passagem4.entregaEfetiva || ""}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									isInvalid={isDateErrorInput[23]?.error}
									max="9999-12-12T00:00"
									onBlur={() => {
										validarDatas(
											formik.values.ponto_passagem4.entregaEfetiva,
											23,
											formik.values.ponto_passagem4.id
										);
									}}
									disabled={disabledValidEfetiva}
									//required
								/>
								{isDateErrorInput[23]?.error && (
									<p className="text-danger">Campo Obrigatório!</p>
								)}
							</FloatingLabel>
						</Col>
						<Col xs={12} sm={6} md={6} lg={4}>
							<FloatingLabel label="*Data Entrega Fim" className="mb-3">
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
									isInvalid={isDateErrorInput[24]?.error}
									max="9999-12-12T00:00"
									onBlur={() => {
										validarDatas(
											formik.values.ponto_passagem4.entregaEfetivaSaida,
											24,
											formik.values.ponto_passagem4.id
										);
									}}
									disabled={disabledValidEfetiva}
									//required
								/>
								{isDateErrorInput[24]?.error && (
									<p className="text-danger">Campo Obrigatório!</p>
								)}
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
