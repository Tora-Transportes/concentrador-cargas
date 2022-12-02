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
import { funcBodyEdit } from "./menagemente";

function EditarCargaCsn() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const { id } = useParams();
	const history = useHistory();
	const [produtos, setProdutos] = useState([]);
	const [viewsInput, setViewsInput] = useState(0);

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
			documento_transporte: "",
			ponto_passagem: {
				ponto: " 45 - POSTO - 30",
				tipoServico: "Coleta",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
			},
			ponto_passagem2: {
				ponto: "47 - MUNDO - CSN",
				tipoServico: "Coleta",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
			},
			ponto_passagem3: {
				ponto: "46 - PEACAO - CSN",
				tipoServico: "Coleta",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
			},
			ponto_passagem4: {
				ponto: "",
				tipoServico: "Entrega",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
			},
			ponto_passagem5: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
			},
			ponto_passagem6: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
			},
			ponto_passagem7: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
			},
			ponto_passagem8: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
			},
			ponto_passagem9: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
			},
			ponto_passagem10: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
			},
			ponto_passagem11: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
			},
			ponto_passagem12: {
				ponto: "",
				tipoServico: "",
				previsao: "",
				latitude: "",
				longitude: "",
				client: "",
				id: "",
				idRotaCsn: "",
			},
		},
		onSubmit: async (values) => {
			setLoading(true);
			const {
				ponto_passagem,
				ponto_passagem2,
				ponto_passagem3,
				ponto_passagem4,
				ponto_passagem5,
				ponto_passagem6,
				ponto_passagem7,
				ponto_passagem8,
				ponto_passagem9,
				ponto_passagem10,
				ponto_passagem11,
				ponto_passagem12,
			} = values;
			try {
				values.fk_filial = values.fk_filial.split("-")[0];
				const { data } = await ServiceCargas.update({
					...values,
					responsavel_cadastro: String(getClaims().name),
					fk_situacao: undefined,
					fk_filial: formik.values.fk_filial?.split("-")[0],
					carga_csn: 1,
				});

				for (const [key, value] of Object.entries({
					ponto_passagem,
					ponto_passagem2,
					ponto_passagem3,
					ponto_passagem4,
					ponto_passagem5,
					ponto_passagem6,
					ponto_passagem7,
					ponto_passagem8,
					ponto_passagem9,
					ponto_passagem10,
					ponto_passagem11,
					ponto_passagem12,
				})) {
					if (
						(value?.ponto?.length > 0 && value?.previsao?.length > 0) ||
						(typeof value?.latitude !== "string" &&
							typeof value?.longitude !== "string")
					) {
						await ServiceCargas.updatePontoParada({
							...value,
							id_carga: values.id,
							key,
						});
					}
				}

				formik.setFieldValue("responsavel_cadastro", String(getClaims().name));
				const ok = await swal(
					"Sucesso!",
					`A carga ${data.data.id} foi atualizada!`,
					"success"
				);

				if (ok) {
					window.location.reload();
				}
				//swal("Sucesso!", `A carga  foi atualizada!`, "success");
				//await carregarCarga();
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
					cargas_csn: 1,
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

	async function handleEmitirDocumento() {
		setLoading(true);
		try {
			const ok = await swal(
				`Certeza que deseja emitir o documento dessa carga?`,
				{
					dangerMode: true,
					buttons: ["Cancelar", true],
					icon: "warning",
				}
			);
			if (ok) {
				await ServiceCargas.update({
					...formik.values,
					fk_situacao: 6,
					fk_filial: formik.values.fk_filial?.split("-")[0],
				});
				await swal("Sucesso!", "Documento emitido.", "success");
				await carregarCarga();
			} else {
				await swal("Nenhuma alteração realizada.");
			}
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

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
				return distance;
			} catch (error) {
				return 1;
			}
		}
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
										if (index === 0) {
											const body = funcBodyEdit(data, "Coleta");
											await formik.setFieldValue("ponto_passagem", body);
										}
										break;
									case 1: {
										if (index === 1) {
											const body1 = funcBodyEdit(data, "Entrega");
											await formik.setFieldValue("ponto_passagem4", body1);
										}
										break;
									}
									default:
										if (index) {
											count = index + 3;
											setViewsInput(count);
											let tipoCarga =
												data.STATUS_SERVICO === "COLETA" ? "Coleta" : "Entrega";
											let body2 = funcBodyEdit(data, tipoCarga);
											await formik.setFieldValue(
												"ponto_passagem" + count,
												body2
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
			handleSearchDistance(carga);
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
		return () => {
			isMounted = false;
		};
	}, []);

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
			{/* <CabecalhoFixado>Edição de carga aberta manualmente</CabecalhoFixado> */}
			<Menusuperior />
			<Container className="mb-5 mt-5">
				<p id="style-title-editorCarga">Editar Carga CSN</p>
				<hr />
				<Form onSubmit={formik.handleSubmit}>
					<FormularioCadastroCSN
						buscarCargaComDocumentoDeTransporte={
							buscarCargaComDocumentoDeTransporte
						}
						handleSearchDistance={handleSearchDistance}
						produtos={produtos}
						formik={formik}
						viewsInput={viewsInput}
					/>
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

						{formik.values.fk_situacao !== 3 &&
							formik.values.fk_situacao !== 6 && (
								<Button
									variant="danger"
									className="p-2"
									onClick={handleExcluirCarga}
								>
									Excluir
								</Button>
							)}
						{formik.values.fk_situacao === 3 && (
							<Button
								variant="danger"
								className="p-2"
								onClick={handleCancelarCarga}
							>
								Cancelar carga
							</Button>
						)}

						{formik.values.fk_situacao === 3 && (
							<Button
								variant="info"
								className="p-2"
								onClick={handleEmitirDocumento}
							>
								Emitir documento
							</Button>
						)}
					</div>
				</Form>
			</Container>
		</>
	);
}

export default EditarCargaCsn;
