import React, { useReducer, useState, useEffect, useCallback } from "react";
import View from "../ViewsVisualizacao";
import ServiceCargas from "../../../services/ServiceCargas";
import useLoadingScreen from "../../Components/LoadingScreen";
import useLocalstorage from "../../Components/useLocalstorage";
import factoryReducerCargas from "../../../hooks/storageCargas/factoryReducerCargas";
import io from "../../../services/socket";
import { reducerActiveColumns } from "src/Pages/Components/Reducer/reducerActiveColumns";
import { columns } from "../CollumnsTables/ColumnsTemplate";

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
	const reducerCargas = useCallback(factoryReducerCargas(defaultCargas), []);
	const [cargas, dispatchCargas] = useReducer(reducerCargas, defaultCargas);

	useEffect(() => {
		const actionCargasCreate = (payload) => {
			if (payload.e_lote) {
				dispatchCargas({ type: "ADD_CARGA", payload });
			}
		};
		const actionCargasUpdate = (payload) => {
			dispatchCargas({ type: "UPDATE_CARGA", payload });
		};
		const actionCargasDelete = (payload) => {
			dispatchCargas({ type: "DELETE_CARGA", payload });
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
		"table-columns-lote",
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

	function resetView() {
		localStorage.removeItem("table-columns-lote");
		location.reload();
	}

	async function handleExportExcel() {
		setLoading(true);
		const { filters, orderBy } = filtroAtual;
		const options = {
			...filters,
			order_column: orderBy?.column,
			order_direction: orderBy?.direction,
			e_lote: 1,
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
					e_lote: 1,
				});
				setLoading(false);
				dispatchCargas({
					type: "SET",
					payload: { ...data.data, current_page: data.data.page },
				});
				setTotalRegisters(Number(data.data.total_registers));
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
		[itensPerPage, dispatchCargas, setTotalRegisters]
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
			columns={orderedColumns.filter((c) => columnsToDisplay.includes(c.field))}
			LoadingComponent={LoadingComponent}
			displayColumns={displayColumns}
			dispatchColumns={reducerColumns}
			activeModal={activeModal}
			handleToggleModal={handleToggleModal}
			itensPerPage={itensPerPage}
			setItensPerPage={setItensPerPage}
			resetView={resetView}
			values={cargas}
			totalRegisters={totalRegisters}
			tituloPag="Grid de Cargas em Lote"
		/>
	);
}

export default Visualizar;
