import React, { useCallback, useEffect, useReducer, useState } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
import NavbarNavigator from "../../Components/NavbarNavigator";
import ViewMonitoramento from "./view";
import ServiceCargas from "src/services/ServiceCargas";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { Button } from "react-bootstrap";
import factoryReducerCargas from "../../../hooks/storageCargas/factoryReducerCargas";

import io from "../../../services/socket";

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

	async function repopularVisao() {
		if (cargas.results.length <= 4) {
			tableFetchData(lastOptions);
		}
	}

	async function aprovarVeiculo(carga) {
		await ServiceCargas.update({ ...carga, fk_situacao: 3 });
		await swal("Aprovado");
		repopularVisao();
		dispatchCargas({ type: "DELETE_CARGA", payload: carga });
	}

	async function reprovarVeiculo(carga) {
		await ServiceCargas.update({ ...carga, fk_situacao: 1, placa_veiculo: "" });
		await swal("Reprovado");
		repopularVisao();
		dispatchCargas({ type: "DELETE_CARGA", payload: carga });
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
			static_column: true,
			selector: (row) => (
				<Link target="_blank" to={`/cargas/manual/${row.id}`}>
					↗
				</Link>
			),
		},
		{
			name: "Aprovar",
			description: "Aprovar",
			static_column: true,
			selector: (row) => (
				<Button variant="" onClick={() => aprovarVeiculo(row)}>
					👍
				</Button>
			),
		},
		{
			name: "Reprovar",
			description: "Reprovar",
			static_column: true,
			selector: (row) => (
				<Button variant="" onClick={() => reprovarVeiculo(row)}>
					👎
				</Button>
			),
		},
	];

	useEffect(() => {
		const actionCargasUpdate = (payload) => {
			if (payload.fk_situacao !== 2) {
				dispatchCargas({ type: "DELETE_CARGA", payload });
			} else {
				dispatchCargas({ type: "UPDATE_OR_ADD_CARGA", payload });
			}
		};
		const actionCargasDelete = (payload) => {
			dispatchCargas({ type: "DELETE_CARGA", payload });
		};
		io.on("@carga-update", actionCargasUpdate);
		io.on("@carga-delete", actionCargasDelete);

		return () => {
			io.off("@carga-update", actionCargasUpdate);
			io.off("@carga-delete", actionCargasDelete);
		};
	}, [io]);

	const tableFetchData = useCallback(
		async function (options) {
			setLoading(true);
			if (options !== lastOptions) {
				setLastOptions(options);
			}

			const { column, direction } = options.orderBy ?? {};
			const { data } = await ServiceCargas.search({
				...options.filters,
				page: options.page,
				fk_situacao: 2,
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
			/>
		</>
	);
}

export default RotasPendentes;
