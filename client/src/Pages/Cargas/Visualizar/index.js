import React, { useReducer, useState, useEffect, useCallback } from "react";
import View from "./view";

import { Form } from "react-bootstrap";
import { BsPencilSquare } from "react-icons/bs";
import InputCliente from "src/Pages/Components/InputCliente";
import ResponsavelCadastroSelect from "src/Pages/Components/ResponsavelCadastroSelect";
import { Link } from "react-router-dom";
import ServiceCargas from "../../../services/ServiceCargas";
import useLoadingScreen from "../../Components/LoadingScreen";
import useLocalstorage from "../../Components/useLocalstorage";
import SelectStatusCarga from "../../Components/SelectStatusCargas";

import StatusTooltip from "src/Pages/Components/StatusTooltip";
import io from "../../../services/socket";
import factoryReducerCargas from "src/hooks/storageCargas/factoryReducerCargas";

import CollapseHint from "../../Components/CollapseHint";

function reducerActiveColumns(state, action) {
	const index = state.findIndex((i) => i.name === action.name);
	let before;
	switch (action.type) {
		case "ENABLE_FIELD":
			return state.map((i) =>
				i.name === action.name ? { ...i, active: true } : i
			);
		case "DISABLE_FIELD":
			return state.map((i) =>
				i.name === action.name ? { ...i, active: false } : i
			);
		case "UP_FIELD":
			if (index > 0) {
				before = state[index - 1];
				state[index - 1] = state[index];
				state[index] = before;
			}
			return [...state];
		case "DOWN_FIELD":
			if (index < state.length - 1) {
				before = state[index];
				state[index] = state[index + 1];
				state[index + 1] = before;
			}
			return [...state];
		case "ENABLE_ALL":
			return state.map((i) => ({ ...i, active: true }));
		case "DISABLE_ALL":
			return state.map((i) => ({ ...i, active: false }));
		default:
			throw new Error("Invalid action");
	}
}

function reducerToggleModal(state) {
	return !state;
}

