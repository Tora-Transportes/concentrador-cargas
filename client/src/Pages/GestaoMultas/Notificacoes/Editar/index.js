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
import MultiButton from "../components/multiBtn";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaFileContract } from "react-icons/fa6";
import { possuiPermissaoGestaoMultas } from "src/Pages/Utils/validationPermissionUser";

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

			statusInterno: [
				{
					id: "",
					ait: "",
					status: "",
					created_at: "",
					cod_usu_create: "",
					updated_at: "",
					cod_usu_update: "",
				},
			],

			statusInternoHistorico: [
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

			const statusInterno = notificacaoResponse.statusInterno;

			formik.setFieldValue(`statusInterno`, statusInterno);

			const statusInternoHistorico =
				notificacaoResponse.statusInternoHistorico || [];
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
		const possui = await possuiPermissaoGestaoMultas("Permissão N2");
		if (possui) {
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
	}

	async function atualizarStatus(status) {
		const possui = await possuiPermissaoGestaoMultas("Permissão N2");
		if (possui) {
			try {
				setLoading(true);

				await ServiceGMNotificacoes.atualizarStatus({
					ait: formik.values.ait,
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

	async function excluirCondutor(notificacao) {
		const possui = await possuiPermissaoGestaoMultas("Permissão N2");
		if (possui) {
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
	}

	async function regerarInfratores(notificacao) {
		const possui = await possuiPermissaoGestaoMultas("Permissão N2");
		if (possui) {
			try {
				setLoading(true);
				await ServiceGMNotificacoes.regerarInfratores({
					ait: notificacao.ait,
					placa: notificacao.placa,
					data_infracao: notificacao.data_infracao,
				});

				await refreshPage();

				await swal("Sucesso!", "Infratores atualizados com sucesso", "success");
			} catch (error) {
				console.error("Erro ao atualizar infratores:", error);
				await swal(
					"Erro!",
					"Houve um problema ao atualizar infratores",
					"error"
				);
			} finally {
				setLoading(false);
			}
		}
	}

	async function atualizarNotificacao(ait) {
		const possui = await possuiPermissaoGestaoMultas("Permissão N2");
		if (possui) {
			try {
				setLoading(true);
				await ServiceGMNotificacoes.atualizar(ait);

				await refreshPage();

				await swal(
					"Sucesso!",
					"Notificação/Status atualizadados com sucesso",
					"success"
				);
			} catch (error) {
				console.error("Erro ao atualizar Notificação/Status :", error);
				await swal(
					"Erro!",
					"Houve um problema ao atualizar  Notificação/Status",
					"error"
				);
			} finally {
				setLoading(false);
			}
		}
	}

	async function gerarFici() {
		const possui = await possuiPermissaoGestaoMultas("Permissão N2");
		if (possui) {
			try {
				setLoading(true);
				const pdf = await ServiceGMNotificacoes.gerarFici({
					empresa_id: formik.values.empresa_id,
					ait: formik.values.ait,
					codigo_orgao: formik.values.codigo_orgao,
				});

				console.log(pdf);

				const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

				const pdfUrl = URL.createObjectURL(pdfBlob);

				const link = document.createElement("a");
				link.href = pdfUrl;
				link.download = `FICI-AIT-${formik.values.ait}`;

				link.click();

				URL.revokeObjectURL(pdfUrl);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		}
	}

	async function gerarBoleto() {
		const possui = await possuiPermissaoGestaoMultas("Permissão N2");
		if (possui) {
			const result = await swal({
				title: "Escolha o tipo de boleto",
				text:
					"Selecione uma das opções abaixo:\n\n" +
					"✔ **40% de desconto**: Reconhecimento da infração.\n" +
					"✔ **20% de desconto**: Sem reconhecimento da infração.\n\n" +
					"ℹ **Observação**: Os boletos ficam disponíveis em até 72 horas de acordo com as especificações do SNE.",
				icon: "info",
				buttons: {
					cancel: {
						text: "Cancelar",
						value: null,
						visible: true,
						className: "btn-secondary",
						closeModal: true,
					},
					noDiscount: {
						text: "20% desconto",
						value: false,
						visible: true,
						className: "btn-danger",
						closeModal: true,
					},
					confirm: {
						text: "40% desconto",
						value: true,
						visible: true,
						className: "btn-success",
						closeModal: true,
					},
				},
			});

			if (result != null) {
				try {
					setLoading(true);
					await ServiceGMNotificacoes.solicitarBoleto({
						empresa_id: formik.values.empresa_id,
						ait: formik.values.ait,
						cod_infracao: formik.values.codigo_orgao,
						reconhece_infracao: result ? true : false,
					});

					await refreshPage();

					await swal("Sucesso!", "Solicitação efetuada com sucesso", "success");
				} catch (error) {
					console.error("Erro ao solicitar boleto :", error);
				} finally {
					setLoading(false);
				}
			}
		}
	}

	const buttons = [
		{
			label: "Gerar FICI",
			onClick: () => gerarFici(),
			icon: <FaFileContract size={18} />,
		},
		{
			label: "Gerar Boleto",
			onClick: () => gerarBoleto(),
			icon: <FaFileInvoiceDollar size={18} />,
		},
	];

	return (
		<>
			<Menusuperior />
			<LoadingScreen />
			<Container className="mb-5 mt-5">
				<BtnRefresh
					callback={atualizarNotificacao}
					params={formik.values.ait}
					textoHeader={`Notificação`}
					texto={"Forçar Atualização"}
					multiButton={<MultiButton buttons={buttons} />}
				></BtnRefresh>
				<hr />
				<Form onSubmit={formik.handleSubmit}>
					<FormularioNotificacao
						formik={formik}
						indicarCondutor={indicarCondutor}
						excluirCondutor={excluirCondutor}
						regerarInfratores={regerarInfratores}
						atualizarNotificacao={atualizarNotificacao}
						atualizarStatus={atualizarStatus}
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
