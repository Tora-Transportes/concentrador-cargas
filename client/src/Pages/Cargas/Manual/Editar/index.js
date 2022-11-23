import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import useLoadingScreen from "../../../Components/LoadingScreen";
import swal from "sweetalert";
import ServiceCargas from "../../../../services/ServiceCargas";
import { getClaims } from "../../../../MicrosoftAuthentication";
import ServiceProdutos from "src/services/ServiceProdutos";
import FormularioCadastroManual from "src/Pages/Components/FormularioCadastroManual";
// import CabecalhoFixado from "src/Pages/Components/CabecalhoFixado";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import "../Editar/style.css";

function Manual() {
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
				values.fk_filial = values.fk_filial.split("-")[0];
				const { data } = await ServiceCargas.update({
					...values,
					responsavel_cadastro: String(getClaims().name),
					fk_situacao: undefined,
					fk_filial: formik.values.fk_filial?.split("-")[0],
					carga_csn: 0,
				});
				formik.setFieldValue("responsavel_cadastro", String(getClaims().name));
				swal("Sucesso!", `A carga ${data.data.id} foi atualizada!`, "success");
				await carregarCarga();
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
					cargas_csn: 0,
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
			let city;
			const carga = (await ServiceCargas.index({ id })).data.data;
			setLoteInicial(carga.e_lote);
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
			{/* <CabecalhoFixado>Edição de carga aberta manualmente</CabecalhoFixado> */}
			<Menusuperior />
			<Container className="mb-5 mt-5">
				<p id="style-title-editorCarga">Editar carga aberta manualmente</p>
				<hr />
				<Form onSubmit={formik.handleSubmit}>
					<FormularioCadastroManual
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

export default Manual;
