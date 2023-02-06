import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import useLoadingScreen from "./../../../Components/LoadingScreen";
import swal from "sweetalert";

import ServiceProdutos from "src/services/ServiceProdutos";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import "./editarCsn.css";
import { getClaims } from "src/MicrosoftAuthentication";
import ServiceCargas from "src/services/ServiceCargas";
import FormularioCadastroCSN from "src/Pages/Components/FormularioCadastroCSN";
import { funcBodyEdit, validarInputEfetivo } from "./menagemente";
import { validationPermissionUser } from "src/Pages/Utils/validationPermissionUser";
import { InputReferencError } from "src/Pages/Components/FormularioCadastroCSN/management";
import { funcScrollTop } from "src/Pages/Utils/scrollTop";

function EditarCargaCsn() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const { id } = useParams();
	const history = useHistory();
	const [produtos, setProdutos] = useState([]);
	const [viewsInput, setViewsInput] = useState(0);
	const [isPermissionUser, setPermissionUser] = useState(true);
	const [isDateErrorInput, setDateErrorInput] = useState(InputReferencError);

	const messageDadosIncorretoInput = () => {
		return swal(
			"Atenção",
			"Não foi possível registrar as informações, verifique os campos de data antes de continuar!",
			"info"
		);
	};

	const formik = useFormik({
		initialValues: {
			responsavel_cadastro: String(getClaims().name),
			id: "(Será autogerado)",
			e_lote: false,
			cliente: "",
			data_coleta: "",
			data_entrega: "",
			tipo_carga: "",
			quantidade: "",
			unidade_medida: "KG",
			acessorios_requisitos: "",
			informacoes_restritivas: "",
			janela_coleta: "",
			janela_entrega: "",
			placa_veiculo: "",
			rastreador: null,
			documento_transporte: "",
			locais: "",
			nome_motorista: "",
			finalizarCarga: "",
			ponto_passagem: {
				ponto: " 60 - POSTO - 30",
				tipoServico: "Coleta",
				previsao: "",
				previsaoSaida: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
				//coletaEfetiva_posto30: "",
				coletaEfetiva: "",
				coletaEfetivaSaida: "",
				tempServicoLocal: "",
			},
			ponto_passagem2: {
				ponto: "51 - MUNDO - CSN",
				tipoServico: "Coleta",
				previsao: "",
				previsaoSaida: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
				//coletaEfetiva_mundo: "",
				coletaEfetiva: "",
				coletaEfetivaSaida: "",
				tempServicoLocal: "",
			},
			ponto_passagem3: {
				ponto: "59 - PEACAO - CSN",
				tipoServico: "Coleta",
				previsao: "",
				previsaoSaida: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
				//coletaEfetiva_peacao: "",
				coletaEfetiva: "",
				coletaEfetivaSaida: "",
				tempServicoLocal: "",
			},
			ponto_passagem4: {
				ponto: "",
				tipoServico: "Entrega",
				previsao: "",
				previsaoSaida: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
				coletaEfetiva: "",
				coletaEfetivaSaida: "",
				tempServicoLocal: "",
				entregaEfetiva: "",
				entregaEfetivaSaida: "",
			},
			ponto_passagem5: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				previsaoSaida: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
				coletaEfetiva: "",
				coletaEfetivaSaida: "",
				tempServicoLocal: "",
				tempServicoLocalEntrega: "",
				entregaEfetiva: "",
				entregaEfetivaSaida: "",
			},
			ponto_passagem6: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				previsaoSaida: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
				coletaEfetiva: "",
				coletaEfetivaSaida: "",
				tempServicoLocal: "",
				tempServicoLocalEntrega: "",
				entregaEfetiva: "",
				entregaEfetivaSaida: "",
			},
			ponto_passagem7: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				previsaoSaida: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
				coletaEfetiva: "",
				coletaEfetivaSaida: "",
				tempServicoLocal: "",
				tempServicoLocalEntrega: "",
				entregaEfetiva: "",
				entregaEfetivaSaida: "",
			},
		},
		onSubmit: async (values) => {
			setLoading(true);
			const existInputErrado = isDateErrorInput.find(
				(item) => item.error === true
			);

			if (existInputErrado?.error) {
				messageDadosIncorretoInput();
			} else {
				const {
					ponto_passagem,
					ponto_passagem2,
					ponto_passagem3,
					ponto_passagem4,
					ponto_passagem5,
					ponto_passagem6,
					ponto_passagem7,
				} = values;

				const dadosPontoPassagem = {
					ponto_passagem,
					ponto_passagem2,
					ponto_passagem3,
					ponto_passagem4,
					ponto_passagem5,
					ponto_passagem6,
					ponto_passagem7,
				};
				try {
					let dadosCargaSalva;
					let showMessageSucesso = true;
					const finalizarCarga = formik.values.finalizarCarga;

					if (finalizarCarga !== true) {
						values.fk_filial = values.fk_filial.split("-")[0];
						const { data } = await ServiceCargas.updateCSN({
							...values,
							info_passagem: dadosPontoPassagem,
							responsavel_cadastro: String(getClaims().name),
							fk_situacao: undefined,
							fk_filial: formik.values.fk_filial?.split("-")[0],
							carga_csn: 1,
						});
						dadosCargaSalva = data;
					} else {
						const resultOk = await swal(
							`Certeza que deseja finalizar a  carga?`,
							{
								dangerMode: true,
								buttons: ["Cancelar", true],
								icon: "warning",
							}
						);
						if (resultOk) {
							const InputEfetivoCorreto = await validarInputEfetivo(
								6,
								values.id
							);

							if (!InputEfetivoCorreto) {
								showMessageSucesso = false;
								messageDadosIncorretoInput();
							} else {
								await ServiceCargas.updateCSN({
									...formik.values,
									info_passagem: dadosPontoPassagem,
									fk_situacao: 6,
									fk_filial: formik.values.fk_filial?.split("-")[0],
								});
							}
						} else {
							window.open("", "_self").close();
						}
					}

					formik.setFieldValue(
						"responsavel_cadastro",
						String(getClaims().name)
					);

					const mensagemConfirmacao =
						finalizarCarga !== true
							? `A carga ${dadosCargaSalva.data.id} foi atualizada!`
							: "Carga finalizada.";

					if (showMessageSucesso) {
						const ok = await swal("Sucesso!", mensagemConfirmacao, "success", {
							closeOnClickOutside: false,
						});

						if (ok) {
							window.location.reload();
						}
					}
				} catch (error) {
					console.log(error);
				}
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

	async function handleExcluirCarga() {
		setLoading(true);
		try {
			const observacaoExclusao = await swal(`Digite o motivo da exclusão`, {
				content: "input",
				dangerMode: true,
				buttons: ["Cancelar", true],
				icon: "warning",
			});
			if (observacaoExclusao) {
				await ServiceCargas.delete({
					id: formik.values.id,
					observacao_exclusao: observacaoExclusao,
				});
				await swal("Sucesso!", "Carga removida", "success");
				handleCloseWindow(null, false);
			} else {
				swal("Nenhuma alteração realizada");
			}
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

	async function handleCancelarCarga() {
		setLoading(true);
		try {
			const observacaoCancelamento = await swal(
				`Digite o motivo do cancelamento`,
				{
					content: "input",
					dangerMode: true,
					buttons: ["Cancelar", true],
					icon: "warning",
				}
			);
			if (observacaoCancelamento) {
				await ServiceCargas.update({
					...formik.values,
					fk_situacao: 5,
					observacao_cancelamento: observacaoCancelamento,
					fk_filial: formik.values.fk_filial?.split("-")[0],
					carga_csn: 1,
				});
				await swal("Sucesso!", "Carga cancelada.", "success");
				await carregarCarga();
			} else {
				await swal("Nenhuma alteração realizada.");
			}
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

	async function carregarCarga() {
		try {
			let city;
			const carga = (await ServiceCargas.indexCsn({ id })).data.data;
			for (let i in carga) {
				let nonNullValue = carga[i] === null ? "" : carga[i];
				if (i.indexOf("data") !== -1) {
					formik.setFieldValue(i, nonNullValue?.split("T")[0]);
				} else if (i === "e_lote") {
					formik.setFieldValue("e_lote", !!nonNullValue);
				} else {
					if (i === "fk_filial") {
						city = nonNullValue;
					}
					if (i === "filial.descricao") {
						const cidade = `${city} - ${nonNullValue} `;
						formik.setFieldValue("fk_filial", cidade);
					}
					if (i === "ponto_parada") {
						let count = 0;
						if (nonNullValue.length > 0) {
							nonNullValue.map(async (data, index) => {
								switch (index) {
									case 0:
										{
											const body = funcBodyEdit(data, "Coleta");
											await formik.setFieldValue("ponto_passagem", body);
										}
										break;
									case 1: {
										{
											const body1 = funcBodyEdit(data, "Coleta");
											await formik.setFieldValue("ponto_passagem2", body1);
										}
										break;
									}
									case 2: {
										{
											const body2 = funcBodyEdit(data, "Coleta");
											await formik.setFieldValue("ponto_passagem3", body2);
										}
										break;
									}
									case 3: {
										{
											const body3 = funcBodyEdit(data, "Entrega");
											await formik.setFieldValue("ponto_passagem4", body3);
										}
										break;
									}
									default:
										if (index) {
											count = index + 1;
											setViewsInput(count);
											let tipoCarga =
												data.STATUS_SERVICO === "COLETA" ? "Coleta" : "Entrega";
											let body4 = funcBodyEdit(data, tipoCarga);
											await formik.setFieldValue(
												"ponto_passagem" + count,
												body4
											);
										}
										break;
								}
							});
						}
					}
					formik.setFieldValue(i, nonNullValue);
				}
			}
		} catch (error) {
			history.push("");
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

		ServiceProdutos.list().then(({ data }) => {
			setProdutos(data.data);
		});

		(async () => {
			const userPermission = await validationPermissionUser();
			if (
				userPermission?.permissoes.includes("MANUTENCAO_TRAJETO_FINALIZADO")
			) {
				setPermissionUser(false);
			}
		})();
		funcScrollTop(2, 2);
		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		formik.setFieldValue("placa_veiculo", "");
	}, [formik.values.e_lote]);

	const showInfoTitle = [6, 9].includes(formik.values?.fk_situacao)
		? "info-tilte"
		: "d-none";

	return (
		<>
			<LoadingScreen />
			{/* <CabecalhoFixado>Edição de carga aberta manualmente</CabecalhoFixado> */}
			<Menusuperior />
			<Container className="mb-5 mt-5">
				<div className="div-title">
					<p className="mb-1" id="style-title-editorCarga">
						Editar Carga CSN
					</p>
					<h6 className={showInfoTitle}>carga finalizada!</h6>
				</div>
				<hr />
				<Form onSubmit={formik.handleSubmit}>
					<FormularioCadastroCSN
						buscarCargaComDocumentoDeTransporte={
							buscarCargaComDocumentoDeTransporte
						}
						produtos={produtos}
						formik={formik}
						viewsInput={viewsInput}
						isPermissionUser={isPermissionUser}
						setDateErrorInput={setDateErrorInput}
						isDateErrorInput={isDateErrorInput}
					/>
					<div className="class-group-button">
						<Button
							variant="success"
							type="submit"
							className="p-2  botao-gravar"
							disabled={
								[3, 5].includes(formik.values.fk_situacao) ||
								([6, 7, 8, 9].includes(formik.values.fk_situacao) &&
									isPermissionUser)
							}
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

						{(formik.values.fk_situacao === 1 ||
							formik.values.fk_situacao === 2) && (
							<Button
								variant="danger"
								className="p-2"
								onClick={handleExcluirCarga}
							>
								Excluir
							</Button>
						)}
						{[3, 6, 7, 8, 9].includes(formik.values.fk_situacao) && (
							<Button
								variant="danger"
								className="p-2"
								onClick={handleCancelarCarga}
							>
								Cancelar carga
							</Button>
						)}

						{[3, 7, 8].includes(formik.values.fk_situacao) && (
							<Button
								variant="info"
								className="p-2"
								type="submit"
								onClick={() => formik.setFieldValue("finalizarCarga", true)}
							>
								Finalizar carga
							</Button>
						)}
					</div>
				</Form>
			</Container>
		</>
	);
}

export default EditarCargaCsn;
