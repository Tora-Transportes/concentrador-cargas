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
import ServiceRecomendacoes from "src/services/ServiceRecomendacoes";
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
			destino_carga: "",
			origem_carga: "",
			data_coleta: "",
			data_entrega: "",
			tipo_carga: "",
			quantidade: "",
			unidade_medida: "KG",
			acessorios_requisitos: "",
			informacoes_restritivas: "",
			janela_coleta: "",
			janela_entrega: "",
			local_coleta: "",
			local_entrega: "",
			placa_veiculo: "",
			documento_transporte: "",
			ponto_passagem: {
				ponto: " 60 - POSTO - 30",
				tipoServico: "Coleta",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: "",
			},
			ponto_passagem2: {
				ponto: "51 - MUNDO - CSN",
				tipoServico: "Coleta",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: "",
			},
			ponto_passagem3: {
				ponto: "59 - PEACAO - CSN",
				tipoServico: "Coleta",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: "",
			},
			ponto_passagem4: {
				ponto: "",
				tipoServico: "Entrega",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: "",
			},
			ponto_passagem5: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: "",
			},
			ponto_passagem6: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: "",
			},
			ponto_passagem7: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: "",
			},
			ponto_passagem8: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: "",
			},
			ponto_passagem9: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: "",
			},
			ponto_passagem10: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: "",
			},
			ponto_passagem11: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: "",
			},
			ponto_passagem12: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: "",
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
				} = values;
				values.fk_filial = await values.fk_filial.split("-")[0];

				const chaves = Object.keys(values);
				const todos = chaves.map((chave) => values[chave]);
				const filtrados = todos.filter((item) => {
					return item?.tipoServico === "Entrega";
				});
				const dadosUltimoParada = filtrados[filtrados.length - 1];
				const separandoNomeCidade = await dadosUltimoParada.client?.split(
					"-"
				)[2];
				const cidadeEstado = separandoNomeCidade.split("/");

				const resultLocalidade = (
					await ServiceRecomendacoes.locaisPorUf({
						uf: cidadeEstado[1],
						cidade: cidadeEstado[0],
					})
				).data.data;

				const pais = resultLocalidade ? resultLocalidade?.pais : "BRASIL";
				const destinoCarga = `${pais}/${cidadeEstado[1]}/${cidadeEstado[0]}`;

				const data = (
					await ServiceCargas.create({
						...values,
						canal_comunicacao: "manual",
						carga_csn: 1,
						origem_carga: "BRASIL/RJ/VOLTA REDONDA",
						destino_carga: destinoCarga.replace(" ", ""),
						data_coleta: ponto_passagem.previsao,
						data_entrega: dadosUltimoParada.previsao,
					})
				).data;

				if (data.data.id) {
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
					})) {
						if (
							(value?.ponto.length > 0 && value?.previsao.length > 0) ||
							(typeof value?.latitude !== "string" &&
								typeof value?.longitude !== "string")
						) {
							await ServiceCargas.createPontoParada({
								...value,
								id_carga: data.data.id,
								key,
							});
						}
					}

					const ok = await swal(
						"Sucesso!",
						`A carga foi cadastrada com o identificador ${data.data.id}!`,
						"success"
					);

					if (ok) resetForm();
				}
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
		window.location.reload();
	}

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<div>
				<p id="title-cad-CSN">Cadastro de Carga - CSN</p>
			</div>
			<Container className="mb-5 mt-2" style={{ scrollBehavior: "none" }}>
				<Form onSubmit={formik.handleSubmit}>
					<FormularioCadastroCSN
						buscarCargaComDocumentoDeTransporte={
							buscarCargaComDocumentoDeTransporte
						}
						produtos={produtos}
						formik={formik}
						history={history}
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
