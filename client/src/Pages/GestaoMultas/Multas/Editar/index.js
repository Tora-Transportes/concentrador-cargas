import React, { useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import useLoadingScreen from "../../../Components/LoadingScreen";
import swal from "sweetalert";
import { getClaims } from "../../../../MicrosoftAuthentication";

import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import "./style.css";
import FormularioMulta from "../components/formulario";
import ServiceGMMultas from "src/services/GestaoMultas/ServiceMultas";
import { formatDateAtual } from "src/Pages/Utils/formatDate";

function MultasEditar() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const { id } = useParams();

	const formik = useFormik({
		initialValues: {
			id: "",
			empresa_id: "",
			placa: "",
			renavam: "",
			ait: "",
			ait_originaria: "",
			data_infracao: "",
			hora: "",
			local: "",
			valor_a_pagar: "",
			municipio: "",
			codigo_municipio: "",
			uf: "",
			descricao: "",
			codigo_infracao: "",
			desdobramento: "",
			pontuacao: "",
			codigo_orgao: "",
			orgao_autuador: "",
			orgao_pesquisa: "",
			prazo_indicacao: "",
			data_pesquisa: "",
			notificacao: "",
			screenshot: "",
			boleto: "",
			penalidade: "",
			nit: "",
			codigo_boleto: "",
			situacao_boleto: "",
			descricao_boleto: "",
			boleto_valor: "",
			linha_digitavel: "",
			boleto_vencimento: "",
			confirmacao_pagamento: false, // booleano, false é o valor padrão
			motorista_nome: "",
			motorista_matricula: "",
			tipo_notificacao: "",
			created_at: "",
			cod_usu_create: "",
			updated_at: "",
			cod_usu_update: "",
		},
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const { data } = await ServiceGMMultas.update(values.id, {
					...values,
					cod_user: String(getClaims().name),
				});
				swal("Sucesso!", `A empresa ${data.id} foi atualizada!`, "success");
				await carregarMulta();
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});

	async function handleCloseWindow(e, askPermission = true) {
		if (e) {
			e.preventDefault();
		}
		let ok = true;
		if (askPermission) {
			ok = await swal(
				"Ops!",
				"Tem certeza que deseja fechar esta página?",
				"warning",
				{
					buttons: ["Cancelar", { text: "Sim", value: true }],
					dangerMode: true,
				}
			);
		}
		if (ok) {
			window.open("", "_self").close();
		}
	}

	async function carregarMulta() {
		try {
			const multa = (await ServiceGMMultas.index(id)).data.multa;
			for (let i in multa) {
				let nonNullValue = multa[i] === null ? "" : multa[i];
				if (i.indexOf("created_at") !== -1 || i.indexOf("updated_at") !== -1) {
					formik.setFieldValue(i, formatDateAtual(nonNullValue));
				} else {
					formik.setFieldValue(i, nonNullValue);
				}
			}
		} catch (error) {
			console.log(error);
			history.push("");
		}
	}
	useEffect(() => {
		let isMounted = true;
		setLoading(true);

		carregarMulta().finally(() => {
			if (isMounted) {
				setLoading(false);
			}
		});
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Container className="mb-5 mt-5">
				<p id="style-title-editorCarga">Multa</p>
				<hr />
				<Form onSubmit={formik.handleSubmit}>
					<FormularioMulta formik={formik}></FormularioMulta>
					<div className="class-group-button">
						<Button
							variant="success"
							type="submit"
							className="p-2  botao-gravar"
							disabled={[3, 5, 6].includes(formik.values.fk_situacao)}
						>
							Gravar
						</Button>

						<Button
							variant="warning"
							className="p-2"
							onClick={handleCloseWindow}
						>
							Fechar edição
						</Button>
					</div>
				</Form>
			</Container>
		</>
	);
}

export default MultasEditar;
