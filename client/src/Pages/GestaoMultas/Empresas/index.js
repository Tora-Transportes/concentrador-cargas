import React, { useCallback, useReducer, useRef, useState } from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import useLoadingScreen from "../../Components/LoadingScreen";
import ViewEmpresas from "./components/view";
import factoryReducerCargas from "../../../hooks/storageCargas/factoryReducerCargas";
import ServiceEmpresas from "../../../services/GestaoMultas/ServiceEmpresas";
import { Toast } from "primereact/toast";

const Empresas = () => {
	const defaultCargas = {
		page: 1,
		total_pages: 1,
		results: [],
	};
	const cargasReducer = useCallback(factoryReducerCargas(defaultCargas), []);
	const toast = useRef(null);
	const [cargas, dispatchCargas] = useReducer(cargasReducer, defaultCargas);
	//const [filtroAtual, setFiltroAtual] = useState(null);
	const [modalShowExcel, setModalShowExcel] = useState(false);
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [itensPerPage, setItensPerPage] = useState(10);
	const [totalRegisters, setTotalRegisters] = useState(0);
	const [lastOptions, setLastOptions] = useState({});

	function resetView() {
		localStorage.removeItem("table-columns");
		location.reload();
	}

	const tableFetchData = useCallback(
		async function (options) {
			setLoading(true);
			try {
				if (options !== lastOptions) {
					setLastOptions(options);
				}
				const { column, direction } = options.orderBy ?? {};
				//const { filters, orderBy, page } = options;
				//setFiltroAtual({ filters, orderBy, page });

				const { data } = await ServiceEmpresas.list({
					...options.filters,
					page: options.page,
					order_column: column,
					order_direction: direction,
				});
				setLoading(false);
				setTotalRegisters(data.total_registers);
				dispatchCargas({
					type: "SET",
					payload: { ...data, current_page: data.page },
				});
			} catch (error) {
				setLoading(false);
			}
		},
		[setLoading, dispatchCargas]
	);

	return (
		<div>
			<Menusuperior />
			<LoadingScreen />
			<Toast ref={toast} className="w-25" position="top-center"></Toast>
			<ViewEmpresas
				get_data={tableFetchData}
				data={cargas}
				itensPerPage={itensPerPage}
				setItensPerPage={setItensPerPage}
				totalRegisters={totalRegisters}
				modalShowExcel={modalShowExcel}
				setModalShowExcel={setModalShowExcel}
				resetView={resetView}
			/>
		</div>
	);
};

export default Empresas;
