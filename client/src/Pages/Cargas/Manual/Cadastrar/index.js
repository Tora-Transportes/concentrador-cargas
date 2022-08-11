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
import createSequence from "tooltip-sequence";
import "../../../Styles/index.css";

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

	const options = {
		backdropColor: "#6262625d",
		sequence: [
			{
				element: "#button-cad-carga",
				description:
					"<h2>Don't forget to import!</h2><div>Add these lines when using in a front end framework.</div>",
				placement: "bottom",
			},
			{
				element: "#Codigo-filial",
				description:
					"<h2>Campos iniciais!</h2><div>Os campos a cima são inseridos automaticamente</div>",
				placement: "top",
			},
			{
				element: "#doc-trans",
				description:
					"<h2>Documento</h2><div>Option to place the tooltip on the top of the element.</div>",
				placement: "top",
			},
			{
				element: "#e_lote_sim",
				description:
					"<h2>Placement - Right!</h2><div>será necessário adicionar algumas informações como informar um cliente, origem de carga, destino de carga etc</div>",
				placement: "bottom",
			},
			{
				element: "#e_lote_nao",
				description:
					"<h2>Installation Package!</h2><div>Será necessário adicionar informações do caminhão e do motorista </div>",
				placement: "bottom",
			},
			{
				element: "#title-check-não",
				description:
					"<h2>Dados do Veículo</h2><div>Será necessário adicionar informações do caminhão e do motorista </div>",
				placement: "bottom",
			},
			{
				element: "#Plca-cavalo",
				description:
					"<h2>Informações</h2><div>Será necessário adicionar informações do caminhão e do motorista </div>",
				placement: "top",
			},
			{
				element: "#",
				description:
					"<h2>Installation Package!</h2><div>Será necessário adicionar informações do caminhão e do motorista </div>",
				placement: "bottom",
			},
		],
		onComplete: function () {
			console.log("Completed!");
		},
	};

	function handleClick(event) {
		event.preventDefault();
		createSequence(options);
	}

	return (
		<>
			<LoadingScreen />
			<CabecalhoFixado>Cadastro de carga aberta manualmente</CabecalhoFixado>
			<Button onClick={handleClick} id="button-cad-carga">
				Ajuda
			</Button>
			<Container className="mb-5 mt-5">
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
							<Button variant="success" type="submit" className="p-3 fw-bold">
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
