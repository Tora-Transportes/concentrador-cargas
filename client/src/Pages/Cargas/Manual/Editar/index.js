import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import useLoadingScreen from "../../../Components/LoadingScreen";
import swal from "sweetalert";
import ServiceCargas from "../../../../services/ServiceCargas";
import { getClaims } from "../../../../MicrosoftAuthentication";
import ServiceProdutos from "src/services/ServiceProdutos";
import FormularioCadastroManual from "src/Pages/Components/FormularioCadastroManual";
import CabecalhoFixado from "src/Pages/Components/CabecalhoFixado";

function Manual() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const { id } = useParams();
	const history = useHistory();
	const [produtos, setProdutos] = useState([]);
	const [distancia, setDistancia] = useState(null);
	const [loteInicial, setLoteInicial] = useState(0);

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

			fk_situacao: null,
		},
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const { data } = await ServiceCargas.update({
					...values,
					responsavel_cadastro: String(getClaims().name),
					fk_situacao: undefined,
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
				await swal("Sucesso!", "Carga removida", "success");
				handleCloseWindow(null, false);
			}
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

	async function handleCancelarCarga() {
		setLoading(true);
		try {
			const ok = await swal(
				"OPS?",
				"Tem certeza que deseja cancelar a carga atual ?",
				{
					buttons: ["Não", true],
					dangerMode: true,
					icon: "warning",
				}
			);
			if (ok) {
				await ServiceCargas.update({ ...formik.values, fk_situacao: 5 });
				await swal("Sucesso!", "Carga cancelada", "success");
				// handleCloseWindow(null, false);
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
				setLoteInicial(carga.e_lote);
				for (const i in carga) {
					const nonNullValue = carga[i] === null ? "" : carga[i];
					if (i.indexOf("data") !== -1) {
						formik.setFieldValue(i, nonNullValue?.split("T")[0]);
					} else if (i === "e_lote") {
						formik.setFieldValue("e_lote", !!nonNullValue);
					} else {
						formik.setFieldValue(i, nonNullValue);
					}
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
	}, [formik.values.e_lote]);

	useEffect(() => {
		ServiceProdutos.list().then(({ data }) => {
			setProdutos(data.data);
		});
	}, []);

	return (
		<>
			<LoadingScreen />
			<CabecalhoFixado>Edição de carga aberta manualmente</CabecalhoFixado>
			<Container className="mb-5 mt-5">
				<Form onSubmit={formik.handleSubmit}>
					<FormularioCadastroManual
						handleSearchDistance={handleSearchDistance}
						produtos={produtos}
						distancia={distancia}
						formik={formik}
						disabledFields={
							loteInicial ? ["e_lote", "unidade_medida", "quantidade"] : []
						}
					/>
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
							{formik.values.fk_situacao !== 3 && (
								<Button
									variant="danger"
									className="p-3 fw-bold"
									onClick={handleExcluirCarga}
								>
									Excluir
								</Button>
							)}
							{formik.values.fk_situacao === 3 && (
								<Button
									variant="danger"
									className="p-3 fw-bold"
									onClick={handleCancelarCarga}
								>
									Cancelar carga
								</Button>
							)}
						</Col>
					</Row>
				</Form>
			</Container>
		</>
	);
}

export default Manual;
