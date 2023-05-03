import React, { useState, useEffect, useContext } from "react";
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
import {
	formatDateAddHours,
	formatDateAddminutes,
} from "src/Pages/Utils/formatDate";
import { InputReferencError } from "src/Pages/Components/FormularioCadastroCSN/management";
import { funcScrollTop } from "src/Pages/Utils/scrollTop";
import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";
import { envioCargaApp } from "src/Pages/Components/DataAppConcentrador";
const CadastroCargaCSN = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [produtos, setProdutos] = useState([]);
	const [isDateErrorInput, setDateErrorInput] = useState(InputReferencError);
	const [isViwsCargaApp, setViwsCargaApp] = useState(false);
	const [isDisabledPlaca, setDisabledPlaca] = useState(false);
	const { isPermissionUser } = useContext(ContextUseDefault);
	const history = useHistory();
	const dataAtual = new Date();

	const dataMais40minutos = formatDateAddminutes(dataAtual, 40);
	const formik = useFormik({
		initialValues: {
			responsavel_cadastro: String(getClaims().name),
			id: "(Será autogerado)",
			e_lote: false,
			cliente:
				"COMPANHIA SIDERURGICA NACIONAL - 33042730001771 - VOLTA REDONDA/RJ",
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
			fk_filial: "128 - VOLTA REDONDA",
			carga_app: 0,
			ponto_passagem: {
				ponto: " 60 - POSTO - 30",
				tipoServico: "Coleta",
				previsao: formatDateAddminutes(dataAtual, 5),
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: formatDateAddminutes(dataAtual, 35),
			},
			ponto_passagem2: {
				ponto: "51 - MUNDO - CSN",
				tipoServico: "Coleta",
				previsao: dataMais40minutos,
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: formatDateAddHours(dataMais40minutos, 3),
			},
			ponto_passagem3: {
				ponto: "59 - PEACAO - CSN",
				tipoServico: "Coleta",
				previsao: formatDateAddHours(dataAtual, 4),
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: formatDateAddHours(dataAtual, 5),
			},
			ponto_passagem4: {
				ponto: "",
				tipoServico: "Entrega",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				previsaoSaida: "",
				entregaFinal: 0,
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
		},
		onSubmit: async (values) => {
			setLoading(true);
			const existInputErrado = isDateErrorInput.find(
				(item) => item.error === true
			);
			if (existInputErrado?.error) {
				swal(
					"Atenção",
					"Não foi possível registrar as informações, verifique os campos de data antes de continuar.!",
					"info"
				);
			} else {
				try {
					const {
						ponto_passagem,
						ponto_passagem2,
						ponto_passagem3,
						ponto_passagem4,
						ponto_passagem5,
						ponto_passagem6,
						ponto_passagem7,
					} = values;
					values.fk_filial = values.fk_filial.split("-")[0];
					values.rastreador = values.rastreador
						? values.rastreador
						: values.rastreador_carreta;

					const separandoNomeCidade = ponto_passagem4.client?.split("-")[2];
					const cidadeEstado = separandoNomeCidade.split("/");

					const resultLocalidade = (
						await ServiceRecomendacoes.locaisPorUf({
							uf: cidadeEstado[1],
							cidade: cidadeEstado[0],
						})
					).data.data;

					const pais = resultLocalidade ? resultLocalidade?.pais : "BRASIL";
					const destinoCarga = `${pais}/${cidadeEstado[1]}/${cidadeEstado[0]}`;

					const dataColeta = ponto_passagem.previsao;
					const dataEntrega = ponto_passagem4.previsao;

					const data = (
						await ServiceCargas.create({
							...values,
							canal_comunicacao: "manual",
							carga_csn: 1,
							origem_carga: "BRASIL/RJ/VOLTA REDONDA",
							destino_carga: destinoCarga.replace(" ", ""),
							data_coleta: dataColeta,
							data_entrega: dataEntrega,
						})
					).data;

					if (data.data.id) {
						let messagemSucesso = `A carga foi cadastrada com o identificador ${data.data.id}!`;
						if (values.carga_app === 1) {
							messagemSucesso = `A carga foi cadastrada e enviada para  o App com o identificador ${data.data.id}!`;
							const oid = getClaims().oid;
							const idCarga = String(data.data.id);
							const bodyApp = {
								...values,
								oid,
								idCarga,
								origem_carga: "BRASIL/RJ/VOLTA REDONDA",
								destino_carga: destinoCarga.replace(" ", ""),
								data_coleta: dataColeta,
								data_entrega: dataEntrega,
							};
							envioCargaApp(bodyApp);
						}
						const dadosPontoPassagem = {
							ponto_passagem,
							ponto_passagem2,
							ponto_passagem3,
							ponto_passagem4,
							ponto_passagem5,
							ponto_passagem6,
							ponto_passagem7,
						};
						await ServiceCargas.createPontoParada({
							...dadosPontoPassagem,
							id_carga: data.data.id,
						});
						const ok = await swal("Sucesso!", messagemSucesso, "success", {
							closeOnClickOutside: false,
						});
						//funcScrollTop(2, 2);
						setDisabledPlaca(false);
						if (ok) resetForm();
					}
				} catch (error) {
					console.log(error);
				}
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
		funcScrollTop(2, 2);
	}, []);

	useEffect(() => {
		if (isPermissionUser?.includes("ENVIAR_CARGA_APP")) setViwsCargaApp(true);
	}, [isPermissionUser]);

	function resetForm() {
		window.location.reload();
	}
	const dataComponenteIndex = {
		buscarCargaComDocumentoDeTransporte,
		produtos,
		formik,
		history,
		setDateErrorInput,
		isDateErrorInput,
		isViwsCargaApp,
		isDisabledPlaca,
		setDisabledPlaca,
		status: "Cadastro",
	};
	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<div>
				<p id="title-cad-CSN">Cadastro de Carga - CSN</p>
			</div>
			<Container className="mb-5 mt-2" style={{ scrollBehavior: "none" }}>
				<Form onSubmit={formik.handleSubmit}>
					<FormularioCadastroCSN dataComponenteIndex={dataComponenteIndex} />
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
