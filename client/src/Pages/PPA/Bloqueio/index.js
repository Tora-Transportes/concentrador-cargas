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
import { STORAGE_COLUMNS_BLOCKADE } from "./constants";

const RelatorioBlockedDrivers = () => {
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

	const columnsResult = getColumns();
	const columnsPadrao = columnsResult.columnsRelatorio;

	function resetView() {
		localStorage.removeItem(STORAGE_COLUMNS_BLOCKADE);
		localStorage.removeItem("undefined"); // limpa bug antigo
		location.reload();
	}

	const tableFetchData = useCallback(
		async function (options) {
			if (options.countGetRota == 0 || options.countGetRota > 1) {
				setLoading(true);
				if (options !== lastOptions) {
					setLastOptions(options);
				}
				const { column, direction } = options.orderBy ?? {};
				const { filters, orderBy, page } = options;
				setFiltroAtual({ filters, orderBy, page });
				const { data } = await ServicePPA.searchBlockedDrivers({
					...options.filters,
					page: options.page,
					order_column: column,
					order_direction: direction,
				});
				setLoading(false);
				setTotalRegisters(data.data.total_registers);
				dispatchCargas({
					type: "SET",
					payload: { ...data.data, current_page: data.data.page },
				});
			}
		},
		[dispatchCargas]
	);

	async function handleExportExcel() {
		setLoading(true);
		const { filters, orderBy } = lastOptions;
		const options = {
			...filters,
			order_column: orderBy?.column,
			order_direction: orderBy?.direction,
		};
		const response = await ServicePPA.exportToBlockadeDriversXlsx(options);
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`RELATORIO-PPA-MOTORISTAS_PARA_BLOQUEIO_${new Date().getTime()}.xlsx`
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
				handleExportExcel={() => {}}
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

export default RelatorioBlockedDrivers;
