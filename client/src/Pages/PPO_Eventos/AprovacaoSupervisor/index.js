/* eslint-disable no-prototype-builtins */
import React, { useEffect, useRef, useState } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import { Container, Row } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
	nameBodyTemplate,
	opcoesTemplate,
	renderHeader,
	criadoBodyTemplate,
	horasBodyTemplate,
	statusBodyTemplate,
} from "./components/templateDataTable";
import swal from "sweetalert";
import swal2 from "sweetalert2";
import ServicePPOEventosAprovacao from "src/services/PPO/ServicePPOEventosAprovacao";
import { possuiPermissaoPPOEventosAprovacao } from "src/Pages/Utils/validationPermissionUser";

const AprovacaoSupervisor = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [globalFilter, setGlobalFilter] = useState();
	const [registros, setRegistros] = useState([]);
	const dadosTabela = useRef(null);

	async function loadList() {
		return ServicePPOEventosAprovacao.list();
	}

	async function details(id_pacote_ini, id_pacote_fim) {
		return ServicePPOEventosAprovacao.detalhes(id_pacote_ini, id_pacote_fim);
	}

	async function handleDetails(id_pacote_ini, id_pacote_fim) {
		setLoading(true);
		Promise.all([details(id_pacote_ini, id_pacote_fim)])
			.then(function (values) {
				const pacoteIni = values[0][0];
				const pacoteFim = values[0][1];
				const htmlContent = `
				<div style="font-size: 14px; text-align: left;">
					<h5>Pacote Início:</h5>
					<div>
						<div><strong>Placa:</strong> <span>${pacoteIni.placa}</span></div>
						<div><strong>Pacote:</strong> <span>${pacoteIni.id_pacote}</span></div>
						<div><strong>CPF:</strong> <span>${pacoteIni.cpf}</span></div>
						<div><strong>Matrícula:</strong> <span>${pacoteIni.matricula}</span></div>
						<div><strong>Cidade:</strong> <span>${pacoteIni.cidade}</span></div>
						<div><strong>UF:</strong> <span>${pacoteIni.UF}</span></div>
						<div><strong>Latitude:</strong> <span>${pacoteIni.lat}</span></div>
						<div><strong>Longitude:</strong> <span>${pacoteIni.long}</span></div>
						<div><strong>Data Pacote:</strong> <span>${new Date(
							pacoteIni.data_pacote
						).toLocaleString("pt-BR", { timeZone: "UTC" })}</span></div>
						<div><strong>Ponto de Referência:</strong> <span>${
							pacoteIni.ponto_ref
						}</span></div>
					</div>
					<br/>
					<h5>Pacote Fim:</h5>
					<div>
						<div><strong>Placa:</strong> <span>${pacoteFim.placa}</span></div>
						<div><strong>Pacote:</strong> <span>${pacoteFim.id_pacote}</span></div>
						<div><strong>CPF:</strong> <span>${pacoteFim.cpf}</span></div>
						<div><strong>Matrícula:</strong> <span>${pacoteFim.matricula}</span></div>
						<div><strong>Cidade:</strong> <span>${pacoteFim.cidade}</span></div>
						<div><strong>UF:</strong> <span>${pacoteFim.UF}</span></div>
						<div><strong>Latitude:</strong> <span>${pacoteFim.lat}</span></div>
						<div><strong>Longitude:</strong> <span>${pacoteFim.long}</span></div>
						<div><strong>Data Pacote:</strong> <span>${new Date(
							pacoteFim.data_pacote
						).toLocaleString("pt-BR", { timeZone: "UTC" })}</span></div>
						<div><strong>Ponto de Referência:</strong> <span>${
							pacoteFim.ponto_ref
						}</span></div>
					</div>
				</div>
			`;

				// Exibindo o popup com os detalhes dos pacotes
				swal2.fire({
					html: htmlContent,
				});
			})
			.catch((error) => {
				console.error(error);
			});
		setLoading(false);
	}

	useEffect(() => {
		async function verificaPermissaoAprovacao() {
			setLoading(true);
			const possui = await possuiPermissaoPPOEventosAprovacao(0);
			if (possui) {
				await reloadList();
			}
		}
		verificaPermissaoAprovacao();
	}, []);

	async function reloadList() {
		setLoading(true);
		Promise.all([loadList()])
			.then(function (values) {
				setRegistros(values[0]);
			})
			.catch((error) => {
				console.error(error);
			});
		setLoading(false);
	}

	const getOpcoesTemplate = (rowData) => {
		return opcoesTemplate(rowData, handleAprove, handleReject, handleDetails);
	};

	const getRenderHeader = () => {
		return renderHeader(globalFilter, setGlobalFilter);
	};

	async function handleAprove(obj) {
		const observacao = await swal(
			`Digite uma observação para finalizar a aprovação de ${obj.nome} relacionado ás ${obj.horas} horas :`,
			{
				content: "input",
				inputAttributes: {
					maxlength: "500",
					autocapitalize: "off",
					autocorrect: "off",
				},
				buttons: ["Cancelar", true],
			}
		);
		if (observacao === null) {
			return;
		}
		if (!observacao) {
			return swal("Registro não foi aprovado por falta de observação");
		}

		try {
			await ServicePPOEventosAprovacao.update(obj.id, {
				status: 1,
				observacao: observacao,
			});
			await reloadList();
			swal("Sucesso!", "Registro Aprovado e enviado ao Gerente", "success");
		} catch (error) {
			console.log(error);
		}
	}

	async function handleReject(obj) {
		const observacao = await swal(
			`Digite uma observação para finalizar a reprovação de ${obj.nome} relacionado ás ${obj.horas} horas :`,
			{
				content: "input",
				inputAttributes: {
					maxlength: "500",
					autocapitalize: "off",
					autocorrect: "off",
				},
				buttons: ["Cancelar", true],
			}
		);
		if (observacao === null) {
			return;
		}
		if (!observacao) {
			return swal("Registro não foi reprovado por falta de observação");
		}

		try {
			await ServicePPOEventosAprovacao.update(obj.id, {
				status: 3,
				observacao: observacao,
			});
			await reloadList();
			swal("Sucesso!", "Registro Reprovado", "success");
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Container className="pagina-produtos">
				<Row>
					<h1 className="class-title-produto">Aprovação Eventos Supervisor</h1>
					<div className="datatable-responsive-demoPermissoes">
						<DataTable
							className="p-datatable-responsive-demoPermissoes"
							ref={dadosTabela}
							globalFilter={globalFilter}
							value={registros}
							header={getRenderHeader()}
							paginator
							rows={60}
							paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
							emptyMessage="Não foram encontrados resultados nessa busca."
							rowsPerPageOptions={[80, 100]}
							stripedRows
						>
							<Column
								body={nameBodyTemplate}
								field="nome"
								header="Nome"
								bodyStyle={{ color: "red" }}
								//className="table-column-nome"
							/>
							<Column
								body={horasBodyTemplate}
								field="horas"
								header="Horas"
								bodyStyle={{ color: "green" }}
								//className="table-column-nome"
							/>
							<Column field="cpf" header="CPF" />
							<Column
								body={statusBodyTemplate}
								field="status_aprovacao"
								header="Status"
							/>
							<Column
								body={criadoBodyTemplate}
								field="cod_usu_create"
								header="Criado por:"
								className="table-column-email"
							/>

							<Column
								header="Ações"
								body={getOpcoesTemplate}
								className="table-column-acoes"
							/>
						</DataTable>
					</div>
				</Row>
			</Container>
		</>
	);
};

export default AprovacaoSupervisor;
