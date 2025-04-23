import React, { useCallback, useReducer, useRef, useState } from "react";
import Menusuperior from "../../../Components/MenuSuperior/menusuperior";
import useLoadingScreen from "../../../Components/LoadingScreen";
import ViewRelatorioAprovacoes from "./components/view";
import { getColumns } from "./components/columns";
import factoryReducerCargas from "../../../../hooks/storageCargas/factoryReducerCargas";
import ServicePPOGruposMotoristas from "src/services/PPO/ServicePPOGruposMotoristas";
import { Toast } from "primereact/toast";

const MovimentacoesMotoristaGrupo = () => {
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
				const { data } =
					await ServicePPOGruposMotoristas.relatorioHistoricoMovimentacoes({
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
			} catch (error) {
				setLoading(false);
			}
		},
		[setLoading, dispatchCargas]
	);

	return (
		<div>
			<LoadingScreen />
			<Menusuperior />
			<Toast ref={toast} className="w-25" position="top-center"></Toast>
			<ViewRelatorioAprovacoes
				handleExportExcel={() => {}}
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
		</div>
	);
};

export default MovimentacoesMotoristaGrupo;
