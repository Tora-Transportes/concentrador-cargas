import React, { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
// import useLoadingScreen from "../../../Pages/Components/LoadingScreen";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";
import FormularioConsulta from "./formularioConsulta";
import "./consultaCarga.css";

function Consulta() {
	//const [LoadingScreen, setLoading] = useLoadingScreen();
	const { id } = useParams();
	const [loteInicial, setLoteInicial] = useState(0);
	const history = useHistory();

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
			unidade_medida: "",
			observacao: "",
			acessorios_requisitos: "",
			informacoes_restritivas: "",

			janela_entrega: "",
			janela_coleta: "",

			local_coleta: "",
			local_entrega: "",

			placa_veiculo: "",

			fk_situacao: null,
		},
	});

	useEffect(() => {
		async function carregarCarga() {
			try {
				const carga = (await ServiceCoordenadas.searchByPlate(id)).data.data;
				setLoteInicial(carga.e_lote);
				console.log("carga", carga);
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
			} catch (error) {
				history.push("/veiculos/coordenadas");
			}
		}
		carregarCarga();
	}, []);

	return (
		<>
			{/* <LoadingScreen /> */}
			<Menusuperior />
			<Container className="mb-5 mt-5">
				<p className="title-consultarCarga">
					Consultar carga aberta manualmente
				</p>
				<hr className="w-100" />
				<Form onSubmit={formik.handleSubmit}>
					<FormularioConsulta
						formik={formik}
						disabledFields={
							loteInicial ? ["e_lote", "unidade_medida", "quantidade"] : []
						}
					/>
				</Form>
			</Container>
		</>
	);
}

export default Consulta;
