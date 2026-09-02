import React, { useCallback, useReducer, useRef, useState } from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import ViewReport from "./components/view";
import { getColumns } from "./components/columns";
import useLoadingScreen from "../../Components/LoadingScreen";
import factoryReducerCargas from "../../../hooks/storageCargas/factoryReducerCargas";
import ServicePPA from "src/services/PPA/ServicePPA";
import { Toast } from "primereact/toast";
import { STORAGE_COLUMNS_REPORTS } from "./constants";

const RelatorioReports = () => {
	const defaultCargas = {
		page: 1,
		total_pages: 1,
		results: [],
	};
	const cargasReducer = useCallback(factoryReducerCargas(defaultCargas), []);
	const toast = useRef(null);
	const [cargas, dispatchCargas] = useReducer(cargasReducer, defaultCargas);
	const [modalShowExcel, setModalShowExcel] = useState(false);
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [itensPerPage, setItensPerPage] = useState(10);
	const [totalRegisters, setTotalRegisters] = useState(0);
	const [lastOptions, setLastOptions] = useState({});

	const columnsResult = getColumns();
	const columnsPadrao = columnsResult.columnsRelatorio;

	function resetView() {
		localStorage.removeItem(STORAGE_COLUMNS_REPORTS);
		localStorage.removeItem("undefined"); // limpa bug antigo
		location.reload();
	}

	const tableFetchData = useCallback(
		async function (options) {
			setLoading(true);
			setLastOptions(options);

			const { column, direction } = options.orderBy ?? {};
			const { filters = {}, page = 1 } = options;

			try {
				const { data } = await ServicePPA.search({
					...filters,
					page,
					order_column: column,
					order_direction: direction,
				});

				const result = data?.data ?? {};
				setTotalRegisters(result.total_registers ?? 0);
				dispatchCargas({
					type: "SET",
					payload: {
						...result,
						current_page: result.page ?? page,
					},
				});
			} catch (error) {
				console.error("Erro ao consultar dados do PPA:", error);
				toast.current?.show({
					severity: "error",
					summary: "Erro ao carregar dados",
					detail: "Não foi possível carregar o relatório de motoristas.",
					life: 4000,
				});
			} finally {
				setLoading(false);
			}
		},
		[dispatchCargas]
	);

	async function handleExportExcel(date_execel_inicio, date_execel_fim) {
		setLoading(true);

		try {
			const { filters = {}, orderBy } = lastOptions ?? {};
			const options = {
				...filters,
				order_column: orderBy?.column,
				order_direction: orderBy?.direction,
				date_execel_inicio,
				date_execel_fim,
			};

			const response = await ServicePPA.exportToXlsx(options);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute(
				"download",
				`RELATORIO-PPA-MOTORISTAS_${new Date().getTime()}.xlsx`
			);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
			setModalShowExcel(false);
		} catch (error) {
			console.error("Erro ao exportar relatório PPA:", error);
			toast.current?.show({
				severity: "error",
				summary: "Erro ao exportar relatório",
				detail:
					error?.response?.data?.message ||
					"Não foi possível exportar o relatório.",
				life: 5000,
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Toast ref={toast} className="w-25" position="top-center"></Toast>
			<ViewReport
				handleExportExcel={handleExportExcel}
				get_data={tableFetchData}
				columns={columnsPadrao}
				data={cargas}
				itensPerPage={itensPerPage}
				setItensPerPage={setItensPerPage}
				totalRegisters={totalRegisters}
				modalShowExcel={modalShowExcel}
				setModalShowExcel={setModalShowExcel}
				resetView={resetView}
			/>
		</>
	);
};

export default RelatorioReports;
