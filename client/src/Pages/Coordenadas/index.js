import React, { useCallback, useEffect, useReducer, useState } from "react";
import useLoadingScreen from "../Components/LoadingScreen";
import NavbarNavigator from "../Components/NavbarNavigator";
import ViewMonitoramento from "./view";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";
import factoryReducerCargas from "../../hooks/storageCargas/factoryReducerCargas";

import { Form } from "react-bootstrap";
import { SiGooglemaps } from "react-icons/si";
import useLocalStorage from "../Components/useLocalstorage";

function reducerActiveColumns(state, action) {
	const index = state.findIndex((i) => i.name === action.name);
	let before;
	switch (action.type) {
		case "ENABLE_FIELD":
			return state.map((i) =>
				i.name === action.name ? { ...i, active: true } : i
			);
		case "DISABLE_FIELD":
			return state.map((i) =>
				i.name === action.name ? { ...i, active: false } : i
			);
		case "UP_FIELD":
			if (index > 0) {
				before = state[index - 1];
				state[index - 1] = state[index];
				state[index] = before;
			}
			return [...state];
		case "DOWN_FIELD":
			if (index < state.length - 1) {
				before = state[index];
				state[index] = state[index + 1];
				state[index + 1] = before;
			}
			return [...state];
		case "ENABLE_ALL":
			return state.map((i) => ({ ...i, active: true }));
		case "DISABLE_ALL":
			return state.map((i) => ({ ...i, active: false }));
		default:
			throw new Error("Invalid action");
	}
}
function reducerToggleModal(state) {
	return !state;
}
function RotasPendentes() {
	const defaultCargas = {
		page: 1,
		total_pages: 1,
		results: [],
	};
	const cargasReducer = useCallback(factoryReducerCargas(defaultCargas), []);
	const [totalRegisters, setTotalRegisters] = useState(0);
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [lastOptions, setLastOptions] = useState({});
	const [cargas, dispatchCargas] = useReducer(cargasReducer, defaultCargas);

	const [itensPerPage, setItensPerPage] = useState(10);

	const columns = [
		{
			name: "placa",
			description: "Placa",
			selector: (row) => row.placa,
		},
		{
			name: "data_emissao_documento",
			description: "Emissão Doc. ultima viagem",
			selector: (row) =>
				row.data_emissao_documento
					?.split("T")[0]
					.split("-")
					.reverse()
					.join("-"),
			Filter: () => null,
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
		{
			name: "distancia_prevista",
			description: "Distância prevista rota",
			selector: (row) =>
				row.distancia_prevista ? `${row.distancia_prevista} KM` : "NC",
		},
		{
			name: "distancia_ate_destino",
			description: "Distância até o destino",
			selector: (row) => {
				if (!row.distancia_ate_destino) {
					return "";
				}
				return `${Number(row.distancia_ate_destino).toFixed(2)} KM`;
			},
			Filter: () => null,
		},
		{
			name: "tempo_ate_destino",
			description: "Previsão de chegada",
			selector: (row) => {
				if (!row.tempo_ate_destino) {
					return "";
				}
				const totalMinutes = Math.floor(Number(row.tempo_ate_destino) / 60);
				const hours = Math.floor(totalMinutes / 60);
				const minutes = Math.ceil(totalMinutes % 60);
				return `${hours}h ${minutes}m`;
			},
			Filter: () => null,
		},
		{
			name: "data_previsao_chegada",
			description: "Data previsão de chegada",
			selector: () => `10/01/2020`,
			Filter: () => null,
		},
		{
			name: "status_prazo",
			description: "Status prazo",
			selector: () => `Dentro do prazo`,
			Filter: () => null,
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
					{row.cidade_atual + " "}
					<SiGooglemaps />
				</a>
			),
		},
		{
			name: "categoria_veiculo",
			description: "Categoria",
			selector: (row) => {
				if (!row.categoria_veiculo) return "";
				switch (row.categoria_veiculo) {
					case "A":
						return "Agregado";
					case "F":
						return "Frota";
					case "C":
						return "Carreteiro";
					default:
						return "Não reconhecido";
				}
			},
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="A">Agregado</option>
					<option value="C">Carreteiro</option>
					<option value="F">Frota</option>
				</Form.Select>
			),
		},
		{
			name: "documento",
			description: "Documento",
			selector: (row) => row.documento,
		},
		{
			name: "tipo_documento",
			description: "Tipo Documento",
			selector: (row) => row.tipo_documento,
			Filter: (parameters) => (
				<Form.Select {...parameters}>
					<option></option>
					<option value="DVF">DVF</option>
					<option value="RPA">RPA</option>
				</Form.Select>
			),
		},
		{
			name: "mct",
			description: "MCT",
			selector: (row) => row.mct,
		},
		{
			name: "data_calculo",
			description: "Data cálculo distância",
			selector: (row) => {
				if (!row?.data_calculo) {
					return "";
				}
				const [data, time] = row.data_calculo?.split("T");
				return `${data.split("-").reverse().join("-")} às ${
					time.split(".")[0]
				}`;
			},
			Filter: () => null,
		},
	];
	const defaultStorageColumns = columns.map((i) => ({
		name: i.name,
		active: true,
		description: i.description,
	}));

	const [storage, setStorage] = useLocalStorage(
		"coordenadas-table",
		defaultStorageColumns
	);
	const [displayColumns, reducerColumns] = useReducer(
		reducerActiveColumns,
		storage === null ? defaultStorageColumns : storage
	);
	const [activeModal, handleToggleModal] = useReducer(
		reducerToggleModal,
		false
	);
	useEffect(() => {
		setStorage(displayColumns);
	}, [displayColumns]);

	function resetView() {
		localStorage.removeItem("coordenadas-table");
		location.reload();
	}

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
				limit: itensPerPage,
			});

			setLoading(false);
			setTotalRegisters(data.data.total_registers);
			dispatchCargas({
				type: "SET",
				payload: { ...data.data, current_page: data.data.page },
			});
		},
		[setLoading, dispatchCargas, itensPerPage]
	);

	const columnsToDisplay = displayColumns
		.filter((i) => i.active)
		.map((i) => i.name);

	const orderedColumns = columnsToDisplay.map((i) =>
		columns.find((j) => j.name === i)
	);

	return (
		<>
			<LoadingScreen />
			<NavbarNavigator />
			<ViewMonitoramento
				get_data={tableFetchData}
				columns={orderedColumns.filter((c) =>
					columnsToDisplay.includes(c.name)
				)}
				data={cargas}
				handleExportExcel={handleExportExcel}
				totalRegisters={totalRegisters}
				displayColumns={displayColumns}
				dispatchColumns={reducerColumns}
				activeModal={activeModal}
				handleToggleModal={handleToggleModal}
				resetView={resetView}
				itensPerPage={itensPerPage}
				setItensPerPage={setItensPerPage}
			/>
		</>
	);
}

export default RotasPendentes;
