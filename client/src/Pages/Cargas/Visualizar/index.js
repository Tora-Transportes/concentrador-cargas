import React, { useReducer, useState, useEffect } from "react";
import View from "./view";

import { Form } from "react-bootstrap";
import { BsPencilSquare } from "react-icons/bs";
import InputCliente from "src/Pages/Components/InputCliente";
import ResponsavelCadastroSelect from "src/Pages/Components/ResponsavelCadastroSelect";
import { Link } from "react-router-dom";
import ServiceCargas from "../../../services/ServiceCargas";
import useLoadingScreen from "../../Components/LoadingScreen";
import useLocalstorage from "../../Components/useLocalstorage";

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
	const columns = [
		{
			name: "id",
			description: "Código da Carga",
			selector: (row) => row.id,
		},
		{
			name: "cliente",
			description: "Cliente",
			selector: (row) => row.cliente.split(" -")[0],
			Filter: (props) => <InputCliente label="" {...props} />,
		},
		{
			name: "origem_carga",
			description: "Origem",
			selector: (row) => row.origem_carga,
			Filter: () => null,
		},
		{
			name: "destino_carga",
			description: "Destino",
			selector: (row) => row.destino_carga,
			Filter: () => null,
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
			name: "e_lote",
			description: "Lote ?",
			selector: (row) => (row.e_lote ? "Sim" : "Não"),
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="1">Sim</option>
					<option value="0">Não</option>
				</Form.Select>
			),
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
			name: "editar",
			description: "Editar",
			static_column: true,
			selector: (row) => (
				<Link
					to={`/cargas/${row.canal_comunicacao}/${row.id}`}
					target="_blank"
					rel="noopener"
				>
					<BsPencilSquare />
				</Link>
			),
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
	function formatDate(date) {
		return date.split("T")[0].split("-").reverse().join("/");
	}

	async function handleExportExcel() {
		setLoading(true);
		const { filters, orderBy } = filtroAtual;
		const options = {
			...filters,
			order_column: orderBy?.column,
			order_direction: orderBy?.direction,
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

	async function get_data(options) {
		setLoading(true);

		try {
			const { filters, orderBy, page } = options;
			setFiltroAtual({ filters, orderBy, page });
			const { data } = await ServiceCargas.search({
				...filters,
				page,
				order_column: orderBy?.column,
				order_direction: orderBy?.direction,
			});
			setLoading(false);

			return {
				total_pages: data.data.total_pages,
				current_page: page || 1,
				data: data.data.results,
			};
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

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
			columns={orderedColumns.filter((c) => columnsToDisplay.includes(c.name))}
			LoadingComponent={LoadingComponent}
			displayColumns={displayColumns}
			dispatchColumns={reducerColumns}
			activeModal={activeModal}
			handleToggleModal={handleToggleModal}
		/>
	);
}

export default Visualizar;
