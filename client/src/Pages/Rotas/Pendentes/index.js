import React, { useCallback } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
import ViewRotasPendentes from "./view";
import ServiceRotas from "../../../services/ServiceRotas";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";

function RotasPendentes() {
	const [LoadingScreen, setLoading] = useLoadingScreen();

	const columns = [
		{
			name: "id",
			description: "Identificador",
			selector: (row) => row.id,
			Filter: () => null,
		},
		{
			name: "cidade_origem",
			description: "Cidade de Origem",
			selector: (row) => row.cidade_origem,
		},
		{
			name: "estado_origem",
			description: "Estado de Origem",
			selector: (row) => row.estado_origem,
		},
		{
			name: "cidade_destino",
			description: "Cidade de Destino",
			selector: (row) => row.cidade_destino,
		},
		{
			name: "estado_destino",
			description: "Estado de Destino",
			selector: (row) => row.estado_destino,
		},
	];

	const tableFetchData = useCallback(
		async function (options) {
			setLoading(true);
			const { column, direction } = options.orderBy ?? {};
			const { data } = await ServiceRotas.search({
				...options.filters,
				order_column: column,
				order_direction: direction,
			});
			setLoading(false);
			return {
				data: data.data.results,
				total_pages: data.data.total_pages,
				current_page: data.data.page,
			};
		},
		[setLoading]
	);

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<ViewRotasPendentes get_data={tableFetchData} columns={columns} />
		</>
	);
}

export default RotasPendentes;
