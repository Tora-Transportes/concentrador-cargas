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
import { funcScrollTop } from "src/Pages/Utils/scrollTop";
import { envioCargaApp } from "src/Pages/Components/DataAppConcentrador";

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
			forca_trabalho: 1,
			tipo_viagem: 1,
			estilo_carga: 1,
			quantidade_cargas: 0,
			data_limite_oferta: "",
			idCargaMae: null,
			prerequisitos: [],
			cpf_motorista: "",
			impulsionar_frete: 0,
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
			if (typeof values.impulsionar_frete == "object") {
				values.impulsionar_frete = values.impulsionar_frete.value;
			}

			if (values.estilo_carga == 2) {
				//escoamento
				values.placa_veiculo = null;
				values.placa_bitrem = null;
				values.placa_carreta = null;
			}
			values.valor_frete = String(values.valor_frete);
			values.valor_frete = Number(values.valor_frete.replace(",", "."));
			try {
				values.fk_filial = values.fk_filial.split("-")[0];
				// console.log({
				// 	...values,
				// 	canal_comunicacao: "manual",
				// 	carga_csn: 0,
				// });

				const { data } = await ServiceCargas.create({
					...values,
					canal_comunicacao: "manual",
					carga_csn: 0,
				});
				// values.valor_frete = String(values.valor_frete);

				console.log(data.data);

				if (values.carga_app === 1 && data) {
					const oid = getClaims().oid;

					envioCargaApp(
						data.data,
						oid,
						data.data.length == 1 ? values.cpf_motorista : ""
					);
				}

				const cargaPrincipal = data.data[0];
				const cargasFilhas = data.data.slice(1);

				const idsCargasFilhas = cargasFilhas
					.map((carga) => carga.id)
					.join(", ");

				const mensagem = `
					Carga cadastrada com sucesso!
					Identificador da carga principal: ${cargaPrincipal.id}
					${
						cargasFilhas.length > 0
							? `Identificadores das cargas filhas: ${idsCargasFilhas}`
							: ""
					}
				`;

				swal("Sucesso!", mensagem, "success");
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
						setLoading={setLoading}
						isPermissionUser={isPermissionUser}
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
