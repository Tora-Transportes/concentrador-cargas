import React, { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import useLoadingScreen from "../../../Components/LoadingScreen";
import ServiceCargas from "../../../../services/ServiceCargas";
import ServiceProdutos from "src/services/ServiceProdutos";
import CabecalhoFixado from "src/Pages/Components/CabecalhoFixado";
import FormularioInfo from "./FormularioInfo";

function LinkCarga() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const { id } = useParams();
	const history = useHistory();
	const [produtos, setProdutos] = useState([]);
	const [distancia, setDistancia] = useState(null);
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
			<CabecalhoFixado>
				Visualização de carga aberta manualmente
			</CabecalhoFixado>
			<Container className="mb-5 mt-5">
				<Form onSubmit={formik.handleSubmit}>
					<FormularioInfo
						type="text"
						produtos={produtos}
						distancia={distancia}
						formik={formik}
					/>
				</Form>
			</Container>
		</>
	);
}

export default LinkCarga;
