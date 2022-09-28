import React, { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import useLoadingScreen from "../../../Pages/Components/LoadingScreen";
import swal from "sweetalert";
import ServiceProdutos from "src/services/ServiceProdutos";
// import CabecalhoFixado from "src/Pages/Components/CabecalhoFixado";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { getClaims } from "src/MicrosoftAuthentication";
import ServiceCargas from "src/services/ServiceCargas";
import FormularioConsulta from "./formularioConsulta";
import "../ConsultaCargas/consultaCarga.css";

function Consulta() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const { id } = useParams();
	const history = useHistory();
	const [produtos, setProdutos] = useState([]);
	const [distancia, setDistancia] = useState(null);
	const [loteInicial, setLoteInicial] = useState(0);

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
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const { data } = await ServiceCargas.update({
					...values,
					responsavel_cadastro: String(getClaims().name),
					fk_situacao: undefined,
				});
				formik.setFieldValue("responsavel_cadastro", String(getClaims().name));
				swal("Sucesso!", `A carga  ${data.data.id} foi atualizada!`, "success");
				await carregarCarga();
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});

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

	async function carregarCarga() {
		try {
			const carga = (await ServiceCargas.index({ id })).data.data;
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
			handleSearchDistance(carga);
		} catch (error) {
			history.push("/cargas/menu");
		}
	}

	function buscarCargaComDocumentoDeTransporte(form) {
		if (form.documento_transporte) {
			ServiceCargas.search({
				documento_transporte: form.documento_transporte,
			}).then(({ data: { data } }) => {
				const cargaDocumento = data.results.find(
					(i) =>
						i.documento_transporte === form.documento_transporte &&
						i.id !== form.id
				);
				if (cargaDocumento) {
					swal(
						"Ops!",
						`Documento de Transporte já existente na carga ${cargaDocumento.id}.`,
						"warning"
					).then(() => {
						formik.setFieldValue(
							"documento_transporte",
							form.documento_transporte
						);
					});
				}
			});
		}
	}

	useEffect(() => {
		let isMounted = true;
		setLoading(true);

		carregarCarga().finally(() => {
			if (isMounted) {
				setLoading(false);
			}
		});
		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		setDistancia(null);
	}, [formik.values.destino_carga, formik.values.origem_carga]);

	useEffect(() => {
		formik.setFieldValue("placa_veiculo", "");
	}, [formik.values.e_lote]);

	useEffect(() => {
		ServiceProdutos.list().then(({ data }) => {
			setProdutos(data.data);
		});
	}, []);

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Container className="mb-5 mt-5">
				<p id="title-consultarCarga">Consultar carga aberta manualmente</p>
				<hr />
				<Form onSubmit={formik.handleSubmit}>
					<FormularioConsulta
						buscarCargaComDocumentoDeTransporte={
							buscarCargaComDocumentoDeTransporte
						}
						handleSearchDistance={handleSearchDistance}
						produtos={produtos}
						distancia={distancia}
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
