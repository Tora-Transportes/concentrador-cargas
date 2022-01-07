import React, { useCallback, useReducer, useState } from "react";
import useLoadingScreen from "../Components/LoadingScreen";
import NavbarNavigator from "../Components/NavbarNavigator";
import ViewMonitoramento from "./view";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";
import factoryReducerCargas from "../../hooks/storageCargas/factoryReducerCargas";

function RotasPendentes() {
	const defaultCargas = {
		page: 1,
		total_pages: 1,
		results: [],
	};
	const cargasReducer = useCallback(factoryReducerCargas(defaultCargas), []);
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [lastOptions, setLastOptions] = useState({});
	const [cargas, dispatchCargas] = useReducer(cargasReducer, defaultCargas);

	const columns = [
		{
			name: "mct",
			description: "MCT",
			selector: (row) => row.mct,
		},
		{
			name: "placa",
			description: "Placa",
			selector: (row) => row.placa,
		},
		{
			name: "cidade_atual",
			description: "Posição Atual",
			selector: (row) => (
				<a
					href={`https://www.google.com/maps/search/${String(row.lat).replace(
						",",
						"."
					)},+${String(row.lon).replace(",", ".")}`}
					target="_blank"
					rel="noopener noreferrer"
					className="text-decoration-none"
				>
					{row.cidade_atual}
				</a>
			),
		},
		{
			name: "ultima_viagem_origem",
			description: "Origem ultima viagem",
			selector: (row) => row.ultima_viagem_origem,
		},
		{
			name: "ultima_viagem_destino",
			description: "Destino ultima viagem",
			selector: (row) => row.ultima_viagem_destino,
		},
	];

	async function handleExportExcel() {
		setLoading(true);
		const { filters, orderBy } = lastOptions;
		const options = {
			...filters,
			order_column: orderBy?.column,
			order_direction: orderBy?.direction,
		};
		const response = await ServiceCoordenadas.exportToXlsx(options);
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`RELATORIO-COORDENADAS_${new Date().getTime()}.xlsx`
		);
		link.click();
		setLoading(false);
	}

	const tableFetchData = useCallback(
		async function (options) {
			setLoading(true);
			if (options !== lastOptions) {
				setLastOptions(options);
			}

			const { column, direction } = options.orderBy ?? {};
			const { data } = await ServiceCoordenadas.search({
				...options.filters,
				page: options?.page || 1,
				order_column: column,
				order_direction: direction,
			});

			setLoading(false);
			dispatchCargas({
				type: "SET",
				payload: { ...data.data, current_page: data.data.page },
			});
		},
		[setLoading, dispatchCargas]
	);

	return (
		<>
			<LoadingScreen />
			<NavbarNavigator />
			<ViewMonitoramento
				get_data={tableFetchData}
				columns={columns}
				data={cargas}
				handleExportExcel={handleExportExcel}
			/>
		</>
	);
}

export default RotasPendentes;
