import React, { useCallback, useReducer, useRef, useState } from "react";
import Menusuperior from "../../../Components/MenuSuperior/menusuperior";
import useLoadingScreen from "../../../Components/LoadingScreen";
import ViewRelatorioAprovacoes from "./components/view";
import { getColumns } from "./components/columns";
import factoryReducerCargas from "../../../../hooks/storageCargas/factoryReducerCargas";
import ServicePPOGruposMotoristas from "src/services/PPO/ServicePPOGruposMotoristas";
import { Toast } from "primereact/toast";
import { showToastMessage } from "src/Pages/Utils/toastMessage";

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
	const [filtroAtual, setFiltroAtual] = useState(null);

	const columnsResult = getColumns();
	const columnsPadrao = columnsResult.columnsRelatorio;

	function resetView() {
		localStorage.removeItem("table-columns");
		location.reload();
	}

	async function handleExportExcel(date_excel_inicio, date_excel_fim) {
		setLoading(true);
		const { filters, orderBy } = filtroAtual;
		const options = {
			...filters,
			order_column: orderBy?.column,
			order_direction: orderBy?.direction,
			date_excel_inicio,
			date_excel_fim,
		};
		const response = await ServicePPOGruposMotoristas.exportRelatorioToXlsx(
			options
		);

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
				`RELATORIO-RASTREABILIDADE-PPO-${new Date().getTime()}.xlsx`
			);
			link.click();
			setModalShowExcel(false);
			setLoading(false);
		}
	}

	const tableFetchData = useCallback(
		async function (options) {
			setLoading(true);
			try {
				if (options !== lastOptions) {
					setLastOptions(options);
				}
				const { column, direction } = options.orderBy ?? {};
				const { filters, orderBy, page } = options;
				setFiltroAtual({ filters, orderBy, page });

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
		</div>
	);
};

export default MovimentacoesMotoristaGrupo;
