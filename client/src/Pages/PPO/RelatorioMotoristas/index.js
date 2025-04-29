import React, {
	useCallback,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import ViewRelatorioMotorista from "./components/view";
import { getColumns } from "./components/columns";
import useLoadingScreen from "../../Components/LoadingScreen";
import factoryReducerCargas from "../../../hooks/storageCargas/factoryReducerCargas";
import ServicePPO from "src/services/PPO/ServicePPO";
import { Toast } from "primereact/toast";
import { showToastMessage } from "src/Pages/Utils/toastMessage";
import ServicePPOGrupos from "src/services/PPO/ServicePPOGrupos";
import {
	permissoesVisualizacaoPPO,
	getPermissoesVisualizacaoPPO,
} from "src/Pages/Utils/validationPermissionUser";

const RelatorioMotoristas = () => {
	const defaultCargas = {
		page: 1,
		total_pages: 1,
		results: [],
	};
	const cargasReducer = useCallback(factoryReducerCargas(defaultCargas), []);
	const toast = useRef(null);
	const [cargas, dispatchCargas] = useReducer(cargasReducer, defaultCargas);
	const [filtroAtual, setFiltroAtual] = useState(null);
	const [modalShowExcel, setModalShowExcel] = useState(false);
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [itensPerPage, setItensPerPage] = useState(10);
	const [totalRegisters, setTotalRegisters] = useState(0);
	const [lastOptions, setLastOptions] = useState({});
	const [grupos, setGrupos] = useState([]);

	const columnsResult = getColumns(grupos, load);
	const columnsPadrao = columnsResult.columnsRelatorio;

	function resetView() {
		localStorage.removeItem("table-columns");
		location.reload();
	}

	async function handleExportExcel(date_execel_inicio, date_execel_fim) {
		setLoading(true);
		const permissoes = await getPermissoesVisualizacaoPPO();
		const { filters, orderBy } = filtroAtual;
		const options = {
			...filters,
			order_column: orderBy?.column,
			order_direction: orderBy?.direction,
			date_execel_inicio,
			date_execel_fim,
			permissoes: permissoes,
		};
		const response = await ServicePPO.exportToXlsx(options);

		if (response.status === 202) {
			const message =
				"Não foram encontrados dados com essas informações no filtro de data.";
			await showToastMessage(toast, "warn", message, 7000);
			setLoading(false);
			setModalShowExcel(true);
		} else if (response.data.byteLength < 14493) {
			const message =
				"Não foram encontrados dados com essas informações no filtro de data.";
			await showToastMessage(toast, "warn", message, 7000);
			setLoading(false);
			setModalShowExcel(true);
		} else {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute(
				"download",
				`RELATORIO-PPO_${new Date().getTime()}.xlsx`
			);
			link.click();
			setModalShowExcel(false);
			setLoading(false);
		}
	}

	async function load() {
		setLoading(true);
		try {
			const permissoes = await getPermissoesVisualizacaoPPO();
			const { column, direction } = lastOptions.orderBy ?? {};
			const { filters, orderBy, page } = lastOptions;
			setFiltroAtual({ filters, orderBy, page });
			const { data } = await ServicePPO.search({
				...lastOptions.filters,
				page: lastOptions.page,
				order_column: column,
				order_direction: direction,
				permissoes: permissoes,
			});
			setTotalRegisters(data.data.total_registers);
			dispatchCargas({
				type: "SET",
				payload: { ...data.data, current_page: data.data.page },
			});
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	}

	const tableFetchData = useCallback(
		async function (options) {
			if (options.countGetRota == 0 || options.countGetRota > 1) {
				setLoading(true);
				if (options !== lastOptions) {
					setLastOptions(options);
				}
				const permissoes = await getPermissoesVisualizacaoPPO();
				const { column, direction } = options.orderBy ?? {};
				const { filters, orderBy, page } = options;
				setFiltroAtual({ filters, orderBy, page });
				const { data } = await ServicePPO.search({
					...options.filters,
					page: options.page,
					order_column: column,
					order_direction: direction,
					permissoes: permissoes,
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

	useEffect(() => {
		async function data() {
			const values = await ServicePPOGrupos.list();
			setGrupos(values.data.data);
		}
		async function loadPermissoes() {
			await permissoesVisualizacaoPPO();
		}
		loadPermissoes();
		data();
	}, []);

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Toast ref={toast} className="w-25" position="top-center"></Toast>
			<ViewRelatorioMotorista
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
				load={load}
			/>
		</>
	);
};

export default RelatorioMotoristas;
