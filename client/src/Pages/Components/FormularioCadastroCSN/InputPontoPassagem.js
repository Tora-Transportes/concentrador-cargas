import React from "react";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";
import RotasSelect from "../FilialSelect/rotasSelect";

const InputsPontoMaterial = ({
	formik,
	inputColeta2,
	inputColeta3,
	inputColeta4,
	inputColeta5,
	inputColeta6,
}) => {
	return (
		<>
			<Row className="row-input-coleta">
				<Col sm={12} md={6} className="col-cod-local">
					<label>Ponto de passagem</label>
					<RotasSelect
						className="input-cod-local"
						//id="Codigo-filial pb-5"
						placeholder=" "
						name="ponto_passagem.ponto"
						value={formik.values.ponto_passagem.ponto}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						//required
					/>
				</Col>
				<Col>
					<FloatingLabel label="Coleta/Entrega" className="mb-3">
						<Form.Select
							name="ponto_passagem.tipoServico"
							value={formik.values.ponto_passagem.tipoServico}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							//required
						>
							<option value=""></option>
							<option value="Coleta">Coleta</option>
							<option value="Entrega">Entrega</option>
						</Form.Select>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Previsão" className="mb-3">
						<Form.Control
							type="datetime-local"
							placeholder=" "
							name="ponto_passagem.previsao"
							value={formik.values.ponto_passagem.previsao}
							onChange={formik.handleChange}
							//required
						/>
					</FloatingLabel>
				</Col>
			</Row>

			{inputColeta2 && (
				<Row className="row-input-coleta">
					<Col sm={12} md={6} className="col-cod-local">
						<label>Ponto de passagem 2</label>
						<RotasSelect
							className="input-cod-local"
							//id="Codigo-filial pb-5"
							placeholder=" "
							name="ponto_passagem2.ponto"
							value={formik.values.ponto_passagem2.ponto}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</Col>
					<Col>
						<FloatingLabel label="Coleta/Entrega" className="mb-3">
							<Form.Select
								name="ponto_passagem2.tipoServico"
								value={formik.values.ponto_passagem2.tipoServico}
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
						<FloatingLabel label="Previsão 2" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem2.previsao"
								value={formik.values.ponto_passagem2.previsao}
								onChange={formik.handleChange}
								//required
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
			{inputColeta3 && (
				<Row className="row-input-coleta">
					<Col sm={12} md={6} className="col-cod-local">
						<label>Ponto de passagem 3</label>
						<RotasSelect
							className="input-cod-local"
							//id="Codigo-filial pb-5"
							placeholder=" "
							name="ponto_passagem3.ponto"
							value={formik.values.ponto_passagem3.ponto}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</Col>
					<Col>
						<FloatingLabel label="Coleta/Entrega" className="mb-3">
							<Form.Select
								name="ponto_passagem3.tipoServico"
								value={formik.values.ponto_passagem3.tipoServico}
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
						<FloatingLabel label="Previsão" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem3.previsao"
								value={formik.values.ponto_passagem3.previsao}
								onChange={formik.handleChange}
								//required
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
			{inputColeta4 && (
				<Row className="row-input-coleta">
					<Col sm={12} md={6} className="col-cod-local">
						<label>Ponto de passagem 4</label>
						<RotasSelect
							className="input-cod-local"
							//id="Codigo-filial pb-5"
							placeholder=" "
							name="ponto_passagem4.ponto"
							value={formik.values.ponto_passagem4.ponto}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</Col>
					<Col>
						<FloatingLabel label="Coleta/Entrega" className="mb-3">
							<Form.Select
								name="ponto_passagem4.tipoServico"
								value={formik.values.ponto_passagem4.tipoServico}
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
						<FloatingLabel label="Previsão" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem4.previsao"
								value={formik.values.ponto_passagem4.previsao}
								onChange={formik.handleChange}
								//required
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
			{inputColeta5 && (
				<Row className="row-input-coleta">
					<Col sm={12} md={6} className="col-cod-local">
						<label>Ponto de passagem 5</label>
						<RotasSelect
							className="input-cod-local"
							//id="Codigo-filial pb-5"
							placeholder=" "
							name="ponto_passagem5.ponto"
							value={formik.values.ponto_passagem5.ponto}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</Col>
					<Col>
						<FloatingLabel label="Coleta/Entrega" className="mb-3">
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
						<FloatingLabel label="Previsão" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem5.previsao"
								value={formik.values.ponto_passagem5.previsao}
								onChange={formik.handleChange}
								//required
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
			{inputColeta6 && (
				<Row className="row-input-coleta">
					<Col sm={12} md={6} className="col-cod-local">
						<label>Ponto de passagem 6</label>
						<RotasSelect
							className="input-cod-local"
							//id="Codigo-filial pb-5"
							placeholder=" "
							name="ponto_passagem6.ponto"
							value={formik.values.ponto_passagem6.ponto}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</Col>
					<Col>
						<FloatingLabel label="Coleta/Entrega" className="mb-3">
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
						<FloatingLabel label="Previsão" className="mb-3">
							<Form.Control
								type="datetime-local"
								placeholder=" "
								name="ponto_passagem6.previsao"
								value={formik.values.ponto_passagem6.previsao}
								onChange={formik.handleChange}
								//required
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
		</>
	);
};

export default InputsPontoMaterial;
