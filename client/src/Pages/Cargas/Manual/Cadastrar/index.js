import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import useLoadingScreen from "../../../Components/LoadingScreen";
import ServiceCargas from "../../../../services/ServiceCargas";
import swal from "sweetalert";
import { getClaims } from "../../../../MicrosoftAuthentication";
import ServiceProdutos from "../../../../services/ServiceProdutos";
import FormularioCadastroManual from "../../../Components/FormularioCadastroManual";
import CabecalhoFixado from "../../../Components/CabecalhoFixado";
import { useHistory } from "react-router-dom";

function Manual() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [produtos, setProdutos] = useState([]);
	const [distancia, setDistancia] = useState(null);
	const history = useHistory();

	const formik = useFormik({
		initialValues: {
			responsavel_cadastro: String(getClaims().name),
			id: "(Vai ser auto gerado)",
			e_lote: false,
			cliente: "",
			destino_carga: "",
			origem_carga: "",
			data_coleta: "",
			data_entrega: "",
			tipo_carga: "",
			quantidade: "",
			unidade_medida: "",
			observacao: "",
			acessorios_requisitos: "",
			informacoes_restritivas: "",

			janela_coleta: "",
			janela_entrega: "",

			local_coleta: "",
			local_entrega: "",

			placa_veiculo: "",

			documento_transporte: "",
		},
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const { data } = await ServiceCargas.create({
					...values,
					canal_comunicacao: "manual",
				});
				swal(
					"Sucesso",
					`A carga foi cadastrada com o identificador ${data.data.id}`,
					"success"
				);
				resetForm();
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});

	useEffect(() => {
		setDistancia(null);
	}, [formik.values.destino_carga, formik.values.origem_carga]);

	function buscarCargaComDocumentoDeTransporte({ documento_transporte, id }) {
		if (documento_transporte) {
			ServiceCargas.search({
				documento_transporte,
			}).then(({ data: { data } }) => {
				const cargaDocumento = data.results.find(
					(i) => i.documento_transporte === documento_transporte && i.id !== id
				);
				if (cargaDocumento) {
					swal(
						"Ops !",
						`O documento digitado já existe na carga ${cargaDocumento.id}!`,
						"warning",
						{
							buttons: ["Continuar cadastrando", "Editar carga"],
						}
					).then((mudarDeTela) => {
						if (mudarDeTela) {
							history.push(`/cargas/manual/${cargaDocumento.id}`);
						} else {
							formik.setFieldValue(
								"documento_transporte",
								documento_transporte
							);
						}
					});
				}
			});
		}
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
		ServiceProdutos.list().then(({ data }) => {
			setProdutos(data.data);
		});
	}, []);

	function resetForm() {
		formik.resetForm();
		formik.setFieldValue("id", "(Vai ser auto gerado)");
	}

	return (
		<>
			<LoadingScreen />
			<CabecalhoFixado>Cadastro de carga aberta manualmente</CabecalhoFixado>
			<Container className="mb-5 mt-5" style={{ scrollBehavior: "none" }}>
				<Form onSubmit={formik.handleSubmit}>
					<FormularioCadastroManual
						buscarCargaComDocumentoDeTransporte={
							buscarCargaComDocumentoDeTransporte
						}
						handleSearchDistance={handleSearchDistance}
						produtos={produtos}
						distancia={distancia}
						formik={formik}
					/>
					<Row>
						<Col>
							<Button
								variant="success"
								type="submit"
								className="p-3 fw-bold"
								id="botao-cadastrar-carg"
							>
								Cadastrar
							</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		</>
	);
}

export default Manual;
