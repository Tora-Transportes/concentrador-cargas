import React, { useEffect, useState, useRef } from "react";
import {
	Container,
	Row,
	Col,
	FloatingLabel,
	Form,
	Button,
	Tooltip,
	OverlayTrigger,
} from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import NavbarNavigator from "../../../Components/NavbarNavigator";
import useLoadingScreen from "../../../Components/LoadingScreen";
import swal from "sweetalert";
import ServiceCargas from "../../../../services/ServiceCargas";
import { getClaims } from "../../../../MicrosoftAuthentication";
import AutocompleteInput from "src/Pages/Components/AutocompleteInput";
import ServiceProdutos from "src/services/ServiceProdutos";
import InputCliente from "src/Pages/Components/InputCliente";
import ServiceRecomendacoes from "src/services/ServiceRecomendacoes";
import _ from "lodash";
import { IoMdHelpCircle } from "react-icons/io";

function Manual() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const { id } = useParams();
	const history = useHistory();
	const [produtos, setProdutos] = useState([]);
	const [locaisOrigemCarga, setLocaisOrigemCarga] = useState([]);
	const [locaisDestinoCarga, setLocaisDestinoCarga] = useState([]);
	const [distancia, setDistancia] = useState(null);

	const formik = useFormik({
		initialValues: {
			responsavel_cadastro: "",
			id: id,
			e_lote: false,
			cliente: "",
			destino_carga: "",
			origem_carga: "",
			data_coleta: "",
			data_entrega: "",
			tipo_carga: "",
			quantidade: 0,
			unidade_medida: "",
			observacao: "",
			acessorios_requisitos: "",
			informacoes_restritivas: "",

			janela_entrega: "",
			janela_coleta: "",
		},
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const { data } = await ServiceCargas.update({
					...values,
					responsavel_cadastro: String(getClaims().name),
				});
				formik.setFieldValue("responsavel_cadastro", String(getClaims().name));
				swal(
					"Sucesso",
					`O registro de id ${data.data.id} foi atualizado`,
					"success"
				);
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});

	function handleCloseWindow(e) {
		if (e) {
			e.preventDefault();
		}
		window.open("", "_self").close();
	}

	async function handleExcluirCarga() {
		setLoading(true);
		try {
			const ok = await swal(
				"OPS?",
				"Tem certeza que deseja excluir a carga atual ?",
				{
					buttons: ["Não", true],
					dangerMode: true,
					icon: "warning",
				}
			);
			if (ok) {
				await ServiceCargas.delete({ id: formik.values.id });
				swal("Sucesso!", "Carga removida", "success");
				handleCloseWindow();
			}
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

	async function handleSearchDistance({ destino_carga, origem_carga }) {
		if (destino_carga && origem_carga) {
			const [cidade_origem, estado_origem] = origem_carga.split("/");
			const [cidade_destino, estado_destino] = destino_carga.split("/");
			try {
				const { data } = await ServiceCargas.getDistance({
					cidade_origem,
					cidade_destino,
					estado_origem,
					estado_destino,
				});
				const distance = data.data;
				setDistancia(`${distance} KM`);
				return distance;
			} catch (error) {
				setDistancia(null);
				return 1;
			}
		}
	}

	useEffect(() => {
		let isMounted = true;
		setLoading(true);
		ServiceCargas.index({ id })
			.then((response) => {
				const carga = response.data.data;
				for (const i in carga) {
					if (i.indexOf("data") !== -1) {
						formik.setFieldValue(i, carga[i].split("T")[0]);
					} else if (i === "e_lote") {
						formik.setFieldValue("e_lote", !!carga[i]);
					} else {
						formik.setFieldValue(i, carga[i]);
					}
				}
				handleSearchDistance(carga);
			})
			.catch(() => {
				history.push("/cargas/menu");
			})
			.finally(() => {
				if (isMounted) {
					setLoading(false);
				}
			});
		return () => {
			isMounted = false;
		};
	}, []);

	const throttledAutocompleteLocais = useRef(
		_.throttle((query, callback) => {
			ServiceRecomendacoes.locais({ query }).then(({ data }) => {
				callback(data.data);
			});
		}, 500)
	);
	useEffect(
		() =>
			throttledAutocompleteLocais.current(
				formik.values.origem_carga,
				setLocaisOrigemCarga
			),
		[formik.values.origem_carga]
	);
	useEffect(
		() =>
			throttledAutocompleteLocais.current(
				formik.values.destino_carga,
				setLocaisDestinoCarga
			),
		[formik.values.destino_carga]
	);

	useEffect(() => {
		ServiceProdutos.list().then(({ data }) => {
			setProdutos(data.data);
		});
	}, []);

	return (
		<>
			<LoadingScreen />
			<NavbarNavigator className="fixed-top" />
			<h1
				className="fixed-top mb-5 mt-5 pt-2 pb-2 bg-white text-center border-bottom"
				style={{ zIndex: "20" }}
			>
				Edição de carga aberta manualmente
			</h1>
			<div className="mt-5 mb-5 pt-5 pb-5" />
			<Container className="mb-5 mt-5">
				<Form onSubmit={formik.handleSubmit}>
					<Row>
						<Col>
							<FloatingLabel label="*Responsável cadastro" className="mb-3">
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
								/>
								<Form.Check
									type="radio"
									label="Não"
									name="e_lote"
									id="e_lote_nao"
									onChange={() => formik.setFieldValue("e_lote", false)}
									checked={formik.values.e_lote === false}
									inline
								/>
								<OverlayTrigger
									key="tooltip-overlay-lote"
									placement="bottom"
									overlay={
										<Tooltip id={`tooltip-bottom`}>
											O campo Lote é para sinalizar o tipo de carga. Quando o
											lote é Sim (Representa uma quantidade expressiva de volume
											de cargas que devem ser retiradas). Quando Lote é Não
											(Representa uma carga com um volume único).
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
					</Row>
					<hr className="mb-5" />
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
								<AutocompleteInput
									keyDataList="origem_carga"
									options={locaisOrigemCarga.map(
										(i) => `${i.cidade}/${i.estado}`
									)}
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
								<AutocompleteInput
									keyDataList="destino_carga"
									options={locaisDestinoCarga.map(
										(i) => `${i.cidade}/${i.estado}`
									)}
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
										value={distancia}
										readOnly
									/>
								</FloatingLabel>
							</Col>
						</Row>
					)}
					<Row>
						<Col>
							<FloatingLabel label="*Coleta" className="mb-3">
								<Form.Control
									type="date"
									placeholder=" "
									name="data_coleta"
									value={formik.values.data_coleta}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									required
								/>
							</FloatingLabel>
						</Col>
						<Col>
							<FloatingLabel label="*Entrega" className="mb-3">
								<Form.Control
									type="date"
									placeholder=" "
									name="data_entrega"
									value={formik.values.data_entrega}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									required
								/>
							</FloatingLabel>
						</Col>
					</Row>
					{formik.values.e_lote && (
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
							<FloatingLabel label="*Tipo material" className="mb-3">
								<AutocompleteInput
									keyDataList="tipo_carga"
									options={produtos.filter((i) => !!i.ativo).map((i) => i.nome)}
									onChange={formik.handleChange}
									value={formik.values.tipo_carga}
									name="tipo_carga"
									required
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
										>
											<option value=""></option>
											<option value="CX">CAIXA</option>
											<option value="KG">KG</option>
											<option value="L">LITROS</option>
											<option value="M3">METROS CÚBICOS</option>
											<option value="PAL">PALLET</option>
											<option value="PEÇ">PEÇA</option>
											<option value="TON">TONELADA</option>
											<option value="UN">UNIDADE</option>
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
								<Form.Label>Pre-Requisitos e Acessórios do veículo</Form.Label>
								<Form.Control
									placeholder="Neste campo é adicionado informações: Carga necessita de curso atualizado ao cliente, cinta e luvas"
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
								<Form.Label>Informações Restritivas do Véiculo</Form.Label>
								<Form.Control
									placeholder="Neste campo é adicionado informações: Carga necessita de um Truck (6x2)"
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
									placeholder="Neste campo é adicionado informações: Frete será pago por peso"
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

					<Row>
						<Col>
							<Button variant="success" type="submit" className="p-3 fw-bold">
								Gravar
							</Button>
						</Col>
						<Col className="text-center">
							<Button
								variant="warning"
								className="p-3 fw-bold"
								onClick={handleCloseWindow}
							>
								Cancelar
							</Button>
						</Col>
						<Col className="text-end">
							<Button
								variant="danger"
								className="p-3 fw-bold"
								onClick={handleExcluirCarga}
							>
								Excluir
							</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		</>
	);
}

export default Manual;
