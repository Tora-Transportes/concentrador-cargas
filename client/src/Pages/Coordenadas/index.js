import React, { useCallback, useEffect, useReducer, useState } from "react";
import useLoadingScreen from "../Components/LoadingScreen";
import NavbarNavigator from "../Components/NavbarNavigator";
import ViewMonitoramento from "./view";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";
import factoryReducerCargas from "../../hooks/storageCargas/factoryReducerCargas";

import { Button, Form } from "react-bootstrap";
import { SiGooglemaps } from "react-icons/si";
import useLocalStorage from "../Components/useLocalstorage";

import DateUtils from "../Utils/date";
import CollapseHint from "../Components/CollapseHint";
import swal from "sweetalert";
import ResponsavelCadastroSelect from "../Components/ResponsavelCadastroSelect";

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

	async function perguntarEAlterarDadosCoordenada(placa) {
		if (!placa) {
			swal("Placa vazia");
			return;
		}

		const observacao = await swal(
			"Alterar observação",
			"Digite a observação",
			"warning",
			{
				dangerMode: true,
				buttons: ["Cancelar", true],
				content: "input",
			}
		);
		if (!observacao) {
			swal("Operação cancelada");
			return;
		}

		await ServiceCoordenadas.update({ observacao, placa });
		swal("Sucesso", "Observação vinculada", "success");
		for (let i = 0; i < cargas.results.length; i++) {
			if (String(cargas.results[i].placa) === placa) {
				cargas.results[i].observacao = observacao.toUpperCase();
				break;
			}
		}
		dispatchCargas({
			type: "SET",
			payload: {
				...cargas,
			},
		});
	}

	async function handleChangeResponsavelPlaca(linha, target) {
		const responsavel = target.value;
		const certeza = await swal(
			"Alterar Responsável placa",
			"Tem certeza ?",
			"warning",
			{
				dangerMode: true,
				buttons: ["Cancelar", true],
			}
		);
		if (!certeza) {
			target.value = linha.responsavel_placa;
			swal("Operação cancelada");
			return;
		}

		try {
			const resultadoAtualizacao = (
				await ServiceCoordenadas.update({
					responsavel_placa: responsavel,
					placa: linha.placa,
				})
			).data;

			for (let i = 0; i < cargas.results.length; i++) {
				if (cargas.results[i].placa === linha.placa) {
					Object.assign(cargas.results[i], resultadoAtualizacao);
					break;
				}
			}
			swal("Sucesso", "Usuário vinculado", "success");
			dispatchCargas({
				type: "SET",
				payload: { ...cargas },
			});
		} catch (error) {
			target.value = linha.responsavel_placa;
		}
	}

	async function handleChangeDataJanela(linha, target) {
		const dataJanela = target.value ? target.value + ":00.000Z" : null;
		const certeza = await swal(
			"Alterar Data janela",
			"Tem certeza ?",
			"warning",
			{
				dangerMode: true,
				buttons: ["Cancelar", true],
			}
		);
		if (!certeza) {
			target.value = linha.data_janela
				? String(linha.data_janela).split(".")[0]
				: "";
			swal("Operação cancelada");
			return;
		}

		try {
			const resultadoAtualizacao = (
				await ServiceCoordenadas.update({
					data_janela: dataJanela,
					placa: linha.placa,
				})
			).data;

			for (let i = 0; i < cargas.results.length; i++) {
				if (cargas.results[i].placa === linha.placa) {
					Object.assign(cargas.results[i], resultadoAtualizacao);
					break;
				}
			}
			swal("Sucesso", "Data Janela editada", "success");
			dispatchCargas({
				type: "SET",
				payload: { ...cargas },
			});
		} catch (error) {
			target.value = linha.data_janela
				? String(linha.data_janela).split(".")[0]
				: "";
		}
	}

	const columns = [
		{
			name: "placa",
			description: "Placa",
			selector: (row) => row.placa,
		},
		{
			name: "tipo_cavalo",
			description: "Tipo cavalo",
			selector: (row) => row.tipo_cavalo,
		},
		{
			name: "tipo_carreta",
			description: "Tipo carreta",
			selector: (row) => row.tipo_carreta,
		},
		{
			name: "telefone_motorista",
			description: "Telefone Motorista",
			selector: (row) => {
				if (!row.telefone_motorista) return "";

				const telefone = "5531" + row.telefone_motorista?.replace(/\D/g, "");
				return (
					<a
						className="text-decoration-none"
						href={`https://web.whatsapp.com/send/?phone=${telefone}&text=Olá ${row.nome_motorista}`}
						rel="nofollow noreferrer"
						target="_blank"
					>
						{row.telefone_motorista}
					</a>
				);
			},
		},
		{
			name: "setor_veiculo",
			description: "Setor Veículo",
			selector: (row) => row.setor_veiculo,
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
			description: "Distância veículo até destino",
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
			description: "Previsão Calculada",
			selector: (row) => {
				if (!row.tempo_ate_destino) {
					return "";
				}
				return DateUtils.convertDateToReadableTime(
					Number(row.tempo_ate_destino)
				);
			},
			Filter: () => null,
		},
		{
			name: "data_previsao_chegada",
			description: "Previsão Real",
			selector: (row) => {
				if (!row.data_previsao_chegada) {
					return "";
				}
				return row.data_previsao_chegada
					.split("T")[0]
					.split("-")
					.reverse()
					.join("-");
			},
			Filter: () => null,
		},
		{
			name: "status_prazo",
			description: "Status prazo",
			selector: (row) => {
				if (!row.data_previsao_chegada) {
					return "NC";
				}
				const currentDate = new Date().toISOString().split("T")[0];
				return currentDate <= row.data_previsao_chegada.split("T")[0] ? (
					<span className="text-success">Dentro do prazo</span>
				) : (
					<span className="text-danger">Fora do prazo</span>
				);
			},
			Filter: () => null,
			static_column: true,
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
			name: "data_janela",
			description: "Data Janela",
			selector: (row) => (
				<Form.Control
					value={row.data_janela ? String(row.data_janela).split(".")[0] : ""}
					type="datetime-local"
					onChange={({ target }) => handleChangeDataJanela(row, target)}
				/>
			),
		},
		{
			name: "observacao",
			description: "Observação Usuario",
			selector: (row) =>
				row.observacao ? (
					<CollapseHint
						text={row.observacao}
						onClick={() => {
							perguntarEAlterarDadosCoordenada(row.placa);
						}}
					/>
				) : (
					<Button
						variant="outline-secondary"
						onClick={() => {
							perguntarEAlterarDadosCoordenada(row.placa);
						}}
					>
						Adicionar
					</Button>
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
			name: "nome_motorista",
			description: "Motorista",
			selector: (row) => row.nome_motorista,
		},
		{
			name: "responsavel_placa_nome",
			description: "RP Nome",
			selector: (row) => (
				<ResponsavelCadastroSelect
					onChange={({ target }) => handleChangeResponsavelPlaca(row, target)}
					value={row.responsavel_placa || ""}
					key_value="oid"
				/>
			),
			Filter: (props) => <ResponsavelCadastroSelect {...props} />,
		},
		{
			name: "responsavel_placa_email",
			description: "RP Email",
			selector: (row) => row.responsavel_placa_email,
			static_column: true,
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
