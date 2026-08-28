import React, {
	useCallback,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import ViewReport from "./components/view";
import { getColumns } from "./components/columns";
import useLoadingScreen from "../../Components/LoadingScreen";
import factoryReducerCargas from "../../../hooks/storageCargas/factoryReducerCargas";
import ServicePPA from "src/services/PPA/ServicePPA";
import { Toast } from "primereact/toast";
import { STORAGE_COLUMNS_REPORTS_BLOQUEIO } from "./constants";

const HistoricoBloqueiosMotoristas = () => {
	const defaultCargas = {
		page: 1,
		total_pages: 1,
		results: [],
	};
	const cargasReducer = useCallback(factoryReducerCargas(defaultCargas), []);
	const toast = useRef(null);
	const [cargas, dispatchCargas] = useReducer(cargasReducer, defaultCargas);
	const [, setFiltroAtual] = useState(null);
	const [modalShowExcel, setModalShowExcel] = useState(false);
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [itensPerPage, setItensPerPage] = useState(10);
	const [totalRegisters, setTotalRegisters] = useState(0);
	const [lastOptions, setLastOptions] = useState({});

	function resetView() {
		localStorage.removeItem(STORAGE_COLUMNS_REPORTS_BLOQUEIO);
		localStorage.removeItem("undefined"); // limpa bug antigo
		location.reload();
	}

	const tableFetchData = useCallback(
		async function (options) {
			setLoading(true);
			setLastOptions(options);

			const { column, direction } = options.orderBy ?? {};
			const { filters = {}, orderBy, page = 1 } = options;
			setFiltroAtual({ filters, orderBy, page });

			try {
				const { data } = await ServicePPA.searchBlockedDriversHistory({
					...filters,
					page,
					limit: itensPerPage,
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
					detail:
						"Não foi possível carregar o histórico de bloqueios por motorista.",
					life: 4000,
				});
			} finally {
				setLoading(false);
			}
		},
		[dispatchCargas, itensPerPage]
	);

	const columnsResult = getColumns();
	const columnsPadrao = columnsResult.columnsRelatorio;

	async function handleExportExcel() {
		setLoading(true);
		const { filters, orderBy } = lastOptions;
		const options = {
			...filters,
			order_column: orderBy?.column,
			order_direction: orderBy?.direction,
		};
		const response = await ServicePPA.exportBlockedDriversHistoryXlsx(options);
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`HISTORICO-PPA-BLOQUEIOS-MOTORISTAS_${new Date().getTime()}.xlsx`
		);
		link.click();
		setModalShowExcel(false);
		setLoading(false);
	}
	useEffect(() => {
		if (modalShowExcel) handleExportExcel();
	}, [modalShowExcel]);

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
				//modalShowExcel={modalShowExcel}
				setModalShowExcel={setModalShowExcel}
				resetView={resetView}
			/>
		</>
	);
};

export default HistoricoBloqueiosMotoristas;
