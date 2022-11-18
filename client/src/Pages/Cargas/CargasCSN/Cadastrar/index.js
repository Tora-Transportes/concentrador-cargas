import React, { useState, useEffect } from "react";
import "./cadastrarCSN.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import useLoadingScreen from "../../../Components/LoadingScreen";
import ServiceCargas from "../../../../services/ServiceCargas";
import swal from "sweetalert";
import ServiceProdutos from "../../../../services/ServiceProdutos";
import FormularioCadastroCSN from "../../../Components/FormularioCadastroCSN";
import { useHistory } from "react-router-dom";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { getClaims } from "src/MicrosoftAuthentication";
//import { valueFormik } from "../management/valueFormik";
const CadastroCargaCSN = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [produtos, setProdutos] = useState([]);
	const history = useHistory();

	const formik = useFormik({
		initialValues: {
			responsavel_cadastro: String(getClaims().name),
			id: "(Será autogerado)",
			e_lote: false,
			cliente: "",
			data_coleta: "",
			data_entrega: "",
			tipo_carga: "",
			quantidade: "",
			unidade_medida: "",
			acessorios_requisitos: "",
			informacoes_restritivas: "",
			janela_coleta: "",
			janela_entrega: "",
			placa_veiculo: "",
			documento_transporte: "",
			ponto_passagem: {
				ponto: " 45 - POSTO - 30",
				tipoServico: "Coleta",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
			},
			ponto_passagem2: {
				ponto: "47 - MUNDO - CSN",
				tipoServico: "Coleta",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
			},
			ponto_passagem3: {
				ponto: "46 - PEACAO - CSN",
				tipoServico: "Coleta",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
			},
			ponto_passagem4: {
				ponto: "",
				tipoServico: "Entrega",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
			},
			ponto_passagem5: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
			},
			ponto_passagem6: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
			},
			ponto_passagem7: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
			},
			ponto_passagem8: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
			},
			ponto_passagem9: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
			},
			ponto_passagem10: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
			},
			ponto_passagem11: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
			},
			ponto_passagem12: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
			},
		},
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const {
					ponto_passagem,
					ponto_passagem2,
					ponto_passagem3,
					ponto_passagem4,
					ponto_passagem5,
					ponto_passagem6,
					ponto_passagem7,
					ponto_passagem8,
					ponto_passagem9,
					ponto_passagem10,
					ponto_passagem11,
					ponto_passagem12,
				} = values;
				values.fk_filial = await values.fk_filial.split("-")[0];
				const data = (
					await ServiceCargas.create({
						...values,
						canal_comunicacao: "manual",
					})
				).data;

				if (data.data.id) {
					// const apagar = true;
					// if (apagar) {
					for (const [key, value] of Object.entries({
						ponto_passagem,
						ponto_passagem2,
						ponto_passagem3,
						ponto_passagem4,
						ponto_passagem5,
						ponto_passagem6,
						ponto_passagem7,
						ponto_passagem8,
						ponto_passagem9,
						ponto_passagem10,
						ponto_passagem11,
						ponto_passagem12,
					})) {
						if (
							(value?.ponto.length > 0 && value?.previsao.length > 0) ||
							(typeof value?.latitude !== "string" &&
								typeof value?.longitude !== "string")
						) {
							await ServiceCargas.createPontoParada({
								...value,
								id_carga: data.data.id,
								//id_carga: 122233987,
								key,
							});
						}
					}
				}

				swal(
					"Sucesso!",
					`A carga foi cadastrada com o identificador ${data.data.id}!`,
					//"A carga foi cadastrada com o identificador 5555555!",
					"success"
				);
				resetForm();
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});

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
						"Ops!",
						`Documento de Transporte já existente na carga ${cargaDocumento.id}.`,
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

	useEffect(() => {
		ServiceProdutos.list().then(({ data }) => {
			setProdutos(data.data);
		});
	}, []);

	function resetForm() {
		formik.resetForm();
		formik.setFieldValue("id", "(gerado automaticamente)");
	}

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<div>
				<p id="title-cad-manual">Cadastro de Carga - CSN</p>
			</div>
			<div className="class-linha-title">
				<hr id="linha-cad-csn"></hr>
			</div>
			<Container className="mb-5 mt-2" style={{ scrollBehavior: "none" }}>
				<Form onSubmit={formik.handleSubmit}>
					<FormularioCadastroCSN
						buscarCargaComDocumentoDeTransporte={
							buscarCargaComDocumentoDeTransporte
						}
						produtos={produtos}
						formik={formik}
					/>
					<Row>
						<Col>
							<Button variant="success" type="submit" id="botao-cadastrar-carg">
								Cadastrar
							</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		</>
	);
};

export default CadastroCargaCSN;
