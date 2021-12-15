import React, { useCallback } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
import NavbarNavigator from "../../Components/NavbarNavigator";
import ViewRotasPendentes from "./view";
import ServiceCargas from "src/services/ServiceCargas";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { Button } from "react-bootstrap";

function RotasPendentes() {
	const [LoadingScreen, setLoading] = useLoadingScreen();

	async function subirStatus(carga) {
		await ServiceCargas.update({ ...carga, fk_situacao: 3 });
		await swal("Aprovado");
	}

	async function limparPlaca(carga) {
		await ServiceCargas.update({ ...carga, fk_situacao: 1, placa_veiculo: "" });
		await swal("Reprovado");
	}

	const columns = [
		{
			name: "id",
			description: "Codigo da carga",
			selector: (row) => row.id,
		},
		{
			name: "placa_veiculo",
			description: "Placa veículo",
			selector: (row) => row.placa_veiculo,
		},
		{
			name: "origem_carga",
			description: "Origem",
			selector: (row) => row.origem_carga,
		},
		{
			name: "destino_carga",
			description: "Destino",
			selector: (row) => row.destino_carga,
		},
		{
			name: "Detalhes carga",
			description: "Detalhes carga",
			selector: (row) => (
				<Link target="_blank" to={`/cargas/manual/${row.id}`}>
					↗
				</Link>
			),
		},
		{
			name: "Aprovar",
			description: "Aprovar",
			selector: (row) => (
				<Button variant="" onClick={() => subirStatus(row)}>
					👍
				</Button>
			),
		},
		{
			name: "Reprovar",
			description: "Reprovar",
			selector: (row) => (
				<Button variant="" onClick={() => limparPlaca(row)}>
					👎
				</Button>
			),
		},
	];

	const tableFetchData = useCallback(
		async function (options) {
			setLoading(true);
			const { column, direction } = options.orderBy ?? {};
			const { data } = await ServiceCargas.search({
				...options.filters,
				page: options.page,
				fk_situacao: 2,
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
			<NavbarNavigator />
			<ViewRotasPendentes get_data={tableFetchData} columns={columns} />
		</>
	);
}

export default RotasPendentes;
