import React, {
	useReducer,
	useState,
	useEffect,
	useCallback,
	useRef,
} from "react";
import View from "../ViewsVisualizacao";
import ServiceCargas from "../../../services/ServiceCargas";
import useLoadingScreen from "../../Components/LoadingScreen";
import io from "../../../services/socket";
import factoryReducerCargas from "src/hooks/storageCargas/factoryReducerCargas";
import { Toast } from "primereact/toast";
import { showToastMessage } from "src/Pages/Utils/toastMessage";

function Visualizar() {
	const [totalRegisters, setTotalRegisters] = useState(0);
	const defaultCargas = {
		page: 1,
		total_pages: 1,
		results: [],
	};
	const cargasReducer = useCallback(factoryReducerCargas(defaultCargas), []);
	const [cargas, dispatchCargas] = useReducer(cargasReducer, defaultCargas);
	const [filtroAtual, setFiltroAtual] = useState(null);
	const [LoadingComponent, setLoading] = useLoadingScreen();
	const [itensPerPage, setItensPerPage] = useState(10);
	const [modalShowExcel, setModalShowExcel] = useState(false);
	const [isCamposFilter, setCamposFilter] = useState();

	const toast = useRef(null);
	const refValueFiltroDate = useRef(null);
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

	async function handleExportExcel(
		date_execel_inicio,
		date_execel_fim,
		fk_filial
	) {
		setLoading(true);
		const { filters, orderBy } = filtroAtual;
		const options = {
			...filters,
			order_column: orderBy?.column,
			order_direction: orderBy?.direction,
			e_lote: 0,
			date_execel_inicio,
			date_execel_fim,
			fk_filial: fk_filial.split("-")[0],
		};
		const response = await ServiceCargas.exportToXlsx(options);

		if (response.status === 202) {
			const message =
				"O período entre a data de início e fim não pode ser maior que 31 dias!";
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
				`RELATORIO-CARGAS_${new Date().getTime()}.xlsx`
			);
			link.click();
			setModalShowExcel(false);
			setLoading(false);
		}
	}

	function resetView() {
		localStorage.removeItem("table-columns");
		location.reload();
	}

	const get_data = useCallback(
		async function (options) {
			setLoading(true);
			setCamposFilter(options);
			try {
				const { filters, orderBy, page, countGetRota } = options;
				setFiltroAtual({ filters, orderBy, page });
				if (countGetRota !== 1) {
					if (filters.busca_inicio) {
						refValueFiltroDate.current = {
							busca_inicio: filters.busca_inicio,
							busca_fim: filters.busca_fim,
						};
					}
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
				}
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
		[itensPerPage, setTotalRegisters]
	);

	return (
		<>
			<Toast ref={toast} className="w-25" position="top-center"></Toast>
			<View
				handleExportExcel={handleExportExcel}
				get_data={get_data}
				values={cargas}
				LoadingComponent={LoadingComponent}
				itensPerPage={itensPerPage}
				setItensPerPage={setItensPerPage}
				resetView={resetView}
				totalRegisters={totalRegisters}
				tituloPag="Listagem de Cargas"
				modalShowExcel={modalShowExcel}
				setModalShowExcel={setModalShowExcel}
				isCamposFilter={isCamposFilter}
				refValueFiltroDate={refValueFiltroDate}
				showbuttonfilterDate={true}
			/>
		</>
	);
}

export default Visualizar;
