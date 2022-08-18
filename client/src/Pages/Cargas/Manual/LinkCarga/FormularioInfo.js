import React, { useEffect, useState } from "react";
import {
	Form,
	Row,
	Col,
	FloatingLabel,
	InputGroup,
	Button,
	ListGroupItem,
	ListGroup,
	Card,
	Modal,
} from "react-bootstrap";
import swal from "sweetalert";
import ServiceVeiculos from "src/services/ServiceVeiculos";
import AutocompleteInput from "src/Pages/Components/AutocompleteInput";
import InputCliente from "src/Pages/Components/InputCliente";
import InputLocalizacao from "src/Pages/Components/InputLocalizacao";
import InputPlaca from "src/Pages/Components/InputPlaca";

function Formulario({ formik, produtos, distancia }) {
	const [veiculo, setVeiculo] = useState(null);
	const [debitosVeiculo, setDebitosVeiculo] = useState(null);
	async function handleShowDetailsAboutVehicle(plate) {
		if (!plate) {
			swal("Placa inválida");
			return;
		}
		const vehicleData = (await ServiceVeiculos.detalhesImpedimentos(plate)).data
			.data;
		setVeiculo(vehicleData);
		if (!vehicleData) {
			swal("Não foi encontrado nenhum veículo com esta placa");
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
		<>
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
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col sm={12} md={6}>
					<FloatingLabel label="*Código da filial" className="mb-3">
						<Form.Control
							name="fk_filial"
							value={formik.values.fk_filial ?? ""}
							required
							readOnly
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<FloatingLabel label="Documento de transporte" className="mb-3">
						<Form.Control
							id="doc-trans"
							name="documento_transporte"
							value={formik.values.documento_transporte}
							onChange={formik.handleChange}
							readOnly
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<hr className="mb-5" />
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
								id="Plca-cavalo"
								readOnly={
									formik.values.fk_situacao &&
									![1, 2, 4].includes(Number(formik.values.fk_situacao))
								}
								placeholder="Placa veículo"
								disabled={formik.values.e_lote}
								type="text"
								name="placa_veiculo"
								value={formik.values.placa_veiculo}
								onChange={formik.handleChange}
							/>
						</Col>
					</Row>
					<Row>
						<Col sm={12} md={6}>
							<InputGroup className="mb-2">
								<InputGroup.Text>Carreta 🚛</InputGroup.Text>
								<Form.Control
									readOnly
									placeholder="Placa Carreta"
									type="text"
									value={formik.values.placa_carreta || ""}
								/>
							</InputGroup>
						</Col>
						<Col>
							<InputGroup className="mb-2">
								<InputGroup.Text>Bitrem 🚛</InputGroup.Text>
								<Form.Control
									readOnly
									placeholder="Placa Bitrem"
									type="text"
									value={formik.values.placa_bitrem || ""}
								/>
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<InputGroup className="mb-2">
								<InputGroup.Text className="p-3">Motorista 👨‍🚒</InputGroup.Text>
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
						<Col lg={1}>
							<Button
								id="botao-detail-veiculo"
								onClick={() =>
									handleShowDetailsAboutVehicle(formik.values.placa_veiculo)
								}
							>
								Detalhes veículo
							</Button>
						</Col>
						<Col lg={1}>
							<Button
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
						required
						readOnly
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
							required
							readOnly
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
							required
							readOnly
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
							readOnly
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
							readOnly
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
								readOnly
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
								readOnly
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
							readOnly
						/>
					</FloatingLabel>
				</Col>
				<Col>
					<Row>
						<Col>
							<FloatingLabel label="*Unidade" className="mb-3">
								<Form.Control
									type="text"
									name="unidade_medida"
									value={formik.values.unidade_medida}
									readOnly
								/>
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
									required
									readOnly
								/>
							</FloatingLabel>
						</Col>
					</Row>
				</Col>
			</Row>

			<hr className="mb-5 mt-5" />

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
		</>
	);
}

export default Formulario;
