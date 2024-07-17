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
import { IoIosCloseCircleOutline, IoMdHelpCircle } from "react-icons/io";
import InputLocalizacao from "../InputLocalizacao";
import AutocompleteInput from "../AutocompleteInput";
import InputCliente from "../InputCliente";
import InputPlaca from "../InputPlaca";
import FilialSelect from "../FilialSelect";
import ServiceVeiculos from "src/services/ServiceVeiculos";
import swal from "sweetalert";
import ListAddItens from "../ListAddItens";
import "../FormularioCadastroManual/formularioManual.css";
import somaDebitoVeiculo from "src/Pages/Utils/somaDebitoVeiculo";
import CurrencyInput from "react-currency-input-field";
//import Select from "react-select";
import ModalPreRequisito from "./components/ModalPreRequisito";
import ServicePreRequisitos from "src/services/ServicePreRequisitos";
import ServiceApp from "src/services/ServiceApp";

function FormularioCadastroManual({
	formik,
	produtos,
	distancia,
	handleSearchDistance,
	disabledFields = [],
	buscarCargaComDocumentoDeTransporte,
	isViwsCargaApp,
	status,
	isCargaApp,
	setDisabledPlaca,
	isDisabledPlaca,
	isDisableColetaEntrega,
	setDisableColetaEntrega,
	setLoading,
}) {
	const [veiculo, setVeiculo] = useState(null);
	const [isDetalhesVeiculo, setDetalesVeiculo] = useState(null);
	const [isDetalhesCarreta, setDetalesCarreta] = useState(null);
	const [debitosVeiculo, setDebitosVeiculo] = useState(null);
	const [valorTotalDebito, setValorTotal] = useState();
	const [isDisabledEnvioApp, setDisabledEnvioApp] = useState(false);
	const [open, setOpen] = useState(false);
	const [prerequisito, setPreRequisito] = useState(null);
	const [prerequisitos, setPreRequisitos] = useState([]);
	const [quantidade, setQuantidade] = useState(0);
	const showPreRequisites = false;

	useEffect(() => {
		async function carregaLista() {
			const lista = await ServicePreRequisitos.listSelect();
			setPreRequisitos(lista);
		}
		carregaLista();
	}, []);

	async function handleAddPreRequisito() {
		console.log(quantidade, prerequisito);
		if (
			prerequisito &&
			prerequisito.exige_quantidade == "1" &&
			(quantidade == 0 || quantidade < 0)
		) {
			swal("Quantidade precisa ser maior que 0!");
		} else {
			if (prerequisito && prerequisito.exige_quantidade != "1") {
				formik.values.prerequisitos.push({
					id: prerequisito.value,
					nome: prerequisito.label,
					quantidade: 1,
				});
			} else {
				formik.values.prerequisitos.push({
					id: prerequisito.value,
					nome: prerequisito.label,
					quantidade: quantidade,
				});
			}
			setPreRequisito(null);
			setQuantidade(0);
		}
	}

	async function handleOpen() {
		setOpen(!open);
	}

	const acoesRequisito = (rowData) => {
		return (
			<div className="opcoes-table">
				<Button
					variant="outline-danger"
					onClick={async (e) => {
						e.preventDefault();
						const updatedPrerequisitos = formik.values.prerequisitos.filter(
							(item) => item.id !== rowData.id
						);
						formik.setFieldValue("prerequisitos", updatedPrerequisitos);
					}}
				>
					<IoIosCloseCircleOutline className="icon-des" />
					Deletar
				</Button>
			</div>
		);
	};

	/* 	const optionsForcaTrabalho = [
		{ value: 1, label: "Agregado" },
		{ value: 2, label: "Carreteiro" },
		{ value: 3, label: "Ambos" },
	];
 */
	/* 	const optionsViagem = [
		{ value: 1, label: "Viagem" },
		{ value: 2, label: "Pré-Viagem" },
	]; */

	/* 	const optionsEstiloCarga = [
		{ value: 1, label: "Normal" },
		{ value: 2, label: "Escoamento" },
	]; */

	async function handleShowDetailsAboutVehicle(plate) {
		setLoading(true);
		if (!plate) {
			swal("Placa inválida");
			setLoading(false);
			return;
		}

		let vehicleData;
		if (isDetalhesVeiculo) {
			vehicleData = isDetalhesVeiculo;
		} else {
			vehicleData = (await ServiceVeiculos.detalhesImpedimentos(plate)).data
				.data;
		}

		if (!vehicleData) {
			swal("Não foi encontrado nenhum veículo com essa placa.");
		}

		let placaCarreta = formik.values.placa_carreta;
		if (isDetalhesVeiculo === null) {
			const detailVeiculo = (await ServiceVeiculos.get(plate)).data.data;
			setDetalesVeiculo(detailVeiculo);
			placaCarreta = detailVeiculo?.placa_carreta;
		}

		const resultCarreta = await (
			await ServiceVeiculos.detalhesImpedimentos(placaCarreta)
		).data.data;

		if (resultCarreta) setDetalesCarreta(resultCarreta);

		setVeiculo(vehicleData);
		setLoading(false);
	}

	useEffect(() => {
		if (formik.values.e_lote) {
			formik.setFieldValue("placa_veiculo", null);
			formik.setFieldValue("placa_bitrem", null);
			formik.setFieldValue("codigo_motorista", null);
			formik.setFieldValue("nome_motorista", null);
		}
	}, [formik.values.e_lote]);

	useEffect(() => {
		setDisabledEnvioApp(status === "Edicao");
		if (isCargaApp) setDisabledPlaca(true);
	}, [isCargaApp]);

	async function handleSearchVehicle(plate) {
		setLoading(true);
		if (plate) {
			setDetalesVeiculo(null);
			setDetalesCarreta(null);
			const vehicleDetails = (await ServiceVeiculos.get(plate)).data.data;
			if (vehicleDetails.cpf == null || vehicleDetails.cpf == undefined) {
				formik.setFieldValue("placa_veiculo", null);
				formik.setFieldValue("placa_carreta", null);
				formik.setFieldValue("placa_bitrem", null);
				formik.setFieldValue("codigo_motorista", null);
				formik.setFieldValue("nome_motorista", null);
				formik.setFieldValue("cpf_motorista", null);
				swal(
					`O veiculo da placa ${plate} não possui motorista vinculado no SIT!`
				);
				setLoading(false);
				return;
			}
			if (vehicleDetails) {
				if (formik.values.carga_app == 1) {
					const response = await ServiceApp.motoristaExiste(
						plate,
						vehicleDetails.cpf
					);
					if (response.err) {
						swal(response.message);
						formik.setFieldValue("placa_veiculo", null);
						formik.setFieldValue("placa_carreta", null);
						formik.setFieldValue("placa_bitrem", null);
						formik.setFieldValue("codigo_motorista", null);
						formik.setFieldValue("nome_motorista", null);
						formik.setFieldValue("cpf_motorista", null);
						setLoading(false);
					} else {
						const response = await ServiceApp.motoristaPossuiViagem(
							vehicleDetails.cpf
						);
						if (response.err) {
							swal(response.message);
							formik.setFieldValue("placa_veiculo", null);
							formik.setFieldValue("placa_carreta", null);
							formik.setFieldValue("placa_bitrem", null);
							formik.setFieldValue("codigo_motorista", null);
							formik.setFieldValue("nome_motorista", null);
							formik.setFieldValue("cpf_motorista", null);
							setLoading(false);
						} else {
							formik.setFieldValue(
								"placa_carreta",
								vehicleDetails.placa_carreta
							);
							formik.setFieldValue("placa_bitrem", vehicleDetails.placa_bitrem);
							formik.setFieldValue(
								"nome_motorista",
								vehicleDetails.nome_motorista
							);
							formik.setFieldValue(
								"codigo_motorista",
								vehicleDetails.codigo_motorista
							);
							formik.setFieldValue("cpf_motorista", vehicleDetails.cpf);

							const detalhesVeiculos = (
								await ServiceVeiculos.detalhesImpedimentos(plate)
							).data.data;
							setDetalesVeiculo(detalhesVeiculos);
							setLoading(false);
							return;
						}
					}
				} else {
					formik.setFieldValue("placa_carreta", vehicleDetails.placa_carreta);
					formik.setFieldValue("placa_bitrem", vehicleDetails.placa_bitrem);
					formik.setFieldValue("nome_motorista", vehicleDetails.nome_motorista);
					formik.setFieldValue(
						"codigo_motorista",
						vehicleDetails.codigo_motorista
					);
					formik.setFieldValue("cpf_motorista", vehicleDetails.cpf);

					const detalhesVeiculos = (
						await ServiceVeiculos.detalhesImpedimentos(plate)
					).data.data;
					setDetalesVeiculo(detalhesVeiculos);
					setLoading(false);
					return;
				}
			} else {
				swal("Não foi encontrado nenhum veículo com essa placa.");
			}
		}
		formik.setFieldValue("placa_carreta", null);
		formik.setFieldValue("placa_bitrem", null);
		formik.setFieldValue("codigo_motorista", null);
		formik.setFieldValue("nome_motorista", null);
		formik.setFieldValue("cpf_motorista", null);
		setLoading(false);
	}

	async function handleShowDebitAboutVehicle(plate) {
		if (!plate) {
			swal("Placa inválida");
			return;
		}
		const debitos = (await ServiceVeiculos.debitos(plate)).data.data;

		if (debitos.length === 0) {
			swal("Nenhum débito encontrado.");
		} else {
			const totalDebitosVeic = await somaDebitoVeiculo(debitos);

			setValorTotal(totalDebitosVeic);

			setDebitosVeiculo(debitos);
		}
	}

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
		console.log("RRR");
		const decisaoEnvioCarga = e.target.checked;
		setDisableColetaEntrega(decisaoEnvioCarga);
		if (decisaoEnvioCarga) {
			setTimeout(() => {
				formik.setFieldValue("placa_veiculo", null);
				formik.setFieldValue("placa_carreta", null);
				formik.setFieldValue("placa_bitrem", null);
				formik.setFieldValue("codigo_motorista", null);
				formik.setFieldValue("nome_motorista", null);
				formik.setFieldValue("cpf_motorista", null);
			}, 500);
		}
		const cargaEnviarApp = 1;
		const cargaNaoEnviarApp = 0;
		//setDisabledPlaca(decisaoEnvioCarga); #PLACA FICAR HABILITADA
		const valorCargaAppFormik = decisaoEnvioCarga
			? cargaEnviarApp
			: cargaNaoEnviarApp;
		formik.setFieldValue("carga_app", valorCargaAppFormik);
	};

	useEffect(() => {
		const today = new Date();
		const todayS = new Date().toISOString().split("T")[0];
		const inputDateColeta = new Date(formik.values.data_coleta);
		const inputDateEntrega = new Date(formik.values.data_entrega);

		// Verifica se o ano da data de coleta é maior que o ano atual
		if (
			formik.values.data_coleta &&
			inputDateColeta.getFullYear() >= today.getFullYear()
		) {
			if (formik.values.data_coleta && formik.values.data_coleta < todayS) {
				swal("A data de coleta não pode ser menor que a data atual");
				formik.setFieldValue("data_coleta", "");
			}
		}

		// Verifica se o ano da data de entrega é maior que o ano atual
		if (
			formik.values.data_entrega &&
			inputDateEntrega.getFullYear() >= today.getFullYear()
		) {
			if (
				formik.values.data_coleta &&
				formik.values.data_entrega &&
				formik.values.data_entrega < formik.values.data_coleta
			) {
				swal("A data de entrega deve ser maior ou igual à data de coleta");
				formik.setFieldValue("data_entrega", "");
			}
		}
	}, [
		formik.values.data_coleta,
		formik.values.data_entrega,
		formik.values.janela_coleta,
		formik.values.janela_entrega,
	]);

	const foucusOut = (e) => {
		const offset = -3; // Offset em horas para GMT-3
		const offsetInMs = offset * 60 * 60 * 1000; // Converter offset para milissegundos
		const nowN = new Date();
		const now = new Date(nowN.getTime() + offsetInMs);
		const todayS = now.toISOString().split("T")[0];
		const split_hour = now.toISOString().split("T")[1].split(":");

		if (e.target.name == "data_coleta") {
			if (formik.values.data_coleta && formik.values.data_coleta < todayS) {
				swal("A data de coleta não pode ser menor que a data atual");
				formik.setFieldValue("data_coleta", "");
			}
		} else if (e.target.name == "data_entrega") {
			if (
				formik.values.data_coleta &&
				formik.values.data_entrega &&
				formik.values.data_entrega < formik.values.data_coleta
			) {
				swal("A data de entrega deve ser maior ou igual à data de coleta");
				formik.setFieldValue("data_entrega", "");
			}
		} else if (e.target.name == "janela_coleta") {
			const split_janela_coleta = String(formik.values.janela_coleta).split(
				":"
			);
			if (
				(formik.values.data_coleta == todayS &&
					Number(split_janela_coleta[0] < Number(split_hour[0])) &&
					Number(split_janela_coleta[1] < Number(split_hour[1]))) ||
				(formik.values.data_coleta == todayS &&
					Number(split_janela_coleta[0] == Number(split_hour[0])) &&
					Number(split_janela_coleta[1] < Number(split_hour[1])))
			) {
				swal(
					"O horário da janela de coleta não poder ser inferior a hora atual quando a data de coleta for igual data atual"
				);
				formik.setFieldValue("janela_coleta", "");
			}
		} else if (e.target.name == "janela_entrega") {
			if (formik.values.data_coleta === formik.values.data_entrega) {
				const split_janela_coleta = String(formik.values.janela_coleta).split(
					":"
				);
				const split_janela_entrega = String(formik.values.janela_entrega).split(
					":"
				);
				if (
					formik.values.data_entrega == todayS &&
					Number(split_janela_coleta[0] == Number(split_janela_entrega[0])) &&
					Number(split_janela_coleta[1] == Number(split_janela_entrega[1]))
				) {
					swal(
						"A hora de entrega deve ser maior que a de coleta quando as datas são iguais"
					);
					formik.setFieldValue("janela_entrega", "");
				}
			}
		} else {
			console.log();
		}
	};

	const titleInfoPlaca = isDetalhesCarreta
		? "Dados do Veículo / Dados Carreta"
		: "Dados do Veículo";

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
				<Col lg={7} md={6} sm={6} className="col-cod-filial">
					<label>*Código da filial</label>
					<FilialSelect
						className="input-cod-filial"
						placeholder=" "
						name="fk_filial"
						value={formik.values.fk_filial ?? ""}
						onKeyDown={handleEnter}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						required
					/>
				</Col>
				<Col>
					<FloatingLabel label="Documento de transporte" className="mb-3">
						<Form.Control
							id="doc-trans"
							name="documento_transporte"
							value={String(formik.values.documento_transporte)}
							onKeyDown={handleEnter}
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
							onKeyDown={handleEnter}
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
							onKeyDown={handleEnter}
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
				{isViwsCargaApp && (
					<Col className="text-end">
						<Form.Group className="mb-3">
							*Enviar carga para o APP?
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
										Esse campo define se a carga será enviada ou não para o App.
										Quando este campo é selecionado a carga será disponibilizada
										para visualização e modificação no App de cargas.
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
			<div className="class-linha-title3">
				<hr className="w-100"></hr>
			</div>
			<>
				<Row className="mb-5">
					<Col sm={12}>
						<h3 id="title-check-não">Detalhes</h3>
					</Col>
				</Row>
				<Row>
					<Col sm={12} md={6}>
						<Form.Group controlId="valor_frete">
							<Form.Label>Valor Frete (R$)</Form.Label>
							<CurrencyInput
								id="valor_frete"
								name="valor_frete"
								value={formik.values.valor_frete}
								decimalsLimit={2}
								decimalSeparator=","
								groupSeparator="."
								prefix="R$ "
								onValueChange={(value) => {
									try {
										if (value !== undefined) {
											formik.setFieldValue(
												"valor_frete",
												value.replace("-", "")
											);
										} else {
											formik.setFieldValue("valor_frete", "0");
										}
									} catch (error) {
										console.log(error);
										formik.setFieldValue("valor_frete", value);
									}
								}}
								defaultValue={formik.values.valor_frete}
								className={`form-control ${
									formik.touched.valor_frete && formik.errors.valor_frete
										? "is-invalid"
										: ""
								}`}
							/>
						</Form.Group>
					</Col>
					<Col>
						<Row>
							{/* 							<Col sm={6} md={7} lg={6}>
								<Form.Group
									className="mb-3"
									controlId="validationFormikForcaTrabalho"
								>
									<Form.Label>Força de Trabalho</Form.Label>
									<Select
										id="forca_trabalho"
										name="forca_trabalho"
										placeholder="Selecione"
										options={optionsForcaTrabalho}
										onChange={(option) =>
											formik.setFieldValue("forca_trabalho", option)
										}
										value={formik.values.forca_trabalho}
										required
									/>
									{formik.errors.forca_trabalho &&
										formik.touched.forca_trabalho && (
											<div style={{ color: "red" }}>
												{formik.errors.forca_trabalho}
											</div>
										)}
								</Form.Group>
							</Col> */}
							{/* 							<Col>
								{formik.values.carga_app == 1 ? (
									<Form.Group
										className="mb-3"
										controlId="validationFormikTipoDeViagem"
									>
										<Form.Label>Tipo Viagem</Form.Label>
										<Select
											id="tipo_viagem"
											name="tipo_viagem"
											placeholder="Selecione"
											options={optionsViagem}
											onChange={(option) =>
												formik.setFieldValue("tipo_viagem", option)
											}
											value={
												formik.values.tipo_viagem == 1
													? optionsViagem[0]
													: formik.values.tipo_viagem
											}
											hideSelectedOptions={true}
											required
										/>
										{formik.errors.tipo_viagem &&
											formik.touched.tipo_viagem && (
												<div style={{ color: "red" }}>
													{formik.errors.tipo_viagem}
												</div>
											)}
									</Form.Group>
								) : (
									<></>
								)}
							</Col> */}
						</Row>
					</Col>
				</Row>
				<Row>
					{/* 					<Col sm={12} md={6}>
						<Form.Group
							className="mb-3"
							controlId="validationFormikEstiloCarga"
						>
							<Form.Label>Estilo Carga</Form.Label>
							<Select
								id="estilo_carga"
								name="estilo_carga"
								placeholder="Selecione"
								options={optionsEstiloCarga}
								onChange={(option) =>
									formik.setFieldValue("estilo_carga", option)
								}
								value={
									formik.values.estilo_carga == 1
										? optionsEstiloCarga[0]
										: formik.values.estilo_carga
								}
								required
							/>
							{formik.errors.estilo_carga && formik.touched.estilo_carga && (
								<div style={{ color: "red" }}>{formik.errors.estilo_carga}</div>
							)}
						</Form.Group>
					</Col> */}
					{/* 					<Col>
						<Row>
							<Col sm={6} md={7} lg={6}>
								{formik.values.estilo_carga.value &&
								formik.values.estilo_carga.value == 2 ? (
									<Form.Group
										className="mb-3"
										controlId="validationFormikForcaTrabalho"
									>
										<Form.Label>Quantidade de Cargas</Form.Label>
										<Form.Control
											type="number"
											min={1}
											step={0.01}
											placeholder=" "
											name="quantidade_cargas"
											value={formik.values.quantidade_cargas}
											onKeyDown={handleEnter}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											disabled={disabledFields.includes("quantidade_cargas")}
											required
										/>
									</Form.Group>
								) : (
									<></>
								)}
							</Col>
							<Col>
								{formik.values.estilo_carga.value &&
								formik.values.estilo_carga.value == 2 ? (
									<Form.Group
										className="mb-3"
										controlId="validationFormikDataLimiteOferta"
									>
										<Form.Label>Data Limite Oferta</Form.Label>
										<Form.Control
											type="date"
											placeholder=" "
											name="data_limite_oferta"
											value={formik.values.data_limite_oferta}
											onKeyDown={handleEnter}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
									</Form.Group>
								) : (
									<></>
								)}
							</Col>
						</Row>
					</Col> */}
				</Row>
			</>
			<div className="class-linha-title3">
				<hr className="w-100"></hr>
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
								placeholder="Placa veículo"
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
							/>
						</Col>
					</Row>
					<Row>
						<Col sm={12} md={6}>
							<InputGroup className="input-carreta mb-2">
								<InputGroup.Text>Carreta</InputGroup.Text>
								<Form.Control
									readOnly
									placeholder="Placa carreta"
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
									placeholder="Placa bitrem"
									type="text"
									value={formik.values.placa_bitrem || ""}
								/>
							</InputGroup>
						</Col>
					</Row>

					<Row className="row-input-motorista">
						<Col sm={12} md={6} lg={6}>
							<InputGroup
								// id="style-ipunt-motorista"
								className="class-input-moto"
							>
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

						<Col className="col-info-veic-manual" id="detalhes-veiculo-manual">
							<Button
								className="button-info-veic-manual buttons-detail-veiculos"
								onClick={() =>
									handleShowDetailsAboutVehicle(formik.values.placa_veiculo)
								}
							>
								Detalhes veículo
							</Button>
							<Button
								className="button-info-veic-manual buttons-inf-veiculos"
								// id="botao-deb-veiculo"
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
								<FloatingLabel label="Observação GR" className="mb-3">
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
							<hr className="w-100"></hr>
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
						onKeyDown={handleEnter}
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
							onKeyDown={handleEnter}
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
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							onBlur={() => handleSearchDistance(formik.values)}
							required
						/>
					</FloatingLabel>
				</Col>
			</Row>

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
								className="text-success"
								readOnly
							/>
							<Form.Text id="passwordHelpBlock" muted>
								O valor mostrado representa a distância de centro a centro.
							</Form.Text>
						</FloatingLabel>
						<div className="class-linha-title5">
							<hr className="w-100"></hr>
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
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							onBlur={(e) => {
								formik.handleBlur(e);
								foucusOut(e);
							}}
							required={isDisableColetaEntrega}
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
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							onBlur={(e) => {
								formik.handleBlur(e);
								foucusOut(e);
							}}
							required={isDisableColetaEntrega}
						/>
					</FloatingLabel>
				</Col>
			</Row>
			{!formik.values.e_lote && (
				<Row>
					<Col sm={6}>
						<FloatingLabel label="Janela coleta" className="mb-3">
							<Form.Control
								type="time"
								placeholder=" "
								name="janela_coleta"
								value={formik.values.janela_coleta}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={(e) => {
									formik.handleBlur(e);
									foucusOut(e);
								}}
							/>
						</FloatingLabel>
					</Col>
					<Col>
						<FloatingLabel label="Janela entrega" className="mb-3">
							<Form.Control
								type="time"
								placeholder=" "
								name="janela_entrega"
								value={formik.values.janela_entrega}
								onKeyDown={handleEnter}
								onChange={formik.handleChange}
								onBlur={(e) => {
									formik.handleBlur(e);
									foucusOut(e);
								}}
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
						<Col sm={6} md={7} lg={6}>
							<FloatingLabel label="*Unidade de medida" className="mb-3">
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
									onKeyDown={handleEnter}
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
							//as="textarea"
							type="text"
							maxLength={150}
							rows={3}
							name="acessorios_requisitos"
							value={formik.values.acessorios_requisitos || ""}
							onKeyDown={handleEnter}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</Form.Group>
				</Col>
			</Row>
			{showPreRequisites ? (
				<Col>
					<div className="class-linha-title6">
						<hr className="w-100"></hr>
					</div>
					<Row className="mb-5">
						<Col sm={12}>
							<h3 id="title-check-não">Pré-requisitos</h3>
						</Col>
					</Row>

					<Form.Text muted className="fw-bold">
						Adicione restrições e/ou acessórios do veículo caso necessário,
						exemplo(s): motorista necessita de treinamento atualizado no
						cliente, cinta, luvas, etc.
					</Form.Text>

					<Row>
						<ModalPreRequisito
							prerequisitos={prerequisitos}
							prerequisito={prerequisito}
							setPreRequisito={setPreRequisito}
							formik={formik}
							open={open}
							handleOpen={handleOpen}
							handleAddPreRequisito={handleAddPreRequisito}
							quantidade={quantidade}
							setQuantidade={setQuantidade}
							acoesRequisito={acoesRequisito}
						/>
					</Row>

					<div className="class-linha-title6">
						<hr className="w-100"></hr>
					</div>
				</Col>
			) : (
				<></>
			)}
			<Row>
				<Col>
					<Form.Group className="mb-3">
						<Form.Label>Informações restritivas do veículo</Form.Label>
						<Form.Control
							placeholder="Adicione as informções restritivas do veículo, se houver, exemplo: proibido entrada de rodotrem."
							//as="textarea"
							type="text"
							maxLength={150}
							rows={3}
							name="informacoes_restritivas"
							value={formik.values.informacoes_restritivas || ""}
							onKeyDown={handleEnter}
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
							//as="textarea"
							type="text"
							maxLength={150}
							rows={3}
							name="observacao"
							value={formik.values.observacao || ""}
							onKeyDown={handleEnter}
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
					formik={formik}
				/>
			</div>

			<Modal show={veiculo !== null} size="lg" onHide={() => setVeiculo(null)}>
				<Modal.Header closeButton>
					<Modal.Title>{titleInfoPlaca}</Modal.Title>
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
				className="modal-debitos-veiculo"
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

export default FormularioCadastroManual;
