import React, { useEffect } from "react";
import {
	Form,
	Row,
	Col,
	FloatingLabel,
	OverlayTrigger,
	Tooltip,
} from "react-bootstrap";
import { IoMdHelpCircle } from "react-icons/io";
import InputLocalizacao from "../InputLocalizacao";
import AutocompleteInput from "../AutocompleteInput";
import InputCliente from "../InputCliente";
import UnidadesMedida from "../UnidadesMedida";
import InputPlaca from "../InputPlaca";

function FormularioCadastroManual({
	formik,
	produtos,
	distancia,
	handleSearchDistance,
	disabledFields = [],
}) {
	useEffect(() => {
		if (formik.values.e_lote) {
			formik.setFieldValue("placa_veiculo", "");
		}
	}, [formik.values.e_lote]);

	return (
		<>
			<Row>
				<Col>
					<FloatingLabel label="*Responsável pelo cadastro" className="mb-3">
						<Form.Control
							type="text"
							placeholder=" "
							name="responsavel_cadastro"
							value={formik.values.responsavel_cadastro}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
							disabled
						/>
					</FloatingLabel>
				</Col>
				<Col md={4} sm={12}>
					<FloatingLabel label="*Código da carga" className="mb-3">
						<Form.Control
							type="text"
							placeholder=" "
							disabled
							name="id"
							value={formik.values.id}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col>
					<hr />
					<Form.Group className="mb-3">
						*É Lote ?{" "}
						<Form.Check
							type="radio"
							label="Sim"
							name="e_lote"
							id="e_lote_sim"
							onChange={() => formik.setFieldValue("e_lote", true)}
							checked={formik.values.e_lote === true}
							inline
							disabled={disabledFields.includes("e_lote")}
						/>
						<Form.Check
							type="radio"
							label="Não"
							name="e_lote"
							id="e_lote_nao"
							onChange={() => formik.setFieldValue("e_lote", false)}
							checked={formik.values.e_lote === false}
							inline
							disabled={disabledFields.includes("e_lote")}
						/>
						<OverlayTrigger
							key="tooltip-overlay-lote"
							placement="bottom"
							overlay={
								<Tooltip id={`tooltip-bottom`}>
									O campo Lote é para sinalizar o tipo de carga. Quando o lote é
									Sim (Representa uma quantidade expressiva de volume de cargas
									que devem ser retiradas). Quando Lote é Não (Representa uma
									carga com um volume único).
								</Tooltip>
							}
						>
							<span>
								<IoMdHelpCircle size={20} />
							</span>
						</OverlayTrigger>
						<br />
						<sub>
							Deve ser cadastrada a quantidade <strong>total</strong> da carga.
						</sub>
					</Form.Group>
				</Col>
			</Row>
			<hr className="mb-5" />
			{!formik.values.e_lote && (
				<Row className="mb-5">
					<Col sm={12}>
						<h3>Dados do veículo</h3>
					</Col>
					<Col sm={12}>
						<InputPlaca
							placeholder="Placa veículo"
							disabled={formik.values.e_lote}
							type="text"
							name="placa_veiculo"
							value={formik.values.placa_veiculo}
							onChange={formik.handleChange}
						/>
					</Col>
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
					<hr className="mt-5" />
				</Row>
			)}
			<Row>
				<Col>
					<InputCliente
						type="text"
						placeholder=" "
						name="cliente"
						value={formik.values.cliente}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						required
					/>
				</Col>
			</Row>
			<Row>
				<Col sm={12} md={6}>
					<FloatingLabel label="*Origem carga" className="mb-3">
						<InputLocalizacao
							keyDataList="origem_carga"
							type="text"
							placeholder=" "
							name="origem_carga"
							value={formik.values.origem_carga}
							onChange={formik.handleChange}
							onBlur={() => handleSearchDistance(formik.values)}
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="*Destino carga" className="mb-3">
						<InputLocalizacao
							keyDataList="destino_carga"
							type="text"
							placeholder=" "
							name="destino_carga"
							value={formik.values.destino_carga}
							onChange={formik.handleChange}
							onBlur={() => handleSearchDistance(formik.values)}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col sm={12} md={6}>
					<FloatingLabel label="*Local coleta" className="mb-3">
						<Form.Control
							type="text"
							placeholder=" "
							name="local_coleta"
							value={formik.values.local_coleta}
							onChange={formik.handleChange}
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="*Local entrega" className="mb-3">
						<Form.Control
							type="text"
							placeholder=" "
							name="local_entrega"
							value={formik.values.local_entrega}
							onChange={formik.handleChange}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>
			{distancia && (
				<Row>
					<Col>
						<FloatingLabel
							label="Distancia entre a origem e o destino"
							className="mb-3"
						>
							<Form.Control
								type="text"
								placeholder=" "
								value={`A distancia entre ${
									formik.values.origem_carga.split("/")[2]
								} e ${
									formik.values.destino_carga.split("/")[2]
								} é de ${distancia} KM.`}
								readOnly
							/>
							<Form.Text id="passwordHelpBlock" muted>
								O valor apresentado representa a distancia de centro a centro.
							</Form.Text>
						</FloatingLabel>
						<hr />
					</Col>
				</Row>
			)}
			<Row>
				<Col>
					<FloatingLabel label="Data coleta" className="mb-3">
						<Form.Control
							type="date"
							placeholder=" "
							name="data_coleta"
							value={formik.values.data_coleta}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Data entrega" className="mb-3">
						<Form.Control
							type="date"
							placeholder=" "
							name="data_entrega"
							value={formik.values.data_entrega}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
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
								onBlur={formik.handleBlur}
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
								onBlur={formik.handleBlur}
							/>
						</FloatingLabel>
					</Col>
				</Row>
			)}
			<Row>
				<Col sm={12} md={6}>
					<FloatingLabel label="Tipo material" className="mb-3">
						<AutocompleteInput
							keyDataList="tipo_carga"
							options={produtos.filter((i) => !!i.ativo).map((i) => i.nome)}
							onChange={formik.handleChange}
							value={formik.values.tipo_carga}
							name="tipo_carga"
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<Row>
						<Col>
							<FloatingLabel label="*Unidade" className="mb-3">
								<Form.Select
									name="unidade_medida"
									value={formik.values.unidade_medida}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									required
									disabled={disabledFields.includes("unidade_medida")}
								>
									<option value=""></option>
									<UnidadesMedida />
								</Form.Select>
							</FloatingLabel>
						</Col>
						<Col>
							<FloatingLabel label="*Quantidade" className="mb-3">
								<Form.Control
									type="number"
									min={1}
									step={0.01}
									placeholder=" "
									name="quantidade"
									value={formik.values.quantidade}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={disabledFields.includes("quantidade")}
									required
								/>
							</FloatingLabel>
						</Col>
					</Row>
				</Col>
			</Row>

			<hr className="mb-5 mt-5" />

			<Row>
				<Col>
					<Form.Group className="mb-3">
						<Form.Label>Pré-Requisitos e Acessórios do veículo</Form.Label>
						<Form.Control
							placeholder="Neste campo é adicionado informações, Exemplo: Motorista necessita de treinamento atualizado no cliente, cinta e luvas"
							as="textarea"
							rows={3}
							name="acessorios_requisitos"
							value={formik.values.acessorios_requisitos || ""}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</Form.Group>
				</Col>
			</Row>

			<Row>
				<Col>
					<Form.Group className="mb-3">
						<Form.Label>Informações Restritivas do Veículo</Form.Label>
						<Form.Control
							placeholder="Neste campo é adicionado informações, Exemplo: Proibido entrada de rodotrem"
							as="textarea"
							rows={3}
							name="informacoes_restritivas"
							value={formik.values.informacoes_restritivas || ""}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</Form.Group>
				</Col>
			</Row>

			<Row>
				<Col>
					<Form.Group className="mb-3">
						<Form.Label>Observações Complementares</Form.Label>
						<Form.Control
							placeholder="Neste campo é adicionado informações, Exemplo: Frete será pago por peso"
							as="textarea"
							rows={3}
							name="observacao"
							value={formik.values.observacao || ""}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</Form.Group>
				</Col>
			</Row>
		</>
	);
}

export default FormularioCadastroManual;
