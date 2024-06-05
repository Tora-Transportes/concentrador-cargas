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
		return opcoesTemplate(rowData, handleAprove, handleReject);
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
