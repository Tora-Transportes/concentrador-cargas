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
import ServiceGMImpendimentos from "src/services/GestaoMultas/ServiceImpedimentos";
import { formatDateAtual } from "src/Pages/Utils/formatDate";
import BtnRefresh from "../components/btnAtualizar";
import MultiButton from "../components/multiBtn";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaFileContract } from "react-icons/fa6";
import { FaFileExport } from "react-icons/fa";
import { possuiPermissaoGestaoMultas } from "src/Pages/Utils/validationPermissionUser";
import Swal from "sweetalert2";
import DocumentosGMList from "../../components/DocumentsComponent";

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

			despesasHistorico: [],
			infratorHistorico: [],
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

			const despesasHistorico = notificacaoResponse.despesasHistorico || [];
			despesasHistorico.forEach((item, index) => {
				for (let i in item) {
					let nonNullValue = item[i] === null ? "" : item[i];
					if (i === "created_at") {
						formik.setFieldValue(
							`despesasHistorico[${index}].${i}`,
							formatDateAtual(nonNullValue)
						);
					} else {
						formik.setFieldValue(
							`despesasHistorico[${index}].${i}`,
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

			const infratorHistorico = notificacaoResponse.infratorHistorico || [];
			infratorHistorico.forEach((item, index) => {
				for (let i in item) {
					let nonNullValue = item[i] === null ? "" : item[i];
					if (i === "created_at") {
						formik.setFieldValue(
							`infratorHistorico[${index}].${i}`,
							formatDateAtual(nonNullValue)
						);
					} else {
						formik.setFieldValue(
							`infratorHistorico[${index}].${i}`,
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
					cod_user_created: String(getClaims().name),
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
					cod_user_created: String(getClaims().name),
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

	function validarCPF(cpf) {
		cpf = cpf.replace(/[^\d]+/g, "");
		if (cpf.length !== 11) return false;
		return true;
	}

	function inserirInfrator() {
		Swal.fire({
			title: "Digite os dados do infrator",
			html: `
				<input id="cpf" class="swal2-input" placeholder="CPF" maxlength="11">
				<input id="placa_cavalo" class="swal2-input" placeholder="Placa Cavalo" maxlength="7">
				<input id="placa_carreta" class="swal2-input" placeholder="Placa Carreta" maxlength="7">
			`,
			focusConfirm: false,
			showCancelButton: true,
			confirmButtonText: "Confirmar",
			showLoaderOnConfirm: true,
			preConfirm: () => {
				const cpf = document.getElementById("cpf").value.trim();
				const placaCavalo = document
					.getElementById("placa_cavalo")
					.value.trim()
					.toUpperCase();
				const placaCarreta = document
					.getElementById("placa_carreta")
					.value.trim()
					.toUpperCase();

				if (!validarCPF(cpf)) {
					Swal.showValidationMessage("CPF inválido");
					return false;
				}

				if (!validarPlaca(placaCavalo)) {
					Swal.showValidationMessage(
						"Placa cavalo inválida (use o formato AAA0A00 ou AAA-0000)"
					);
					return false;
				}

				if (!validarPlaca(placaCarreta)) {
					Swal.showValidationMessage(
						"Placa carreta inválida (use o formato AAA0A00 ou AAA-0000)"
					);
					return false;
				}

				return { cpf, placaCavalo, placaCarreta };
			},
			allowOutsideClick: () => !Swal.isLoading(),
		}).then(async (result) => {
			if (result.isConfirmed && result.value) {
				const { cpf, placaCavalo, placaCarreta } = result.value;
				try {
					setLoading(true);
					const retorno = await ServiceGMNotificacoes.inserirInfrator(
						cpf,
						id,
						placaCavalo,
						placaCarreta
					);
					await refreshPage();
					await Swal.fire("Sucesso!", retorno.data.message, "success");
				} catch (error) {
					console.error("Erro ao inserir infrator:", error);
					Swal.fire("Erro!", "Não foi possível inserir o infrator.", "error");
				} finally {
					setLoading(false);
				}
			}
		});
	}

	// Função para validar placas no formato antigo (AAA-0000) e Mercosul (AAA0A00)
	function validarPlaca(placa) {
		const regex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
		return regex.test(placa);
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
				const response = await ServiceGMNotificacoes.gerarFici({
					empresa_id: formik.values.empresa_id,
					ait: formik.values.ait,
					codigo_orgao: formik.values.codigo_orgao,
				});

				const blob = new Blob([response.data], {
					type: "application/octet-stream",
				});
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `fici-${id}.docx`;
				a.click();
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
					const response = await ServiceGMNotificacoes.solicitarBoleto({
						empresa_id: formik.values.empresa_id,
						ait: formik.values.ait,
						cod_orgao: formik.values.codigo_orgao,
						reconhece_infracao: result ? true : false,
					});

					await refreshPage();

					await swal({
						title: "Sucesso!",
						text: `Solicitação efetuada com sucesso. \n
					Status: ${response.data.Mensagem ?? "N/D"} \n
					Observação: ${response.data.Observacao ?? "N/D"} \n
					Vencimento: ${response.data.VencimentoBoleto ?? "N/D"}`,
						icon: "success",
					});
				} catch (error) {
					console.error("Erro ao solicitar boleto :", error);
				} finally {
					setLoading(false);
				}
			}
		}
	}

	async function gerarDespesa() {
		const possui = await possuiPermissaoGestaoMultas("Permissão N2");
		if (possui) {
			const dadosFormatados = `
	            Nome do Motorista: ${formik.values.infrator.nome}
	            Empresa: ${formik.values.empresa?.nome || ""}
	            AIT: ${formik.values.infrator.ait}
	            Valor: R$ ${formik.values.valor_a_pagar}
	            Data da Multa: ${formatDateAtual(formik.values.data_infracao)}
	        `;

			const options = Array.from({ length: 12 }, (_, i) => i + 1)
				.map(
					(value) =>
						`<option value="${value}">${value} ${
							value === 1 ? "vez" : "vezes"
						}</option>`
				)
				.join("");

			const result = await swal({
				title: "Dados da Infração e Parcelamento",
				content: {
					element: "div",
					attributes: {
						innerHTML: `
						<p style="text-align: left; white-space: pre-wrap;">${dadosFormatados}</p>
						<p style="font-style: italic; color: gray;">
							Por favor, revise as informações acima antes de prosseguir.
						</p>
						<label style="font-weight: bold;">Escolha o número de parcelas:</label>
						<select id="parcelas" style="margin-top: 10px; padding: 5px; width: 100%; font-size: 16px;">
							${options}
						</select>
						<label style="font-weight: bold; margin-top: 15px; display: block;">Observação:</label>
						<textarea
							id="observacao"
							maxlength="200"
							placeholder="Adicione uma observação (máximo de 1000 caracteres)"
							style="width: 100%; height: 100px; margin-top: 5px; padding: 5px; font-size: 16px; resize: none;"
						>AIT:${formik.values.ait} \nPLACA VEICULO:${
							formik.values.placa
						} \nDATA:${formatDateAtual(formik.values.data_infracao)} \nLOCAL:${
							formik.values.local
						} \nDESC. MULTA:${formik.values.descricao} \nVALOR:R$ : ${
							formik.values.valor_a_pagar
						} </textarea>
					`,
					},
				},
				buttons: {
					cancel: {
						text: "Cancelar",
						value: null,
						visible: true,
						className: "btn-secondary",
						closeModal: true,
					},
					confirm: {
						text: "Confirmar",
						value: true,
						visible: true,
						className: "btn-success",
						closeModal: true,
					},
				},
			});

			if (result) {
				try {
					const seletorParcelas = document.getElementById("parcelas");
					const observacaoInput = document.getElementById("observacao");

					const qtdeParcelas = parseInt(seletorParcelas.value, 10);
					const observacao = observacaoInput.value.trim();

					setLoading(true);

					const body = {
						nome_motorista: formik.values.infrator.nome,
						cpf: formik.values.infrator.cpf,
						empresa: formik.values.empresa?.nome || "",
						placa_cavalo: formik.values.infrator.cavalo,
						placa_carreta: formik.values.infrator.carreta,
						placa_bitrem: formik.values.infrator.bitrem,
						ait: formik.values.infrator.ait,
						valor: formik.values.valor_a_pagar,
						data_multa: formik.values.data_infracao,
						local: formik.values.local,
						status: 1,
						qtde_parcelas: qtdeParcelas,
						observacao: observacao,
						cod_user_create: String(getClaims().name),
					};

					console.log(body);
					await ServiceGMNotificacoes.gerarDespesa(body);

					await refreshPage();

					await swal({
						title: "Sucesso!",
						text: `Despesa inserida com sucesso\n\n`,
						icon: "success",
					});
				} catch (error) {
					console.error("Erro ao gerar despesa:", error);
					await swal({
						title: "Erro!",
						text: "Ocorreu um erro ao gerar a despesa. Tente novamente.",
						icon: "error",
					});
				} finally {
					setLoading(false);
				}
			}
		}
	}

	async function gerarImpedimento() {
		const possui = await possuiPermissaoGestaoMultas("Permissão N2");
		if (possui) {
			const result = await Swal.fire({
				title: "Solicitar Impedimento do Transportador",
				html: `
			  <div style="text-align: left;">
				<div><strong>Nome do Motorista:</strong> ${formik.values.infrator.nome}</div>
				<div><strong>CPF:</strong> ${formik.values.infrator.cpf}</div>
				<div><strong>Empresa:</strong> ${formik.values.empresa?.nome || ""}</div>
				<div><strong>AIT:</strong> ${formik.values.infrator.ait}</div>
			  </div>
			  <p style="font-style: italic; color: gray; margin-top: 15px;">
				Por favor, revise as informações acima antes de prosseguir.
			  </p>
			  <label style="font-weight: bold; margin-top: 15px; display: block;">Observação:</label>
			  <textarea
				id="observacao"
				maxlength="200"
				placeholder="Adicione uma observação (máximo de 1000 caracteres)"
				style="width: 100%; height: 100px; margin-top: 5px; padding: 5px; font-size: 16px; resize: none;"
			  >ASSINAR O TERMO DE MULTA - PRAZO / - GENTILEZA SOLICITAR AO GESTAO.VEICULOS@TORA.COM.BR ATENCAO - SOLICITACAO DE DESBLOQUEIO APÓS AS 17:18H,ENVIAR PARA O CCE@TORA.COM.BR ATRAVES DE E-MAIL. SETOR COM FUNCIONAMENTO 24HRS 
			  </textarea>
			`,
				showCancelButton: true,
				cancelButtonText: "Cancelar",
				confirmButtonText: "Confirmar",
				preConfirm: () => {
					const observacaoInput = document.getElementById("observacao");
					const observacao = observacaoInput.value.trim();
					if (!observacao) {
						Swal.showValidationMessage("Por favor, adicione uma observação.");
						return false;
					}
					return observacao;
				},
			});

			if (result.isConfirmed) {
				try {
					const observacao = result.value;

					setLoading(true);

					const body = {
						nome_motorista: formik.values.infrator.nome,
						cpf: formik.values.infrator.cpf,
						empresa: formik.values.empresa?.nome || "",
						placa: formik.values.placa,
						ait: formik.values.infrator.ait,
						status: 4,
						processado: 0,
						observacao: observacao,
						cod_user_create: String(getClaims().name),
					};

					console.log(body);
					await ServiceGMImpendimentos.create(body);

					await refreshPage();

					await Swal.fire({
						title: "Sucesso!",
						text: `Solicitação de impedimento feita com sucesso.`,
						icon: "success",
					});
				} catch (error) {
					setLoading(false);
					await Swal.fire({
						title: "Erro!",
						text: "Ocorreu um erro ao gerar a solicitação de impedimento. Tente novamente.",
						icon: "error",
					});
				} finally {
					setLoading(false);
				}
			}
		}
	}

	async function gerarTermo() {
		try {
			const mesesPorExtenso = [
				"Janeiro",
				"Fevereiro",
				"Março",
				"Abril",
				"Maio",
				"Junho",
				"Julho",
				"Agosto",
				"Setembro",
				"Outubro",
				"Novembro",
				"Dezembro",
			];

			const { value: formValues } = await Swal.fire({
				title: "Insira o mês e o ano",
				html: `
			  <p>Os valores de mês e ano indicam o início do desconto.</p>
			  <div style="display: flex; flex-direction: column; gap: 10px;">
				<input id="input-mes" class="swal2-input" placeholder="Mês (1-12)" type="number" min="1" max="12" />
				<input id="input-ano" class="swal2-input" placeholder="Ano (ex: 2024)" type="number" min="1900" max="2100" />
			  </div>
			`,
				focusConfirm: false,
				preConfirm: () => {
					const mes = document.getElementById("input-mes").value;
					const ano = document.getElementById("input-ano").value;

					if (!mes || mes < 1 || mes > 12) {
						Swal.showValidationMessage(
							"Por favor, insira um mês válido (1 a 12)."
						);
						return null;
					}

					if (!ano || ano < 1900 || ano > 2100) {
						Swal.showValidationMessage(
							"Por favor, insira um ano válido (1900 a 2100)."
						);
						return null;
					}

					return { mes: parseInt(mes), ano: parseInt(ano) };
				},
			});

			if (!formValues) {
				return;
			}

			const { mes, ano } = formValues;
			const mesPorExtenso = mesesPorExtenso[mes - 1];

			setLoading(true);

			const response = await ServiceGMNotificacoes.downloadTermo(
				id,
				mesPorExtenso,
				ano
			);
			const blob = new Blob([response.data], {
				type: "application/octet-stream",
			});
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${id}.docx`;
			a.click();
			Swal.fire("Sucesso", "O documento está sendo baixado", "success");
		} catch (error) {
			setLoading(false);
			Swal.fire("Erro", "Não foi possível baixar o documento", "error");
		} finally {
			setLoading(false);
		}
	}

	const buttons = [
		{
			label: "Multa",
			onClick: () => {
				window.location.href = `/gestao-multas/multas/${formik.values.ait}`;
			},
			icon: <FaFileExport size={18} />,
		},
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
						gerarDespesa={gerarDespesa}
						gerarImpedimento={gerarImpedimento}
						gerarTermo={gerarTermo}
						inserirInfrator={inserirInfrator}
					></FormularioNotificacao>
					<div>
						<DocumentosGMList ait={id}></DocumentosGMList>
					</div>
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
