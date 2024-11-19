import React, { useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import useLoadingScreen from "../../../Components/LoadingScreen";
import swal from "sweetalert";
import { getClaims } from "../../../../MicrosoftAuthentication";

import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import "./style.css";
import FormularioNotificacao from "../components/formulario";
import ServiceGMNotificacoes from "src/services/GestaoMultas/ServiceNotificacoes";
import { formatDateAtual } from "src/Pages/Utils/formatDate";
import BtnRefresh from "../components/btnAtualizar";

function NotificacoesEditar() {
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
			infratores: null,
			infrator: null,
			existeInfrator: false,
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
		},
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const { data } = await ServiceGMNotificacoes.update(values.id, {
					...values,
					cod_user: String(getClaims().name),
				});
				swal("Sucesso!", `A empresa ${data.id} foi atualizada!`, "success");
				await carregarNotificacao();
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

	async function carregarNotificacao() {
		try {
			const notificacaoResponse = (await ServiceGMNotificacoes.index(id)).data;
			const infratores = notificacaoResponse.infratores;
			const notificacao = notificacaoResponse.notificacao;
			formik.setFieldValue("infratores", infratores);
			formik.setFieldValue(
				"existeInfrator",
				infratores.some((item) => item.infrator === true)
			);
			formik.setFieldValue(
				"infrator",
				infratores.find((item) => item.infrator === true) || null
			);

			for (let i in notificacao) {
				let nonNullValue = notificacao[i] === null ? "" : notificacao[i];
				if (i.indexOf("created_at") !== -1 || i.indexOf("updated_at") !== -1) {
					formik.setFieldValue(i, formatDateAtual(nonNullValue));
				} else {
					formik.setFieldValue(i, nonNullValue);
				}
			}

			const status = notificacaoResponse.status;
			for (let i in status) {
				let nonNullValue = status[i] === null ? "" : status[i];

				if (i === "created_at" || i === "updated_at") {
					formik.setFieldValue(`status.${i}`, formatDateAtual(nonNullValue));
				} else {
					formik.setFieldValue(`status.${i}`, nonNullValue);
				}
			}
			const statusHistorico = notificacaoResponse.statusHistorico || [];
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

			console.log(formik.values);
		} catch (error) {
			console.log(error);
			history.push("");
		}
	}

	async function refreshPage() {
		let isMounted = true;
		setLoading(true);
		try {
			await carregarNotificacao();
		} finally {
			if (isMounted) {
				setLoading(false);
			}
		}

		return () => {
			isMounted = false;
		};
	}

	useEffect(() => {
		let isMounted = true;
		setLoading(true);

		carregarNotificacao().finally(() => {
			if (isMounted) {
				setLoading(false);
			}
		});
		return () => {
			isMounted = false;
		};
	}, []);

	async function indicarCondutor(data) {
		try {
			setLoading(true);

			await ServiceGMNotificacoes.indicarInfrator({
				EMPRESA_ID: data.notificacao.empresa_id,
				NOME: data.infrator.nome,
				AIT: data.notificacao.ait,
				CNH: data.infrator.cnh,
				CODIGOORGAO: data.notificacao.codigo_orgao,
				id_infrator: data.infrator.id.toString(),
			});

			await refreshPage();

			await swal("Sucesso!", "Infrator indicado com sucesso", "success");
		} catch (error) {
			console.error("Erro ao indicar condutor:", error);
			await swal("Erro!", "Houve um problema ao indicar o infrator", "error");
		} finally {
			setLoading(false);
		}
	}

	async function excluirCondutor(notificacao) {
		try {
			setLoading(true);
			console.log(notificacao);
			await ServiceGMNotificacoes.excluirInfrator({
				EMPRESA_ID: notificacao.empresa_id,
				AIT: notificacao.ait,
				CODIGOORGAO: notificacao.codigo_orgao,
			});

			await refreshPage();

			await swal("Sucesso!", "Infrator excluído com sucesso", "success");
		} catch (error) {
			console.error("Erro ao excluir infrator:", error);
			await swal("Erro!", "Houve um problema ao excluir o infrator", "error");
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Menusuperior />
			<LoadingScreen />
			<Container className="mb-5 mt-5">
				<BtnRefresh
					callback={() => {
						setTimeout(() => {}, 3000);
					}}
					params={{}}
					textoHeader={"Notificação"}
					texto={"Forçar Atualização"}
				></BtnRefresh>
				<hr />
				<Form onSubmit={formik.handleSubmit}>
					<FormularioNotificacao
						formik={formik}
						indicarCondutor={indicarCondutor}
						excluirCondutor={excluirCondutor}
					></FormularioNotificacao>
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

export default NotificacoesEditar;
