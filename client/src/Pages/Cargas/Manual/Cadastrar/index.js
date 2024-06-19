import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import useLoadingScreen from "../../../Components/LoadingScreen";
import ServiceCargas from "../../../../services/ServiceCargas";
import swal from "sweetalert";
import { getClaims } from "../../../../MicrosoftAuthentication";
import ServiceProdutos from "../../../../services/ServiceProdutos";
import FormularioCadastroManual from "../../../Components/FormularioCadastroManual";
import { useHistory } from "react-router-dom";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import "./cadastroManual.css";
import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";
import { envioCargaApp } from "src/Pages/Components/DataAppConcentrador";
import { funcScrollTop } from "src/Pages/Utils/scrollTop";

function Manual() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [produtos, setProdutos] = useState([]);
	const [distancia, setDistancia] = useState(null);
	const [isViwsCargaApp, setViwsCargaApp] = useState(false);
	const [isDisabledPlaca, setDisabledPlaca] = useState(false);
	const [isDisableColetaEntrega, setDisableColetaEntrega] = useState(false);
	const { isPermissionUser } = useContext(ContextUseDefault);
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
			observacao: "",
			acessorios_requisitos: "",
			informacoes_restritivas: "",
			janela_coleta: "",
			janela_entrega: "",
			local_coleta: "",
			local_entrega: "",
			placa_veiculo: "",
			documento_transporte: "",
			carga_app: 0,
			valor_frete: 0,
			forca_trabalho: 0,
			tipo_viagem: 1,
			estilo_carga: 1,
			quantidade_cargas: 0,
			data_limite_oferta: "",
			idCargaMae: null,
		},
		onSubmit: async (values) => {
			setLoading(true);

			if (typeof values.forca_trabalho == "object") {
				values.forca_trabalho = values.forca_trabalho.value;
			}
			if (typeof values.tipo_viagem == "object") {
				values.tipo_viagem = values.tipo_viagem.value;
			}
			if (typeof values.estilo_carga == "object") {
				values.estilo_carga = values.estilo_carga.value;
			}
			try {
				values.fk_filial = await values.fk_filial.split("-")[0];
				const { data } = await ServiceCargas.create({
					...values,
					canal_comunicacao: "manual",
					carga_csn: 0,
				});

				if (values.carga_app === 1 && data) {
					const oid = getClaims().oid;
					const idCarga = String(data.data.id);
					const bodyApp = {
						...values,
						oid,
						idCarga,
					};
					envioCargaApp(bodyApp);
				}
				swal(
					"Sucesso!",
					`Carga cadastrada com o identificador ${data.data.id}!`,
					"success"
				);
				setDisabledPlaca(false);
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

	useEffect(() => {
		if (isPermissionUser?.includes("ENVIAR_CARGA_APP")) setViwsCargaApp(true);
	}, [isPermissionUser]);

	function resetForm() {
		funcScrollTop(2, 2);
		formik.resetForm();
		formik.setFieldValue("id", "(gerado automaticamente)");
		setDisableColetaEntrega(false);
	}

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<div>
				<p id="title-cad-manual">Cadastro de Carga - Manual</p>
			</div>
			<Container className="mb-3 mt-2" style={{ scrollBehavior: "none" }}>
				<Form onSubmit={formik.handleSubmit}>
					<FormularioCadastroManual
						buscarCargaComDocumentoDeTransporte={
							buscarCargaComDocumentoDeTransporte
						}
						handleSearchDistance={handleSearchDistance}
						produtos={produtos}
						distancia={distancia}
						formik={formik}
						isViwsCargaApp={isViwsCargaApp}
						isDisabledPlaca={isDisabledPlaca}
						setDisabledPlaca={setDisabledPlaca}
						status={"Cadastro"}
						isDisableColetaEntrega={isDisableColetaEntrega}
						setDisableColetaEntrega={setDisableColetaEntrega}
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
}

export default Manual;
