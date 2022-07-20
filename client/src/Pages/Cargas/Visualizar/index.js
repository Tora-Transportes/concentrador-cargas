import React, { useReducer, useState, useEffect, useCallback } from "react";
import View from "./view";
import ServiceCargas from "../../../services/ServiceCargas";
import useLoadingScreen from "../../Components/LoadingScreen";
import useLocalstorage from "../../Components/useLocalstorage";
import io from "../../../services/socket";
import factoryReducerCargas from "src/hooks/storageCargas/factoryReducerCargas";
import { columns } from "./ColumnsTemplate";

function reducerActiveColumns(state, action) {
	const index = state.findIndex((i) => i.field === action.field);
	let before;
	switch (action.type) {
		case "ENABLE_FIELD":
			return state.map((i) =>
				i.field === action.field ? { ...i, active: true } : i
			);
		case "DISABLE_FIELD":
			return state.map((i) =>
				i.field === action.field ? { ...i, active: false } : i
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

	const defaultStorageColumns = columns.map((i) => ({
		field: i.field,
		active: true,
		header: i.header,
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
		.map((i) => i.field);

	const orderedColumns = columnsToDisplay.map((i) =>
		columns.find((j) => j.field === i)
	);

	useEffect(() => {
		setStorage(displayColumns);
	}, [displayColumns]);

	return (
		<View
			handleExportExcel={handleExportExcel}
			get_data={get_data}
			values={cargas}
			columns={orderedColumns.filter((c) => columnsToDisplay.includes(c.field))}
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
