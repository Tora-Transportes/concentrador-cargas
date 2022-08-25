import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import useLoadingScreen from "../../../Components/LoadingScreen";
import ServiceCargas from "../../../../services/ServiceCargas";
import swal from "sweetalert";
import { getClaims } from "../../../../MicrosoftAuthentication";
import ServiceProdutos from "../../../../services/ServiceProdutos";
import FormularioCadastroManual from "../../../Components/FormularioCadastroManual";
// import CabecalhoFixado from "../../../Components/CabecalhoFixado";
import { useHistory } from "react-router-dom";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { MdOutlineWavingHand } from "react-icons/md";
import "../Cadastrar/style.css";
// import createSequence from "tooltip-sequence";

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

	// const options = {
	// 	backdropColor: "#6262625d",
	// 	sequence: [
	// 		{
	// 			element: "#title-cad-manual",
	// 			description:
	// 				"<h2>Formulário</h2><div>Nesta etapa irá realizar o Cadastro da Carga Manual.</div>",
	// 			placement: "bottom",
	// 		},
	// 		{
	// 			element: "#campo-aut",
	// 			description:
	// 				"<h2>Campos Iniciais!</h2><div>O campo Responsável pelo cadastro e código de carga será preenchido automaticamente, assim que o campo Documento de Transporte for preenchido.</div>",
	// 			placement: "top",
	// 		},
	// 		{
	// 			element: "#Codigo-filial",
	// 			description:
	// 				"<h2>Código Filial</h2><div>Entre com o código da filial da Carga.</div>",
	// 			placement: "top",
	// 		},
	// 		{
	// 			element: "#doc-trans",
	// 			description:
	// 				"<h2>Documento</h2><div>Entre com o Documento de Transporte de seu Cliente.</div>",
	// 			placement: "top",
	// 		},
	// 		{
	// 			element: "#e_lote_sim",
	// 			description:
	// 				"<h2>É lote - <strong>SIM</strong></h2><div>será necessário adicionar algumas informações como informar um cliente, origem de carga, destino de carga etc. Sem necessidade dos dados do veículo.</div>",
	// 			placement: "bottom",
	// 		},
	// 		{
	// 			element: "#e_lote_nao",
	// 			description:
	// 				"<h2>É lote - <strong>NÃO</strong></h2><div>Será necessário adicionar os Dados do Veículo. </div>",
	// 			placement: "bottom",
	// 		},
	// 		{
	// 			element: "#title-check-não",
	// 			description:
	// 				"<h2>Dados do Veículo</h2><div>Este campo só será visivél quando marcar a opção Não do checkbox.</div>",
	// 			placement: "top",
	// 		},
	// 		{
	// 			element: "#Plca-cavalo",
	// 			description:
	// 				"<h2>Informações</h2><div>Após preencher este campo os outros será autopreenchido</div>",
	// 			placement: "top",
	// 		},
	// 		{
	// 			element: "#botao-detail-veiculo",
	// 			description:
	// 				"<h2>Detalhes Veículo!</h2><div>Ao clicar no botão irá abrir um modal com informações dos Detalhes do veículo.</div>",
	// 			placement: "bottom",
	// 		},
	// 		{
	// 			element: "#botao-deb-veiculo",
	// 			description:
	// 				"<h2>Débito Veículo</h2><div>Ao clicar no botão irá abrir um modal com informações dos Débitos do veículo.</div>",
	// 			placement: "bottom",
	// 		},
	// 		{
	// 			element: "#info-clie",
	// 			description:
	// 				"<h2>Insira as Informações do Cliente</h2><div>Entre com as informações do cliente nos campos abaixo.</div>",
	// 			placement: "top",
	// 		},
	// 		{
	// 			element: "#info-add",
	// 			description:
	// 				"<h2>Aréas de Texto</h2><div>Nos campos de texto abaixo inserir informações de acordo com sua necessidade para cada iinformação em expecifico terá um campo de texto disponível.</div>",
	// 			placement: "top",
	// 		},
	// 		{
	// 			element: "#botao-add",
	// 			description:
	// 				"<h2>Botão Adicionar</h2><div>Se no trajeto do motorista houver uma parada inserir no campo que irá abrir clicando no Botão Adicionar.</div>",
	// 			placement: "top",
	// 		},
	// 		{
	// 			element: "#botao-cadastrar-carg",
	// 			description:
	// 				"<h2>Botão Cadastrar</h2><div>Ao clicar no Botão Cadastrar você usuário finalizara o cadastro.</div>",
	// 			placement: "top",
	// 		},
	// 	],
	// 	onComplete: function () {
	// 		window.location.reload();
	// 	},
	// };

	// function handleClick(event) {
	// 	event.preventDefault();
	// 	createSequence(options);
	// }

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<div className="class-title-icon">
				<p id="title-cad-manual" className="class-titlte-cad1">
					Cadastro de Carga - Manual
				</p>
				<MdOutlineWavingHand
					size={30}
					style={{ color: "#00652E", marginRight: "48rem", marginTop: ".5rem" }}
					id="hand"
				/>
			</div>
			<div className="class-linha-title">
				<hr></hr>
			</div>
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
