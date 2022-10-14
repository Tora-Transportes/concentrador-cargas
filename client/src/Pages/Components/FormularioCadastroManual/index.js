import React, { useEffect, useState } from "react";
import {
	Form,
	Row,
	Col,
	FloatingLabel,
	OverlayTrigger,
	Tooltip,
	InputGroup,
	Button,
	ListGroupItem,
	ListGroup,
	Card,
	Modal,
} from "react-bootstrap";
import { IoMdHelpCircle } from "react-icons/io";
import InputLocalizacao from "../InputLocalizacao";
import AutocompleteInput from "../AutocompleteInput";
import InputCliente from "../InputCliente";
import UnidadesMedida from "../UnidadesMedida";
import InputPlaca from "../InputPlaca";
import FilialSelect from "../FilialSelect";
import ServiceVeiculos from "src/services/ServiceVeiculos";
import swal from "sweetalert";
import ListAddItens from "../ListAddItens";
import "../FormularioCadastroManual/formularioManual.css";

function FormularioCadastroManual({
	formik,
	produtos,
	distancia,
	distanciaIntermediaria,
	handleSearchDistance,
	disabledFields = [],
	buscarCargaComDocumentoDeTransporte,
}) {
	const [veiculo, setVeiculo] = useState(null);
	const [debitosVeiculo, setDebitosVeiculo] = useState(null);
	//const [addDestinoInterme, setAddDestinoInterme] = useState(false);
	async function handleShowDetailsAboutVehicle(plate) {
		if (!plate) {
			swal("Placa inválida");
			return;
		}
		const vehicleData = (await ServiceVeiculos.detalhesImpedimentos(plate)).data
			.data;
		setVeiculo(vehicleData);
		if (!vehicleData) {
			swal("Não foi encontrado nenhum veículo com essa placa");
		}
	}
	useEffect(() => {
		if (formik.values.e_lote) {
			formik.setFieldValue("placa_veiculo", null);
			formik.setFieldValue("placa_carreta", null);
			formik.setFieldValue("placa_bitrem", null);
			formik.setFieldValue("codigo_motorista", null);
			formik.setFieldValue("nome_motorista", null);
		}
	}, [formik.values.e_lote]);

	async function handleSearchVehicle(plate) {
		if (plate) {
			const vehicleDetails = (await ServiceVeiculos.get(plate)).data.data;
			if (vehicleDetails) {
				formik.setFieldValue("placa_carreta", vehicleDetails.placa_carreta);
				formik.setFieldValue("placa_bitrem", vehicleDetails.placa_bitrem);
				formik.setFieldValue("nome_motorista", vehicleDetails.nome_motorista);
				formik.setFieldValue(
					"codigo_motorista",
					vehicleDetails.codigo_motorista
				);
				return;
			} else {
				swal("Não foi encontrado nenhum veículo com essa placa");
			}
		}
		formik.setFieldValue("placa_carreta", null);
		formik.setFieldValue("placa_bitrem", null);
		formik.setFieldValue("codigo_motorista", null);
		formik.setFieldValue("nome_motorista", null);
	}

	async function handleShowDebitAboutVehicle(plate) {
		if (!plate) {
			swal("Placa inválida");
			return;
		}
		const debitos = (await ServiceVeiculos.debitos(plate)).data.data;
		setDebitosVeiculo(debitos);
		if (debitos.length === 0) {
			swal("Nenhum débito encontrado");
		}
	}

	return (
		<div className="class-body-form">
			<Row>
				<Col>
					<FloatingLabel label="*Responsável pelo cadastro" className="mb-3">
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
				<Col sm={12} md={6}>
					<FloatingLabel label="* Código da filial" className="mb-3">
						<FilialSelect
							id="Codigo-filial"
							placeholder=" "
							name="fk_filial"
							value={formik.values.fk_filial ?? ""}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Documento de transporte" className="mb-3">
						<Form.Control
							id="doc-trans"
							name="documento_transporte"
							value={String(formik.values.documento_transporte)}
							onChange={formik.handleChange}
							onBlur={(...rest) => {
								formik.handleBlur(...rest);
								buscarCargaComDocumentoDeTransporte(formik.values);
							}}
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className="class-linha-title2">
						<hr id="style-linha-cad2"></hr>
					</div>
					<Form.Group className="mb-3">
						*É Lote?{" "}
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
									O campo Lote sinaliza o tipo de carga. Quando o lote é Sim
									(Representa uma quantidade expressiva de volume de cargas que
									devem ser retiradas). Quando Lote é Não (Representa uma carga
									com um volume único).
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
			<div className="class-linha-title3">
				<hr id="style-linha-cad3"></hr>
			</div>
			{!formik.values.e_lote && (
				<>
					<Row className="mb-5">
						<Col sm={12}>
							<h3 id="title-check-não">Dados do veículo</h3>
						</Col>
					</Row>
					<Row>
						<Form.Text muted className="fw-bold">
							Caso os dados vinculados à placa não estejam corretos realize a
							alteração no SIT, depois volte a essa página clique dentro do
							campo {`"Placa Cavalo"`} e clique fora para a pesquisa ser
							realizada novamente. Lembrando que a atualização dos dados ficará
							indisponível uma vez que o veículo for {`"Aprovado pelo GR"`}.
						</Form.Text>
						<Col sm={12}>
							<InputPlaca
								className="input-placaCav"
								id="Plca-cavalo"
								readOnly={
									formik.values.fk_situacao &&
									![1, 2, 4].includes(Number(formik.values.fk_situacao))
								}
								placeholder="Placa Veículo"
								disabled={formik.values.e_lote}
								type="text"
								name="placa_veiculo"
								value={formik.values.placa_veiculo}
								onChange={formik.handleChange}
								onBlur={() => {
									if (
										!formik.values.fk_situacao ||
										[1, 2, 4].includes(Number(formik.values.fk_situacao))
									) {
										handleSearchVehicle(formik.values.placa_veiculo);
									}
								}}
							/>
						</Col>
					</Row>
					<Row>
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
						<Col>
							<InputGroup className="input-bitrem mb-2">
								<InputGroup.Text>Bitrem</InputGroup.Text>
								<Form.Control
									readOnly
									placeholder="Placa Bitrem"
									type="text"
									value={formik.values.placa_bitrem || ""}
								/>
							</InputGroup>
						</Col>
					</Row>

					<div className="class-input-motorista">
						<InputGroup id="style-ipunt-motorista" className="class-input-moto">
							<InputGroup.Text>Motorista</InputGroup.Text>
							<Form.Control
								readOnly
								placeholder="Motorista"
								type="text"
								value={
									formik.values.codigo_motorista && formik.values.nome_motorista
										? `${formik.values.codigo_motorista} - ${formik.values.nome_motorista}`
										: ""
								}
							/>
						</InputGroup>
						<Button
							className="class-botao-DetalhesV"
							id="botao-detail-veiculo"
							onClick={() =>
								handleShowDetailsAboutVehicle(formik.values.placa_veiculo)
							}
						>
							Detalhes veículo
						</Button>

						<Button
							className="class-botao-DetalhesV"
							id="botao-deb-veiculo"
							onClick={() =>
								handleShowDebitAboutVehicle(formik.values.placa_veiculo)
							}
						>
							Débitos veículo
						</Button>
					</div>

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
							<hr id="style-linha-cad4"></hr>
						</div>
					</Row>
				</>
			)}
			<Row>
				<Col>
					<InputCliente
						id="info-clie"
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
					<FloatingLabel label="*Origem da carga" className="mb-3">
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
				<Col sm={12} md={6}>
					<FloatingLabel label="*Destino final da carga" className="mb-3">
						<InputLocalizacao
							keyDataList="destino_carga"
							type="text"
							placeholder=" "
							name="destino_carga"
							value={formik.values.destino_carga}
							onChange={formik.handleChange}
							onBlur={() => handleSearchDistance(formik.values)}
							className="text-primary"
							required
						/>
					</FloatingLabel>
				</Col>
				{/* <Col sm={4} className="text-center justifi-content-center mt-2">
					<Button
						//style={{ background: "#00652E", border: "none", color: "#FFFFFF" }}
						//variant="info"
						onClick={() => setAddDestinoInterme(true)}
					>
						Adicionar destino intermediária
					</Button>
				</Col> */}

				{/* {addDestinoInterme && (
					<Col sm={12} md={4}>
						<FloatingLabel
							label="Destino intermediário da  carga"
							className="mb-3"
						>
							<InputLocalizacao
								keyDataList="destino_intermediario"
								type="text"
								placeholder=" "
								name="destino_intermediario"
								value={formik.values.destino_intermediario}
								onChange={formik.handleChange}
								onBlur={() => handleSearchDistance(formik.values)}
								className="text-warning"
							/>
						</FloatingLabel>
					</Col>
				)} */}
			</Row>

			{/* <Row>
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
			</Row> */}

			{distanciaIntermediaria && (
				<Row>
					<Col>
						<FloatingLabel
							label="Distância entre a origem e o destino intermediário"
							className="mb-3"
						>
							<Form.Control
								type="text"
								placeholder=" "
								value={`A distância entre ${
									formik.values.origem_carga.split("/")[2]
								} e ${
									formik.values.destino_intermediario.split("/")[2]
								} é de ${distanciaIntermediaria} KM.`}
								className="text-warning"
								readOnly
							/>
							<Form.Text id="passwordHelpBlock" muted>
								O valor mostrado representa a distância de centro a centro.
							</Form.Text>
						</FloatingLabel>
						<div className="class-linha-title">
							<hr id="style-linha-cad"></hr>
						</div>
					</Col>
				</Row>
			)}
			{distancia && (
				<Row>
					<Col>
						<FloatingLabel
							label="Distância entre a origem e o destino final"
							className="mb-3"
						>
							<Form.Control
								type="text"
								placeholder=" "
								value={`A distância entre ${
									formik.values.origem_carga.split("/")[2]
								} e ${
									formik.values.destino_carga.split("/")[2]
								} é de ${distancia} KM.`}
								className="text-primary"
								readOnly
							/>
							<Form.Text id="passwordHelpBlock" muted>
								O valor mostrado representa a distância de centro a centro.
							</Form.Text>
						</FloatingLabel>
						<div className="class-linha-title5">
							<hr id="style-linha-cad5"></hr>
						</div>
					</Col>
				</Row>
			)}
			<Row>
				<Col>
					<FloatingLabel label="Data da coleta" className="mb-3">
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
					<FloatingLabel label="Data de entrega" className="mb-3">
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
					<FloatingLabel label="Tipo de material" className="mb-3">
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

			<div className="class-linha-title6">
				<hr id="style-linha-cad6"></hr>
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
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
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
							onBlur={formik.handleBlur}
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
						/>
					</Form.Group>
				</Col>
			</Row>

			<div>
				<ListAddItens
					id="style-botao-add"
					value={formik.values.locais}
					name="locais"
					onChange={formik.handleChange}
				/>
			</div>

			<Modal show={veiculo !== null} size="lg" onHide={() => setVeiculo(null)}>
				<Modal.Header closeButton>
					<Modal.Title>Dados do veículo</Modal.Title>
				</Modal.Header>
				{veiculo && (
					<Card>
						<ListGroup className="list-group-flush">
							{Object.keys(veiculo).map((i) => (
								<ListGroupItem key={i}>
									<b>{i.replace(/_/g, " ")}</b>:
									{i.startsWith("DATA_")
										? veiculo[i]?.split("T")[0].split("-").reverse().join("/")
										: veiculo[i]}
								</ListGroupItem>
							))}
						</ListGroup>
					</Card>
				)}
			</Modal>

			<Modal
				size="xl"
				show={debitosVeiculo !== null && debitosVeiculo?.length > 0}
				onHide={() => setDebitosVeiculo(null)}
			>
				<Modal.Header closeButton>
					<Modal.Title>Débitos do veículo</Modal.Title>
				</Modal.Header>
				{debitosVeiculo && (
					<Card>
						{debitosVeiculo?.map((i) => (
							<ListGroup key={i.DEC_SEQ} className="list-group-flush">
								<hr />
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

export default FormularioCadastroManual;
