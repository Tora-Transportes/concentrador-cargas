import React from "react";
import { Form, Row, Col, FloatingLabel, Table, Button } from "react-bootstrap";
import { FaDownload, FaExclamationTriangle } from "react-icons/fa";
import PaginatedTableInfratores from "../Infratores";
import { FaRegTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import BtnRefresh from "../btnAtualizar";

function FormularioNotificacao({
	formik,
	indicarCondutor,
	excluirCondutor,
	regerarInfratores,
}) {
	async function removerCondutor(condutor) {
		excluirCondutor(condutor);
	}
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
				{formik.values.existeInfrator ? (
					<div style={{ width: "40px", marginRight: "35px" }}>
						<Button
							variant="outline-primary"
							color=""
							onClick={async (e) => {
								e.preventDefault();
								const resultOk = await swal(
									`Certeza que deseja remover o infrator ${formik.values.motorista_nome}?`,
									{
										dangerMode: true,
										buttons: ["Cancelar", true],
										icon: "warning",
									}
								);
								if (resultOk) {
									removerCondutor(formik.values);
								}
							}}
							style={{
								color: "red",
								borderColor: "red",
								backgroundColor: "transparent",
							}}
						>
							<FaRegTrashAlt
								style={{
									marginLeft: "5px",
									marginTop: "15px",
									marginBottom: "10px",
								}}
								className="icon-info"
							/>
						</Button>
					</div>
				) : (
					<></>
				)}

				<Col>
					<FloatingLabel label="Matricula / CPF" className="mb-3">
						<Form.Control
							id="motorista_matricula"
							type="text"
							placeholder=" "
							name="motorista_matricula"
							value={
								formik.values.motorista_matricula
									? formik.values.motorista_matricula
									: formik.values.infrator
									? formik.values?.infrator?.cpf
									: ""
							}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row style={{ marginTop: "40px" }}>
				<BtnRefresh
					callback={regerarInfratores}
					params={formik.values}
					textoHeader={"Infratores"}
					texto={"Atualizar Infratores"}
					titulo={false}
				></BtnRefresh>
				<hr />
				<PaginatedTableInfratores
					data={formik.values?.infratores || []}
					notificacao={formik.values}
					indicarCondutor={indicarCondutor}
				></PaginatedTableInfratores>
			</Row>
			{/* Seção para os dados de Status */}
			<Row style={{ marginTop: "40px" }}>
				<BtnRefresh
					callback={() => {
						setTimeout(() => {}, 3000);
					}}
					params={{}}
					textoHeader={"Status - SMARTEC"}
					texto={"Forçar Atualização Status"}
					titulo={false}
				></BtnRefresh>
				<hr />
				<Col>
					<FloatingLabel label="ID Status" className="mb-3">
						<Form.Control
							id="status.id"
							type="text"
							placeholder=" "
							name="status.id"
							value={formik.values.status?.id || ""}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="AIT" className="mb-3">
						<Form.Control
							id="status.ait"
							type="text"
							placeholder=" "
							name="status.ait"
							value={formik.values.status?.ait || ""}
							disabled
						/>
					</FloatingLabel>
				</Col>
			</Row>

			<Row>
				<Col>
					<FloatingLabel label="Renavam" className="mb-3">
						<Form.Control
							id="status.renavam"
							type="text"
							placeholder=" "
							name="status.renavam"
							value={formik.values.status?.renavam || ""}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Placa" className="mb-3">
						<Form.Control
							id="status.placa"
							type="text"
							placeholder=" "
							name="status.placa"
							value={formik.values.status?.placa || ""}
							disabled
						/>
					</FloatingLabel>
				</Col>
			</Row>

			<Row>
				<Col>
					<FloatingLabel label="Status" className="mb-3">
						<Form.Control
							id="status.status"
							type="text"
							placeholder=" "
							name="status.status"
							value={formik.values.status?.status || ""}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Data Vencimento" className="mb-3">
						<Form.Control
							id="status.data_vencimento"
							type="date"
							name="status.data_vencimento"
							value={formik.values.status?.data_vencimento || ""}
							disabled
						/>
					</FloatingLabel>
				</Col>
			</Row>

			<Row>
				<Col>
					<FloatingLabel label="Valor a Pagar" className="mb-3">
						<Form.Control
							id="status.valor_a_pagar"
							type="number"
							placeholder=" "
							name="status.valor_a_pagar"
							value={formik.values.status?.valor_a_pagar || ""}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					{formik.values.status?.boleto_url ? (
						<a
							href={formik.values.status?.boleto_url}
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
					<FloatingLabel label="Código Boleto" className="mb-3">
						<Form.Control
							id="status.codigo_boleto"
							type="text"
							placeholder=" "
							name="status.codigo_boleto"
							value={formik.values.status?.codigo_boleto || ""}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Situação Boleto" className="mb-3">
						<Form.Control
							id="status.situacao_boleto"
							type="text"
							placeholder=" "
							name="status.situacao_boleto"
							value={formik.values.status?.situacao_boleto || ""}
							disabled
						/>
					</FloatingLabel>
				</Col>
			</Row>

			<Row style={{ marginTop: "40px" }}>
				<h4>Status Histórico - SMARTEC</h4>
				<hr />
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>AIT</th>
							<th>Status</th>
							<th>Hora</th>
							<th>Usuário</th>
						</tr>
					</thead>
					<tbody>
						{formik.values.statusHistorico.map((historico, index) => (
							<tr key={index}>
								<td>{historico.ait}</td>
								<td>{historico.status}</td>
								<td>{historico.created_at}</td>
								<td>{historico.cod_usu_create}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Row>
		</div>
	);
}

export default FormularioNotificacao;
