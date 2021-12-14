import React, { useEffect, useState } from "react";
import {
	Container,
	Row,
	Col,
	Form,
	FormControl,
	Button,
	Card,
	ListGroup,
	ListGroupItem,
	InputGroup,
	Modal,
} from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import NavbarNavigator from "../../../Components/NavbarNavigator";
import useLoadingScreen from "../../../Components/LoadingScreen";
import swal from "sweetalert";
import ServiceCargas from "../../../../services/ServiceCargas";
import { getClaims } from "../../../../MicrosoftAuthentication";
import ServiceProdutos from "src/services/ServiceProdutos";
import ServiceVeiculos from "src/services/ServiceVeiculos";
import FormularioCadastroManual from "src/Pages/Components/FormularioCadastroManual";

function Manual() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const { id } = useParams();
	const history = useHistory();
	const [produtos, setProdutos] = useState([]);
	const [distancia, setDistancia] = useState(null);
	const [veiculo, setVeiculo] = useState(null);

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

			local_coleta: "",
			local_entrega: "",

			placa_veiculo: "",
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

	async function handleCloseWindow(e, askPermission = true) {
		if (e) {
			e.preventDefault();
		}
		let ok = true;
		if (askPermission) {
			ok = await swal(
				"Ops !",
				"Tem certeza que deseja fechar esta página ?",
				"warning",
				{
					buttons: ["Cancelar", { text: "Sim", value: true }],
					dangerMode: true,
				}
			);
		}
		if (ok) {
			window.open("", "_self").close();
		}
	}

	async function handleSearchVehicle() {
		const placa = (formik.values.placa_veiculo || "").toUpperCase().trim();
		if (!placa || !formik.values.placa_veiculo) {
			setVeiculo(null);
		} else {
			const v = (await ServiceVeiculos.get(placa)).data.data;
			setVeiculo(v);
		}
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
				handleCloseWindow(null, false);
			}
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

	async function handleSearchDistance({ destino_carga, origem_carga }) {
		if (destino_carga && origem_carga) {
			const [, estado_origem, cidade_origem] = origem_carga.split("/");
			const [, estado_destino, cidade_destino] = destino_carga.split("/");
			try {
				const { data } = await ServiceCargas.getDistance({
					cidade_origem,
					cidade_destino,
					estado_origem,
					estado_destino,
				});
				const distance = data.data;
				setDistancia(distance);
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
		async function run() {
			try {
				const carga = (await ServiceCargas.index({ id })).data.data;
				for (const i in carga) {
					if (i.indexOf("data") !== -1) {
						formik.setFieldValue(i, carga[i]?.split("T")[0]);
					} else if (i === "e_lote") {
						formik.setFieldValue("e_lote", !!carga[i]);
					} else {
						formik.setFieldValue(i, carga[i]);
					}
				}
				if (carga.placa_veiculo) {
					handleSearchVehicle();
				}
				handleSearchDistance(carga);
			} catch (error) {
				history.push("/cargas/menu");
			}
			if (isMounted) {
				setLoading(false);
			}
		}
		run();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		setDistancia(null);
	}, [formik.values.destino_carga, formik.values.origem_carga]);

	useEffect(() => {
		formik.setFieldValue("placa_veiculo", "");
		setVeiculo(null);
	}, [formik.values.e_lote]);

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
					<FormularioCadastroManual
						handleSearchDistance={handleSearchDistance}
						produtos={produtos}
						distancia={distancia}
						formik={formik}
					/>

					<Row className="mb-5">
						<Col>
							<InputGroup className="mb-2">
								<InputGroup.Text>
									<Button variant="" onClick={handleSearchVehicle}>
										Placa 🔎
									</Button>
								</InputGroup.Text>
								<FormControl
									placeholder="Placa veículo"
									disabled={formik.values.e_lote}
									type="text"
									name="placa_veiculo"
									value={formik.values.placa_veiculo}
									onChange={formik.handleChange}
									required
								/>
							</InputGroup>
							<Modal show={veiculo !== null} onHide={() => setVeiculo(null)}>
								<Modal.Header closeButton>
									<Modal.Title>Dados do veículo</Modal.Title>
								</Modal.Header>
								{veiculo && (
									<Card>
										<ListGroup className="list-group-flush">
											<ListGroupItem>
												<b>ID</b>: {veiculo.id_veiculo}
											</ListGroupItem>
											<ListGroupItem>
												<b>Placa</b>: {veiculo.placa}
											</ListGroupItem>
											<ListGroupItem>
												<b>Descrição</b>: {veiculo.descricao}
											</ListGroupItem>
											<ListGroupItem>
												<b>Ano</b>: {veiculo.ano}
											</ListGroupItem>
											<ListGroupItem>
												<b>Chassis</b>: {veiculo.chassis}
											</ListGroupItem>
											<ListGroupItem>
												<b>Placa Carreta</b>: {veiculo.placa_carreta}
											</ListGroupItem>
										</ListGroup>
									</Card>
								)}
							</Modal>
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
								Fechar edição
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
