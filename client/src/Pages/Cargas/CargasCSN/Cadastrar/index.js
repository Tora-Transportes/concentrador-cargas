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
import { valueFormik } from "../management/valueFormik";
// import HandleClick from "./tooltipsCadastro";

const CadastroCargaCSN = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [produtos, setProdutos] = useState([]);
	//const [distancia, setDistancia] = useState(null);
	const history = useHistory();

	const formik = useFormik({
		initialValues: valueFormik,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				console.log("Values formik", values);
				const data = "2222222"; //await ServiceCargas.create({
				// 	...values,
				// 	canal_comunicacao: "manual",
				// });
				swal(
					"Sucesso!",
					`A carga foi cadastrada com o identificador ${data}!`,
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
