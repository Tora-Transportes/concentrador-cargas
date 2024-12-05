import React, { useCallback, useReducer, useRef, useState } from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import useLoadingScreen from "../../Components/LoadingScreen";
import ViewNotificacoes from "./components/view";
import factoryReducerCargas from "../../../hooks/storageCargas/factoryReducerCargas";
import ServiceGMNotificacoes from "../../../services/GestaoMultas/ServiceNotificacoes";
import { Toast } from "primereact/toast";
import { possuiPermissaoGestaoMultas } from "src/Pages/Utils/validationPermissionUser";

const Notificacoes = () => {
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

	function resetView() {
		localStorage.removeItem("table-columns");
		location.reload();
	}

	const tableFetchData = useCallback(
		async function (options) {
			const possui = await possuiPermissaoGestaoMultas("Permissão N1");
			if (possui) {
				setLoading(true);
				try {
					if (options !== lastOptions) {
						setLastOptions(options);
					}
					const { column, direction } = options.orderBy ?? {};
					const { data } = await ServiceGMNotificacoes.list({
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
			}
		},
		[setLoading, dispatchCargas]
	);

	return (
		<div>
			<Menusuperior />
			<LoadingScreen />
			<Toast ref={toast} className="w-25" position="top-center"></Toast>
			<ViewNotificacoes
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

export default Notificacoes;
