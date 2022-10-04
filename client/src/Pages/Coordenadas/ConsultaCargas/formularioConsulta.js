import React, { useEffect } from "react";
import { Form, Row, Col, FloatingLabel, InputGroup } from "react-bootstrap";
//import AutocompleteInput from "src/Pages/Components/AutocompleteInput";
import FilialSelect from "src/Pages/Components/FilialSelect";
import InputCliente from "src/Pages/Components/InputCliente";
import InputLocalizacao from "src/Pages/Components/InputLocalizacao";
import InputPlaca from "src/Pages/Components/InputPlaca";
import "../ConsultaCargas/consultaCarga.css";

function FormularioConsulta({ formik }) {
	//const [addDestinoInterme, setAddDestinoInterme] = useState(false);
	useEffect(() => {
		if (formik.values.e_lote) {
			formik.setFieldValue("placa_veiculo", null);
			formik.setFieldValue("placa_carreta", null);
			formik.setFieldValue("placa_bitrem", null);
			formik.setFieldValue("codigo_motorista", null);
			formik.setFieldValue("nome_motorista", null);
		}
	}, [formik.values.e_lote]);

	return (
		<div className="class-body-form">
			<Row>
				<Col>
					<FloatingLabel label="Responsável pelo cadastro" className="mb-3">
						<Form.Control
							type="text"
							placeholder=" "
							name="responsavel_cadastro"
							value={formik.values.responsavel_cadastro}
							onChange={formik.handleChange}
							required
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col md={4} sm={12}>
					<FloatingLabel label="Código da carga" className="mb-3">
						<Form.Control
							type="text"
							placeholder=" "
							disabled
							value={formik.values.id}
							onChange={formik.handleChange}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col sm={12} md={4}>
					<FloatingLabel label=" Código da filial" className="mb-3">
						<FilialSelect
							placeholder=" "
							name="fk_filial"
							value={formik.values.fk_filial ?? ""}
							onChange={formik.handleChange}
							required
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col sm={12} md={4}>
					<FloatingLabel label="Documento de transporte" className="mb-3">
						<Form.Control
							name="documento_transporte"
							value={String(formik.values.documento_transporte)}
							onChange={formik.handleChange}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="È Lote" className="mb-3">
						<Form.Control
							name="e_lote"
							value={formik.values.e_lote === false ? "Não" : "Sim"}
							onChange={formik.handleChange}
							disabled
						/>
					</FloatingLabel>
				</Col>
				{/* <Col>
					<Form.Group className="mt-3">
						*É Lote?{" "}
						<Form.Check
							type="radio"
							label="Sim"
							name="e_lote"
							onChange={() => formik.setFieldValue("e_lote", true)}
							checked={formik.values.e_lote === true}
							inline
							disabled
						/>
						<Form.Check
							type="radio"
							label="Não"
							name="e_lote"
							onChange={() => formik.setFieldValue("e_lote", false)}
							checked={formik.values.e_lote === false}
							inline
							disabled
						/>
					</Form.Group>
				</Col> */}
			</Row>
			<div className="class-linha-title3">
				<hr className="w-100" />
			</div>
			{!formik.values.e_lote && (
				<>
					<Row className="mb-5">
						<Col sm={12}>
							<h3 className="title-dados-veic">Dados do veículo</h3>
						</Col>
					</Row>
					<Row>
						<Col sm={12} md={6}>
							<InputPlaca
								className="input-placaCav"
								readOnly={
									formik.values.fk_situacao &&
									![1, 2, 4].includes(Number(formik.values.fk_situacao))
								}
								placeholder="Placa veículo"
								disabled
								type="text"
								name="placa_veiculo"
								value={formik.values.placa_veiculo}
								onChange={formik.handleChange}
							/>
						</Col>
						<Col>
							<InputGroup className="input-carreta mb-2">
								<InputGroup.Text>Carreta</InputGroup.Text>
								<Form.Control
									readOnly
									placeholder="Placa Carreta"
									type="text"
									value={formik.values.placa_carreta || ""}
								/>
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col sm={12} md={6}>
							<InputGroup className="input-bitrem mb-4">
								<InputGroup.Text>Bitrem</InputGroup.Text>
								<Form.Control
									readOnly
									placeholder="Placa Bitrem"
									type="text"
									value={formik.values.placa_bitrem || ""}
								/>
							</InputGroup>
						</Col>
						<Col className="mb-3">
							<InputGroup className="class-input-moto">
								<InputGroup.Text>Motorista</InputGroup.Text>
								<Form.Control
									readOnly
									placeholder="Motorista"
									type="text"
									value={
										formik.values.codigo_motorista &&
										formik.values.nome_motorista
											? `${formik.values.codigo_motorista} - ${formik.values.nome_motorista}`
											: ""
									}
								/>
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							{formik.values.observacao_gr && (
								<FloatingLabel label="Observacao GR" className="mb-3">
									<Form.Control
										as="textarea"
										type="text"
										value={formik.values.observacao_gr}
										readOnly
									/>
								</FloatingLabel>
							)}
						</Col>
						<div className="class-linha-title4">
							<hr className="w-100" />
						</div>
					</Row>
				</>
			)}
			<Row>
				<Col>
					<InputCliente
						type="text"
						placeholder=" "
						name="cliente"
						value={formik.values.cliente}
						onChange={formik.handleChange}
						required
						disabled
					/>
				</Col>
			</Row>
			<Row>
				<Col sm={12} md={6}>
					<FloatingLabel label="Origem da carga" className="mb-3">
						<InputLocalizacao
							keyDataList="origem_carga"
							type="text"
							placeholder=" "
							name="origem_carga"
							value={formik.values.origem_carga}
							onChange={formik.handleChange}
							required
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col sm={12} md={6}>
					<FloatingLabel label="Destino final da carga" className="mb-3">
						<InputLocalizacao
							keyDataList="destino_carga"
							type="text"
							placeholder=" "
							name="destino_carga"
							value={formik.values.destino_carga}
							onChange={formik.handleChange}
							className="text-primary"
							required
							disabled
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col>
					<FloatingLabel label="Data da coleta" className="mb-3">
						<Form.Control
							type="date"
							placeholder=" "
							name="data_coleta"
							value={formik.values.data_coleta}
							onChange={formik.handleChange}
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Data de entrega" className="mb-3">
						<Form.Control
							type="date"
							placeholder=" "
							name="data_entrega"
							value={formik.values.data_entrega}
							onChange={formik.handleChange}
							disabled
						/>
					</FloatingLabel>
				</Col>
			</Row>
			{!formik.values.e_lote && (
				<Row>
					<Col>
						<FloatingLabel label="Janela Coleta" className="mb-3">
							<Form.Control
								type="time"
								placeholder=" "
								name="janela_coleta"
								value={formik.values.janela_coleta}
								onChange={formik.handleChange}
								disabled
							/>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="Janela Entrega" className="mb-3">
							<Form.Control
								type="time"
								placeholder=" "
								name="janela_entrega"
								value={formik.values.janela_entrega}
								onChange={formik.handleChange}
								disabled
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
			<Row>
				<Col sm={12} md={6}>
					<FloatingLabel label="Quantidade" className="mb-3">
						<Form.Control
							type="text"
							placeholder=" "
							name="tipo_carga"
							onChange={formik.handleChange}
							value={formik.values.tipo_carga}
							disabled
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<Row>
						<Col>
							<FloatingLabel label="Unidade" className="mb-3">
								<Form.Control
									type="text"
									placeholder=" "
									name="unidade_medida"
									value={formik.values.unidade_medida}
									onChange={formik.handleChange}
									required
									disabled
								/>
							</FloatingLabel>
						</Col>
						<Col>
							<FloatingLabel label="Quantidade" className="mb-3">
								<Form.Control
									type="number"
									min={1}
									step={0.01}
									placeholder=" "
									name="quantidade"
									value={formik.values.quantidade}
									onChange={formik.handleChange}
									disabled
									required
								/>
							</FloatingLabel>
						</Col>
					</Row>
				</Col>
			</Row>

			<div className="class-linha-title6">
				<hr className="w-100" />
			</div>

			<Row>
				<Col>
					<Form.Group className="mb-3">
						<Form.Label>Pré-requisitos e acessórios do veículo</Form.Label>
						<Form.Control
							placeholder="Adicione restrições e/ou acessórios do veículo caso necessário, exemplo(s): motorista necessita de treinamento atualizado no cliente, cinta, luvas, etc."
							as="textarea"
							rows={3}
							name="acessorios_requisitos"
							value={formik.values.acessorios_requisitos || ""}
							onChange={formik.handleChange}
							disabled
						/>
					</Form.Group>
				</Col>
			</Row>

			<Row>
				<Col>
					<Form.Group className="mb-3">
						<Form.Label>Informações restritivas do veículo</Form.Label>
						<Form.Control
							placeholder="Adicione as informções restritivas do veículo, se houver, exemplo: proibido entrada de rodotrem."
							as="textarea"
							rows={3}
							name="informacoes_restritivas"
							value={formik.values.informacoes_restritivas || ""}
							onChange={formik.handleChange}
							disabled
						/>
					</Form.Group>
				</Col>
			</Row>

			<Row>
				<Col>
					<Form.Group className="mb-3">
						<Form.Label>Observações complementares</Form.Label>
						<Form.Control
							placeholder="Adicione aqui as observações complementares, exemplo: frete será pago por peso."
							as="textarea"
							rows={3}
							name="observacao"
							value={formik.values.observacao || ""}
							onChange={formik.handleChange}
							disabled
						/>
					</Form.Group>
				</Col>
			</Row>
		</div>
	);
}

export default FormularioConsulta;
