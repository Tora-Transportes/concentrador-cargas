import { useEffect, useState } from "react";
import {
	Button,
	Card,
	Col,
	FloatingLabel,
	Form,
	InputGroup,
	ListGroup,
	ListGroupItem,
	Modal,
	OverlayTrigger,
	Row,
	Tooltip,
} from "react-bootstrap";
import { IoMdAdd, IoMdHelpCircle } from "react-icons/io";
import AutocompleteInput from "../AutocompleteInput";
import FilialSelect from "../FilialSelect";
import InputCliente from "../InputCliente";
import InputPlaca from "../InputPlaca";
import InputsPontoPassagem from "./InputPontoPassagem";
import "./formularioCadastroCSN.css";

export default function ViewsForm({
	formik,
	buscarCargaComDocumentoDeTransporte,
	handleSearchVehicle,
	handleShowDetailsAboutVehicle,
	handleShowDebitAboutVehicle,
	produtos,
	inputColeta5,
	inputColeta6,
	inputColeta7,
	viewsButtonAddColeta,
	functionInputs,
	viewsButtonExcluir,
	veiculo,
	debitosVeiculo,
	setDebitosVeiculo,
	setVeiculo,
	isDetalhesCarreta,
	valorTotalDebito,
	fkSituacao,
	isPermissionUserEdit,
	isDateErrorInput,
	setDateErrorInput,
	isViwsCargaApp,
	isAlteracaoParcial,
	isDisabledEnvioApp,
	isCargaApp,
	isDisabledPlaca,
	setDisabledPlaca,
}) {
	const [isRequiredPlaca, setRequiredPlaca] = useState(true);

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

	const DetalhesCargaApp = (e) => {
		const decisaoEnvioCarga = e.target.checked;
		if (decisaoEnvioCarga) {
			setTimeout(() => {
				formik.setFieldValue("placa_veiculo", null);
				formik.setFieldValue("placa_carreta", null);
				formik.setFieldValue("placa_bitrem", null);
				formik.setFieldValue("codigo_motorista", null);
				formik.setFieldValue("nome_motorista", null);
				formik.setFieldValue("rastreador", null);
			}, 500);
		}
		const cargaEnviarApp = 1;
		const cargaNaoEnviarApp = 0;
		setDisabledPlaca(decisaoEnvioCarga);
		setRequiredPlaca(!decisaoEnvioCarga);
		const valorCargaAppFormik = decisaoEnvioCarga
			? cargaEnviarApp
			: cargaNaoEnviarApp;
		formik.setFieldValue("carga_app", valorCargaAppFormik);
	};

	useEffect(() => {
		if (isCargaApp) {
			setDisabledPlaca(true);
			setRequiredPlaca(false);
		}
	}, [isCargaApp]);

	const titleInfoPlaca = isDetalhesCarreta
		? "Dados do Veículo / Dados Carreta"
		: "Dados do Veículo";

	return (
		<div className="class-body-form">
			<Row>
				<Col>
					<FloatingLabel label="*Responsável pelo Cadastro" className="mb-3">
						<Form.Control
							id="campo-aut"
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
					<FloatingLabel label="*Código da Carga" className="mb-3">
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
				<Col
					md={6}
					sm={12}
					style={{ backgroundColor: fkSituacao ? "#e9ecef" : "#FFF" }}
					className="codigo-filial-csn"
				>
					<label>*Código da Filial</label>
					<FilialSelect
						id="Codigo-filial"
						className="input-cod-filial2"
						placeholder=" "
						name="fk_filial"
						value={formik.values.fk_filial ?? ""}
						onKeyDown={handleEnter}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						disabled={fkSituacao}
						required
					/>
				</Col>
				<Col>
					<FloatingLabel label="Documento de Transporte" className="mb-3">
						<Form.Control
							id="doc-trans"
							name="documento_transporte"
							value={String(formik.values.documento_transporte)}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							disabled={fkSituacao}
							onBlur={(...rest) => {
								formik.handleBlur(...rest);
								buscarCargaComDocumentoDeTransporte(formik.values);
							}}
						/>
					</FloatingLabel>
				</Col>
			</Row>
			{!fkSituacao && (
				<Row>
					<div className="class-linha-title2">
						<hr className="w-100"></hr>
					</div>
					<Col>
						<Form.Group className="mb-3">
							*É Lote?{" "}
							<Form.Check
								type="radio"
								label="Sim"
								name="e_lote"
								id="e_lote_sim"
								onChange={() => formik.setFieldValue("e_lote", true)}
								onKeyDown={handleEnter}
								checked={formik.values.e_lote === true}
								inline
							/>
							<Form.Check
								type="radio"
								label="Não"
								name="e_lote"
								id="e_lote_nao"
								onChange={() => formik.setFieldValue("e_lote", false)}
								onKeyDown={handleEnter}
								checked={formik.values.e_lote === false}
								inline
							/>
							<OverlayTrigger
								key="tooltip-overlay-lote"
								placement="bottom"
								overlay={
									<Tooltip id={`tooltip-bottom`}>
										O campo Lote sinaliza o tipo de carga. Quando o lote é Sim
										(Representa uma quantidade expressiva de volume de cargas
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
								Deve ser cadastrada a quantidade <strong>total</strong> da
								carga.
							</sub>
						</Form.Group>
					</Col>
					{isViwsCargaApp && (
						<Col className="text-end">
							<Form.Group className="mb-3">
								*Enviar carga para o App?
								<Form.Check
									type="switch"
									name="carga_app"
									//defaultValue={false}
									checked={formik.values.carga_app === 1}
									onClick={(e) => DetalhesCargaApp(e)}
									onKeyDown={handleEnter}
									disabled={isDisabledEnvioApp}
									inline
									readOnly
								/>
								<OverlayTrigger
									key="tooltip-overlay-carga-app"
									placement="bottom"
									overlay={
										<Tooltip id={`tooltip-bottom`}>
											Esse campo define se a carga será enviada ou não para o
											App. Quando este campo é selecionado a carga será
											disponibilizada para visualização e modificação no App de
											cargas.
										</Tooltip>
									}
								>
									<span>
										<IoMdHelpCircle size={20} />
									</span>
								</OverlayTrigger>
								<br />
							</Form.Group>
						</Col>
					)}
				</Row>
			)}
			<div className="class-linha-title3">
				<hr className="w-100"></hr>
			</div>
			{!formik.values.e_lote && (
				<>
					<Row className="mb-3">
						<Col sm={12}>
							<h3 id="title-check-não">Dados do veículo</h3>
						</Col>
						<Form.Text muted className="fw-bold mt-5">
							Caso os dados vinculados à placa não estejam corretos realize a
							alteração no SIT, depois volte a essa página clique dentro do
							campo {`"Placa Cavalo"`} e clique fora para a pesquisa ser
							realizada novamente. Lembrando que a atualização dos dados ficará
							indisponível uma vez que o veículo for {`"Aprovado pelo GR"`}.
						</Form.Text>
					</Row>
					<Row>
						<Col sm={12} md={6}>
							<InputPlaca
								className="input-placaCav"
								id="Plca-cavalo"
								readOnly={
									formik.values.fk_situacao &&
									![1, 2, 4].includes(Number(formik.values.fk_situacao))
								}
								placeholder="Placa Veículo"
								disabled={isDisabledPlaca}
								type="text"
								name="placa_veiculo"
								value={formik.values.placa_veiculo || ""}
								onChange={formik.handleChange}
								onBlur={() => {
									if (
										!formik.values.fk_situacao ||
										[1, 2, 4].includes(Number(formik.values.fk_situacao))
									) {
										handleSearchVehicle(formik.values.placa_veiculo);
									}
								}}
								required={isRequiredPlaca}
							/>
						</Col>
						<Col sm={12} md={6}>
							<InputGroup className="input-carreta mb-2">
								<InputGroup.Text>Rastreador</InputGroup.Text>
								<Form.Control
									readOnly
									placeholder="Rastreador Cavalo"
									type="text"
									value={formik.values.rastreador || ""}
								/>
							</InputGroup>
						</Col>

						<Col sm={12} md={6}>
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
						<Col sm={12} md={6}>
							<InputGroup className="input-carreta mb-2">
								<InputGroup.Text>Rastreador Carreta</InputGroup.Text>
								<Form.Control
									readOnly
									placeholder="Rastreador Carreta"
									type="text"
									value={formik.values.rastreador_carreta || ""}
								/>
							</InputGroup>
						</Col>

						<Col sm={12} md={6}>
							<InputGroup className="class-input-moto">
								<InputGroup.Text>Bitrem</InputGroup.Text>
								<Form.Control
									readOnly
									placeholder="Placa Bitrem"
									type="text"
									value={formik.values.placa_bitrem || ""}
								/>
							</InputGroup>
						</Col>
						<Col>
							<InputGroup className="input-bitrem mb-2">
								<InputGroup.Text>Motorista</InputGroup.Text>
								<Form.Control
									readOnly
									placeholder="Nome Motorista"
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
						<Col className="col-buttons-inf-veiculos">
							<Button
								className="class-botao-Detalhes"
								id="botao-detail-veiculo"
								onClick={() =>
									handleShowDetailsAboutVehicle(formik.values.placa_veiculo)
								}
							>
								Detalhes veículo
							</Button>
							<Button
								className="class-botao-Debito"
								id="botao-deb-veiculo"
								onClick={() =>
									handleShowDebitAboutVehicle(formik.values.placa_veiculo)
								}
							>
								Débitos veículo
							</Button>
						</Col>
					</Row>
					<Row>
						<Col>
							{formik.values.observacao_gr && (
								<FloatingLabel label="Observacao GR" className="mb-1 mt-3">
									<Form.Control
										as="textarea"
										type="text"
										value={formik.values.observacao_gr}
										onKeyDown={handleEnter}
										readOnly
									/>
								</FloatingLabel>
							)}
						</Col>
					</Row>
				</>
			)}
			<Row className="mt-3">
				<Col>
					<InputCliente
						id="info-clie"
						type="text"
						placeholder=" "
						name="cliente"
						value={formik.values.cliente}
						onKeyDown={handleEnter}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						disabled={fkSituacao}
						required
					/>
				</Col>
			</Row>
			<Row>
				<Col sm={12} md={6} lg={7}>
					<FloatingLabel label="Tipo de Material" className="mb-3">
						<AutocompleteInput
							keyDataList="tipo_carga"
							options={produtos.filter((i) => !!i.ativo).map((i) => i.nome)}
							onChange={formik.handleChange}
							value={formik.values.tipo_carga}
							name="tipo_carga"
							disabled={fkSituacao}
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<Row>
						<Col sm={6} md={7} lg={6}>
							<FloatingLabel label="*Unidade de Medida" className="mb-3">
								<Form.Control
									type="text"
									name="unidade_medida"
									value={formik.values.unidade_medida}
									readOnly
								/>
							</FloatingLabel>
						</Col>
						<Col sm={6} md={5} lg={6}>
							<FloatingLabel label="*Quantidade" className="mb-3">
								<Form.Control
									type="number"
									min={1}
									step={0.01}
									placeholder=" "
									name="quantidade"
									value={formik.values.quantidade}
									onKeyDown={handleEnter}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={fkSituacao}
									required
								/>
							</FloatingLabel>
						</Col>
					</Row>
				</Col>
			</Row>
			<InputsPontoPassagem
				formik={formik}
				inputColeta5={inputColeta5}
				inputColeta6={inputColeta6}
				inputColeta7={inputColeta7}
				fkSituacao={fkSituacao}
				isPermissionUserEdit={isPermissionUserEdit}
				setDateErrorInput={setDateErrorInput}
				isDateErrorInput={isDateErrorInput}
				isAlteracaoParcial={isAlteracaoParcial}
			/>

			<Row className="row-button-local">
				<Col>
					{viewsButtonAddColeta && (
						<Button
							className="bg-success border border-white"
							onKeyDown={handleEnter}
							onClick={functionInputs.viewsInputColeta}
							disabled={fkSituacao}
						>
							<IoMdAdd className="me-1 mb-1" />
							Adicionar pontos de passagem
						</Button>
					)}
				</Col>
				<Col className="text-end">
					{viewsButtonExcluir && (
						<Button
							className="bg-secondary ms-2 border border-white"
							onKeyDown={handleEnter}
							onClick={() => functionInputs.excluirInputColeta("delete")}
							disabled={fkSituacao}
						>
							Excluir ponto de passagem
						</Button>
					)}
				</Col>
			</Row>
			<div className="class-linha-title6">
				<hr className="w-100"></hr>
			</div>

			<Row>
				<Col>
					<Form.Group className="mb-3">
						<Form.Label id="info-add">
							Pré-requisitos e acessórios do veículo
						</Form.Label>
						<Form.Control
							placeholder="Adicione restrições e/ou acessórios do veículo caso necessário, exemplo(s): motorista necessita de treinamento atualizado no cliente, cinta, luvas, etc."
							as="textarea"
							rows={3}
							name="acessorios_requisitos"
							value={formik.values.acessorios_requisitos || ""}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							disabled={fkSituacao}
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
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							disabled={fkSituacao}
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
							onBlur={formik.handleBlur}
							disabled={fkSituacao}
						/>
					</Form.Group>
				</Col>
			</Row>
			<Modal show={veiculo !== null} size="lg" onHide={() => setVeiculo(null)}>
				<Modal.Header closeButton>
					<Modal.Title className="modal-title-csn">
						{titleInfoPlaca}
					</Modal.Title>
				</Modal.Header>
				{veiculo && (
					<Row>
						<Col>
							<Card>
								<ListGroup className="list-group-flush">
									{Object.keys(veiculo).map((i) => (
										<ListGroupItem key={i}>
											<b>{i.replace(/_/g, " ")}</b>:
											{i.startsWith("DATA_")
												? veiculo[i]
														?.split("T")[0]
														.split("-")
														.reverse()
														.join("/")
												: veiculo[i]}
										</ListGroupItem>
									))}
								</ListGroup>
							</Card>
						</Col>
						{isDetalhesCarreta && (
							<Col>
								<Card>
									<ListGroup className="list-group-flush">
										{Object.keys(isDetalhesCarreta).map((i) => (
											<ListGroupItem key={i}>
												<b>{i.replace(/_/g, " ")}</b>:
												{i.startsWith("DATA_")
													? isDetalhesCarreta[i]
															?.split("T")[0]
															.split("-")
															.reverse()
															.join("/")
													: isDetalhesCarreta[i]}
											</ListGroupItem>
										))}
									</ListGroup>
								</Card>
							</Col>
						)}
					</Row>
				)}
			</Modal>

			<Modal
				className="modal-debitos-veic3"
				size="xl"
				show={debitosVeiculo !== null && debitosVeiculo?.length > 0}
				onHide={() => setDebitosVeiculo(null)}
			>
				<Modal.Header closeButton>
					<Modal.Title>Débitos do Veículo</Modal.Title>
				</Modal.Header>
				{debitosVeiculo && (
					<Card>
						<Form className="ms-3 mt-3">
							<b>VALOR RESTANTE DO DÉBITO</b>:{" "}
							{new Intl.NumberFormat([], {
								style: "currency",
								currency: "BRL",
							}).format(valorTotalDebito)}{" "}
							<br />{" "}
							<p className="mt-2">
								{" "}
								Obs: Esse valor apresenta a somatória de todas as parcelas e
								boletos que ainda não foram pagas ou não constam baixa de
								pagamento.
							</p>
						</Form>
						<hr />
						{debitosVeiculo?.map((i) => (
							<ListGroup key={i.DEC_SEQ} className="list-group-flush">
								<ListGroupItem>
									<b>PLACA</b>: {i.VEI_PLACA}
								</ListGroupItem>
								<ListGroupItem>
									<b>DESCRIÇÃO</b>: {i.DEC_DSC}
								</ListGroupItem>
								<ListGroupItem>
									<b>VALOR</b>:{" "}
									{new Intl.NumberFormat([], {
										style: "currency",
										currency: "BRL",
									}).format(i.DEC_VALOR)}
								</ListGroupItem>
								<ListGroupItem>
									<b>VENCIMENTO</b>:
									{i.DEC_VENC?.split("T")[0].split("-").reverse().join("/")}
								</ListGroupItem>
								<ListGroupItem>
									<b>EMISSÃO</b>:
									{i.DEC_DTHR_EMISSAO?.split("T")[0]
										.split("-")
										.reverse()
										.join("/")}
								</ListGroupItem>
							</ListGroup>
						))}
					</Card>
				)}
			</Modal>
		</div>
	);
}