function Visualizar() {
	const [totalRegisters, setTotalRegisters] = useState(0);
	const defaultCargas = {
		page: 1,
		total_pages: 1,
		results: [],
	};
	const cargasReducer = useCallback(factoryReducerCargas(defaultCargas), []);
	const [cargas, dispatchCargas] = useReducer(cargasReducer, defaultCargas);

	useEffect(() => {
		const actionCargasCreate = (payload) => {
			if (!payload.e_lote) {
				setTotalRegisters((old) => old + 1);
				dispatchCargas({ type: "ADD_CARGA", payload });
			}
		};
		const actionCargasUpdate = (payload) => {
			dispatchCargas({ type: "UPDATE_CARGA", payload });
		};
		const actionCargasDelete = (payload) => {
			if (!payload.e_lote) {
				setTotalRegisters((old) => old - 1);
				dispatchCargas({ type: "DELETE_CARGA", payload });
			}
		};
		io.on("@carga-create", actionCargasCreate);
		io.on("@carga-update", actionCargasUpdate);
		io.on("@carga-delete", actionCargasDelete);

		return () => {
			io.off("@carga-create", actionCargasCreate);
			io.off("@carga-update", actionCargasUpdate);
			io.off("@carga-delete", actionCargasDelete);
		};
	}, [io]);

	const columns = [
		{
			name: "fk_situacao",
			description: "Situação",
			selector: (row) => (
				<StatusTooltip
					color={row["situacao.cor"]}
					hint={row["situacao.descricao"]}
				/>
			),
			Filter: (props) => (
				<SelectStatusCarga {...props}>
					<option></option>
				</SelectStatusCarga>
			),
		},
		{
			name: "id",
			description: "Código da Carga",
			selector: (row) => row.id,
		},
		{
			name: "cliente",
			description: "Cliente",
			selector: (row) => row.cliente.split(" -")[0],
			Filter: (props) => (
				<div className="mt-3">
					<InputCliente label="" {...props} style={{ height: "24px" }} />
				</div>
			),
		},
		{
			name: "origem_carga",
			description: "Origem",
			selector: (row) => row.origem_carga,
		},
		{
			name: "destino_carga",
			description: "Destino",
			selector: (row) => row.destino_carga,
		},
		{
			name: "data_coleta",
			description: "Data coleta",
			selector: (row) => formatDate(row.data_coleta),
			Filter: (props) => <Form.Control type="date" {...props} />,
		},
		{
			name: "data_entrega",
			description: "Data Entrega",
			selector: (row) => formatDate(row.data_entrega),
			Filter: (props) => <Form.Control type="date" {...props} />,
		},
		{
			name: "data_cadastro",
			description: "Data Cadastro",
			selector: (row) => formatDate(row.data_cadastro),
			Filter: (props) => <Form.Control type="date" {...props} />,
		},
		{
			name: "tipo_carga",
			description: "Tipo Carga",
			selector: (row) => row.tipo_carga,
		},
		{
			name: "canal_comunicacao",
			description: "Canal comunicação",
			selector: (row) => row.canal_comunicacao,
			Filter: () => null,
		},
		{
			name: "unidade_medida",
			description: "UN",
			selector: (row) => row.unidade_medida,
			Filter: () => null,
		},
		{
			name: "quantidade",
			description: "Quantidade",
			selector: (row) => row.quantidade,
			Filter: () => null,
		},
		{
			name: "responsavel_cadastro",
			description: "Responsável Cadastro",
			selector: (row) => row.responsavel_cadastro,
			Filter: (props) => <ResponsavelCadastroSelect {...props} />,
		},
		{
			name: "local_coleta",
			description: "Local de coleta",
			selector: (row) => row.local_coleta || "",
			Filter: () => null,
		},
		{
			name: "local_entrega",
			description: "Local de entrega",
			selector: (row) => row.local_entrega || "",
			Filter: () => null,
		},
		{
			name: "janela_coleta",
			description: "Janela de coleta",
			selector: (row) => row.janela_coleta || "",
			Filter: () => null,
		},
		{
			name: "janela_entrega",
			description: "Janela de entrega",
			selector: (row) => row.janela_entrega || "",
			Filter: () => null,
		},
		{
			name: "acessorios_requisitos",
			description: "Acessórios e requisitos",
			selector: (row) => (
				<CollapseHint text={row.acessorios_requisitos || ""} />
			),
			Filter: () => null,
		},
		{
			name: "informacoes_restritivas",
			description: "Informações restritivas",
			selector: (row) => (
				<CollapseHint text={row.informacoes_restritivas || ""} />
			),
			Filter: () => null,
		},
		{
			name: "observacao",
			description: "Observações",
			selector: (row) => <CollapseHint text={row.observacao || ""} />,
			Filter: () => null,
		},
		{
			name: "data_atualizacao",
			description: "Data última atualização",
			selector: (row) => formatDateAndHour(row.data_atualizacao),
			Filter: () => null,
		},
		{
			name: "fk_lote_pai",
			description: "Lote origem",
			selector: (row) => row.fk_lote_pai,
			Filter: () => null,
		},
		{
			name: "documento_transporte",
			description: "Documento de transporte",
			selector: (row) => row.documento_transporte,
		},
		{
			name: "editar",
			description: "Editar/Vincular",
			static_column: true,
			selector: (row) => (
				<Link
					to={`/cargas/${
						row.canal_comunicacao === "portal" ? "manual" : "manual"
					}/${row.id}`}
					target="_blank"
					rel="noopener"
				>
					<BsPencilSquare />
				</Link>
			),
		},
		{
			name: "observacao_gr",
			description: "Observação do GR",
			selector: (row) => <CollapseHint text={row.observacao_gr || ""} />,
			Filter: () => null,
		},
	];
	const defaultStorageColumns = columns.map((i) => ({
		name: i.name,
		active: true,
		description: i.description,
	}));

	const [storage, setStorage] = useLocalstorage(
		"table-columns",
		defaultStorageColumns
	);
	const [filtroAtual, setFiltroAtual] = useState(null);
	const [LoadingComponent, setLoading] = useLoadingScreen();
	const [displayColumns, reducerColumns] = useReducer(
		reducerActiveColumns,
		storage === null ? defaultStorageColumns : storage
	);
	const [activeModal, handleToggleModal] = useReducer(
		reducerToggleModal,
		false
	);
	const [itensPerPage, setItensPerPage] = useState(5);
	function formatDate(date) {
		return date?.split("T")[0].split("-").reverse().join("/");
	}
	function formatDateAndHour(date) {
		if (!date) return "";
		const [day, time] = date?.split("T");
		const daysFormatted = day.split("-").reverse().join("/");
		const timeFormatted = time.split(".")[0];
		return `${daysFormatted} ${timeFormatted}`;
	}

	async function handleExportExcel() {
		setLoading(true);
		const { filters, orderBy } = filtroAtual;
		const options = {
			...filters,
			order_column: orderBy?.column,
			order_direction: orderBy?.direction,
			e_lote: 0,
		};
		const response = await ServiceCargas.exportToXlsx(options);
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`RELATORIO-CARGAS_${new Date().getTime()}.xlsx`
		);
		link.click();
		setLoading(false);
	}

	function resetView() {
		localStorage.removeItem("table-columns");
		location.reload();
	}

	const get_data = useCallback(
		async function (options) {
			setLoading(true);

			try {
				const { filters, orderBy, page } = options;
				setFiltroAtual({ filters, orderBy, page });
				const { data } = await ServiceCargas.search({
					...filters,
					page,
					order_column: orderBy?.column,
					order_direction: orderBy?.direction,
					limit: itensPerPage,
					e_lote: 0,
				});
				setLoading(false);

				dispatchCargas({
					type: "SET",
					payload: {
						results: data.data.results,
						total_pages: data.data.total_pages,
						current_page: data.data.page,
					},
				});
				setTotalRegisters(Number(data.data.total_registers));
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
		[itensPerPage, setTotalRegisters]
	);

	const columnsToDisplay = displayColumns
		.filter((i) => i.active)
		.map((i) => i.name);

	const orderedColumns = columnsToDisplay.map((i) =>
		columns.find((j) => j.name === i)
	);

	useEffect(() => {
		setStorage(displayColumns);
	}, [displayColumns]);

	return (
		<View
			handleExportExcel={handleExportExcel}
			get_data={get_data}
			values={cargas}
			columns={orderedColumns.filter((c) => columnsToDisplay.includes(c.name))}
			LoadingComponent={LoadingComponent}
			displayColumns={displayColumns}
			dispatchColumns={reducerColumns}
			activeModal={activeModal}
			handleToggleModal={handleToggleModal}
			itensPerPage={itensPerPage}
			setItensPerPage={setItensPerPage}
			resetView={resetView}
			totalRegisters={totalRegisters}
		/>
	);
}

export default Visualizar;
