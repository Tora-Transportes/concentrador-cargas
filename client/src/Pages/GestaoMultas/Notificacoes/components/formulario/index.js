import React from "react";
import { Form, Row, Col, FloatingLabel } from "react-bootstrap";
import { FaDownload, FaExclamationTriangle } from "react-icons/fa";

function FormularioNotificacao({ formik }) {
	return (
		<div className="class-body-form">
			<Row>
				<Col>
					<FloatingLabel label="AIT" className="mb-3">
						<Form.Control
							id="ait"
							type="text"
							placeholder=" "
							name="ait"
							value={formik.values.ait}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Empresa" className="mb-3">
						<Form.Control
							id="empresa.nome"
							type="text"
							placeholder=" "
							name="empresa.nome"
							value={formik.values.empresa?.nome || ""}
							disabled
						/>
					</FloatingLabel>
				</Col>
			</Row>

			<Row>
				<Col>
					<FloatingLabel label="Placa" className="mb-3">
						<Form.Control
							id="placa"
							type="text"
							placeholder=" "
							name="placa"
							value={formik.values.placa}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Renavam" className="mb-3">
						<Form.Control
							id="renavam"
							type="text"
							placeholder=" "
							name="renavam"
							value={formik.values.renavam}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>

			<Row>
				<Col>
					<FloatingLabel label="Data da Infração" className="mb-3">
						<Form.Control
							id="data_infracao"
							type="date"
							name="data_infracao"
							value={formik.values.data_infracao}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Hora" className="mb-3">
						<Form.Control
							id="hora"
							type="time"
							name="hora"
							value={formik.values.hora}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Local" className="mb-6">
						<Form.Control
							id="local"
							type="text"
							placeholder=" "
							name="local"
							value={formik.values.local}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>

			<Row></Row>

			<Row>
				<Col>
					<FloatingLabel label="Município" className="mb-3">
						<Form.Control
							id="municipio"
							type="text"
							placeholder=" "
							name="municipio"
							value={formik.values.municipio}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="UF" className="mb-1">
						<Form.Control
							id="uf"
							type="text"
							placeholder=" "
							name="uf"
							value={formik.values.uf}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Código Infração" className="mb-3">
						<Form.Control
							id="codigo_infracao"
							type="text"
							placeholder=" "
							name="codigo_infracao"
							value={formik.values.codigo_infracao}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Pontuação" className="mb-3">
						<Form.Control
							id="pontuacao"
							type="number"
							placeholder=" "
							name="pontuacao"
							value={formik.values.pontuacao}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Valor a Pagar" className="mb-3">
						<Form.Control
							id="valor_a_pagar"
							type="number"
							placeholder=" "
							name="valor_a_pagar"
							value={formik.values.valor_a_pagar}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col>
					<FloatingLabel label="Orgão Autuador" className="mb-3">
						<Form.Control
							id="orgao_autuador"
							type="text"
							placeholder=" "
							name="orgao_autuador"
							value={formik.values.orgao_autuador}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Prazo Indicação" className="mb-3">
						<Form.Control
							id="prazo_indicacao"
							type="date"
							name="prazo_indicacao"
							value={formik.values.prazo_indicacao}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>

			<Row>
				<Col>
					{formik.values.notificacao ? (
						<a
							href={formik.values.notificacao}
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-link"
							title="Download Notificação PDF"
						>
							<FaDownload size={24} /> Download Notificação PDF
						</a>
					) : (
						<div className="text-muted">
							<FaExclamationTriangle size={24} color="gray" /> PDF de
							notificação não disponível
						</div>
					)}
				</Col>
				<Col>
					{formik.values.boleto ? (
						<a
							href={formik.values.boleto}
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-link"
							title="Download Boleto PDF"
						>
							<FaDownload size={24} /> Download Boleto PDF
						</a>
					) : (
						<div className="text-muted">
							<FaExclamationTriangle size={24} color="gray" /> PDF de boleto não
							disponível
						</div>
					)}
				</Col>
			</Row>
			<Row>
				<Col>
					<FloatingLabel label="Situação do Boleto" className="mb-3">
						<Form.Control
							id="situacao_boleto"
							type="text"
							placeholder=" "
							name="situacao_boleto"
							value={formik.values.situacao_boleto}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Linha Digitável" className="mb-3">
						<Form.Control
							id="linha_digitavel"
							type="text"
							placeholder=" "
							name="linha_digitavel"
							value={formik.values.linha_digitavel}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>

			<Row>
				<Col>
					<FloatingLabel label="Motorista" className="mb-3">
						<Form.Control
							id="motorista_nome"
							type="text"
							placeholder=" "
							name="motorista_nome"
							value={formik.values.motorista_nome}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>
		</div>
	);
}

export default FormularioNotificacao;
