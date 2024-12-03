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
import ServiceGMNotificacoes from "src/services/GestaoMultas/ServiceNotificacoes";
import { possuiPermissaoGestaoMultas } from "src/Pages/Utils/validationPermissionUser";

function MultasEditar() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const { id } = useParams();

	const formik = useFormik({
		initialValues: {
			multa: {
				id: "",
				empresa_id: "",
				placa: "",
				renavam: "",
				ait: "",
				ait_originaria: "",
				data_infracao: "",
				hora: "",
				local: "",
				municipio: "",
				uf: "",
				descricao: "",
				codigo_infracao: "",
				vencimento_infracao: "",
				data_pesquisa: "",
				servico: "",
				orgao_autuador: "",
				reincidencia_nic: "",
				valor_a_pagar: "",
				valor_com_desconto: "",
				desconto_perdido: "",
				guia: "",
				boleto: "",
				extrato: "",
				desdobramento: "",
				codigo_orgao: "",
				motorista_nome: "",
				motorista_matricula: "",
				orgao: "",
				penalidade: "",
				pontuacao: "",
				codigo_boleto: "",
				situacao_boleto: "",
				descricao_boleto: "",
				boleto_valor: "",
				linha_digitavel: "",
				boleto_vencimento: "",
				confirmacao_pagamento: "",
				notificacao: "",
				tipo_multa: "",
				created_at: "",
				cod_usu_create: "",
				updated_at: "",
				cod_usu_update: "",
				empresa: {
					nome: "",
				},
			},
			status: {
				id: "",
				ait: "",
				renavam: "",
				placa: "",
				status: "",
				data_vencimento: "",
				valor_a_pagar: "",
				boleto_url: "",
				codigo_boleto: "",
				situacao_boleto: "",
				descricao_boleto: "",
				boleto_valor: "",
				linha_digitavel: "",
				boleto_vencimento: "",
				confirmacao_pagamento: "",
				valor_pago: "",
				motorista_nome: "",
				motorista_matricula: "",
				created_at: "",
				cod_usu_create: "",
				updated_at: "",
				cod_usu_update: "",
			},
			statusHistorico: [
				{
					id: "",
					ait: "",
					status: "",
					created_at: "",
					cod_usu_create: "",
				},
			],
			observacao: "",
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
			const multaResponse = (await ServiceGMMultas.index(id)).data;
			const multa = multaResponse.multa;

			for (let i in multa) {
				let nonNullValue = multa[i] === null ? "" : multa[i];
				if (i === "created_at" || i === "updated_at") {
					formik.setFieldValue(`multa.${i}`, formatDateAtual(nonNullValue));
				} else if (typeof multa[i] === "object" && multa[i] !== null) {
					for (let j in multa[i]) {
						let nestedNonNullValue = multa[i][j] === null ? "" : multa[i][j];
						formik.setFieldValue(`multa.${i}.${j}`, nestedNonNullValue);
					}
				} else {
					formik.setFieldValue(`multa.${i}`, nonNullValue);
				}
			}
			const status = multaResponse.status;
			for (let i in status) {
				let nonNullValue = status[i] === null ? "" : status[i];

				if (i === "created_at" || i === "updated_at") {
					formik.setFieldValue(`status.${i}`, formatDateAtual(nonNullValue));
				} else {
					formik.setFieldValue(`status.${i}`, nonNullValue);
				}
			}
			const statusHistorico = multaResponse.statusHistorico || [];
			statusHistorico.forEach((item, index) => {
				for (let i in item) {
					let nonNullValue = item[i] === null ? "" : item[i];
					if (i === "created_at") {
						formik.setFieldValue(
							`statusHistorico[${index}].${i}`,
							formatDateAtual(nonNullValue)
						);
					} else {
						formik.setFieldValue(
							`statusHistorico[${index}].${i}`,
							nonNullValue
						);
					}
				}
			});

			formik.setFieldValue("observacao", multaResponse.observacao || "");

			const statusInterno = multaResponse.statusInterno;

			formik.setFieldValue(`statusInterno`, statusInterno);

			const statusInternoHistorico = multaResponse.statusInternoHistorico || [];
			statusInternoHistorico.forEach((item, index) => {
				for (let i in item) {
					let nonNullValue = item[i] === null ? "" : item[i];
					if (i === "created_at") {
						formik.setFieldValue(
							`statusInternoHistorico[${index}].${i}`,
							formatDateAtual(nonNullValue)
						);
					} else {
						formik.setFieldValue(
							`statusInternoHistorico[${index}].${i}`,
							nonNullValue
						);
					}
				}
			});
		} catch (error) {
			console.error(error);
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

	async function refreshPage() {
		let isMounted = true;
		setLoading(true);
		try {
			await carregarMulta();
		} finally {
			if (isMounted) {
				setLoading(false);
			}
		}

		return () => {
			isMounted = false;
		};
	}

	async function atualizarStatus(status) {
		const possui = await possuiPermissaoGestaoMultas("Permissão N2");
		if (possui) {
			try {
				setLoading(true);

				await ServiceGMNotificacoes.atualizarStatus({
					ait: formik.values.multa.ait,
					status: status,
					cod_usu_update: String(getClaims().name),
				});

				await refreshPage();

				await swal("Sucesso!", "Status Atualizado com sucesso", "success");
			} catch (error) {
				console.error("Erro ao atualizar status:", error);
				await swal("Erro!", "Houve um problema ao atualizar status", "error");
			} finally {
				setLoading(false);
			}
		}
	}

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Container className="mb-5 mt-5">
				<p id="style-title-editorCarga">Multa</p>
				<hr />
				<Form onSubmit={formik.handleSubmit}>
					<FormularioMulta
						formik={formik}
						atualizarStatus={atualizarStatus}
					></FormularioMulta>
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
