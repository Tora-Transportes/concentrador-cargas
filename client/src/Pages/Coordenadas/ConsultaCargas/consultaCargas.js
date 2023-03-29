import React, { useEffect, useState } from "react";
import "./consultaCarga.css";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import useLoadingScreen from "../../Components/LoadingScreen";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";
import FormularioConsulta from "./formularioConsulta";
import { HiArrowCircleLeft } from "react-icons/hi";

function Consulta() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const { id } = useParams();
	const [loteInicial, setLoteInicial] = useState(0);
	const history = useHistory();

	const exitPage = () => {
		history.push("/veiculos/coordenadas");
	};

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
			unidade_medida: "KG",
			observacao: "",
			acessorios_requisitos: "",
			informacoes_restritivas: "",
			janela_entrega: "",
			janela_coleta: "",
			local_coleta: "",
			local_entrega: "",
			placa_veiculo: "",
			fk_situacao: null,
			filial_descricao: "",
		},
	});

	useEffect(() => {
		async function carregarCarga() {
			try {
				setLoading(true);
				const carga = (await ServiceCoordenadas.searchByPlate(id)).data.data;
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
				setLoading(false);
			} catch (error) {
				exitPage();
			}
		}
		carregarCarga();
	}, []);

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Container className="body-consulta-cargas">
				<Row className="row-title-button">
					<Col lg={10}>
						<p className="title-consultarCarga">
							Consultar carga aberta manualmente
						</p>
					</Col>
					<Col lg={2} className="button-exit">
						<Button
							variant="link"
							onClick={exitPage}
							className="btn-icon-HiArrowCircleLeft"
						>
							<HiArrowCircleLeft className="fs-4" />
						</Button>
					</Col>
				</Row>
				<hr className="w-100" />
				<Form onSubmit={formik.handleSubmit}>
					<FormularioConsulta
						formik={formik}
						disabledFields={
							loteInicial ? ["e_lote", "unidade_medida", "quantidade"] : []
						}
						exitPage={exitPage}
					/>
				</Form>
			</Container>
		</>
	);
}

export default Consulta;
