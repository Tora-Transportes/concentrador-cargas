import React, { useState, useEffect } from "react";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	FormControl,
	FloatingLabel,
} from "react-bootstrap";
import { useFormik } from "formik";
import NavbarNavigator from "../../../Components/NavbarNavigator";
import useLoadingScreen from "../../../Components/LoadingScreen";
import ServiceCargas from "../../../../services/ServiceCargas";
import swal from "sweetalert";
import { getClaims } from "../../../../MicrosoftAuthentication";
import ServiceProdutos from "../../../../services/ServiceProdutos";
import FormularioCadastroManual from "../../../Components/FormularioCadastroManual";
import { useParams } from "react-router-dom";

function Manual() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [produtos, setProdutos] = useState([]);
	const [distancia, setDistancia] = useState(null);
	const params = useParams();
	const [cargaAtual, setCargaAtual] = useState(null);

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
			unidade_medida: "",
			observacao: "",
			acessorios_requisitos: "",
			informacoes_restritivas: "",

			janela_coleta: "",
			janela_entrega: "",

			local_coleta: "",
			local_entrega: "",

			fk_lote_pai: "",

			placa_veiculo: "",
		},
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const { data } = await ServiceCargas.createDerivada({
					...values,
					canal_comunicacao: "manual",
				});
				await swal(
					"Sucesso",
					`A carga foi cadastrada com o identificador ${data.data.id}`,
					"success"
				);
				location.reload();
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});

	useEffect(() => {
		setDistancia(null);
	}, [formik.values.destino_carga, formik.values.origem_carga]);

	useEffect(() => {
		if (cargaAtual) {
			formik.setFieldValue("unidade_medida", cargaAtual.unidade_medida);
		}
	}, [formik.values.unidade_medida]);

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
		formik.setFieldValue("e_lote", false);
	}, [formik.values.e_lote]);

	useEffect(() => {
		let isAvaliable = true;

		setLoading(true);
		ServiceProdutos.list().then(({ data }) => {
			setProdutos(data.data);
		});

		ServiceCargas.index({ id: params.id }).then(({ data }) => {
			setCargaAtual(data.data);
			if (data.data.quantidade_atual === 0) {
				swal(
					"O lote informado não possui mais nenhuma quantidade disponível"
				).then(() => {
					window.open("", "_self").close();
				});
			}
			for (const i in data.data) {
				if (i.startsWith("e_")) {
					formik.setFieldValue(i, !!data.data[i]);
				} else if (i === "quantidade_atual") {
					formik.setFieldValue("quantidade", data.data[i]);
				} else if (i !== "id") {
					formik.setFieldValue(i, data.data[i]);
				}
			}
			formik.setFieldValue("fk_lote_pai", params.id);

			if (isAvaliable) setLoading(false);
		});

		return () => {
			isAvaliable = false;
		};
	}, []);

	return (
		<>
			<LoadingScreen />
			<NavbarNavigator className="fixed-top" />
			<h1
				className="fixed-top mb-5 mt-5 pt-2 pb-2 bg-white text-center border-bottom"
				style={{ zIndex: "20" }}
			>
				Cadastro de carga derivada
			</h1>
			<div className="mt-5 mb-5 pt-5 pb-5" />
			<Container className="mb-5 mt-5">
				<Form onSubmit={formik.handleSubmit}>
					<Row>
						<Col>
							<FloatingLabel
								label="*Lote original dessa carga"
								className="mb-3"
							>
								<FormControl
									name="fk_lote_pai"
									readOnly={true}
									value={formik.values.fk_lote_pai}
								/>
							</FloatingLabel>
						</Col>
					</Row>
					<FormularioCadastroManual
						handleSearchDistance={handleSearchDistance}
						produtos={produtos}
						distancia={distancia}
						formik={formik}
					/>
					<Row>
						<Col>
							<Button variant="success" type="submit" className="p-3 fw-bold">
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
