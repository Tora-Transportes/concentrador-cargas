import React, { useCallback, useReducer, useState, useRef } from "react";
import useLoadingScreen from "../Components/LoadingScreen";
// import NavbarNavigator from "../Components/NavbarNavigator";
import ViewMonitoramento from "./view";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";
import factoryReducerCargas from "../../hooks/storageCargas/factoryReducerCargas";
import swal from "sweetalert";
import { getColumns } from "./columnsTable";
import { Toast } from "primereact/toast";
import { showToastMessage } from "src/Pages/Utils/toastMessage";
import Menusuperior from "../Components/MenuSuperior/menusuperior";

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
	const [visibleCardCte, setVisibleCardCte] = useState(false);
	const [dataCTE, setDataCTE] = useState();
	const [modalShowExcel, setModalShowExcel] = useState(false);
	const toast = useRef(null);

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

	const showCardCTE = (rowData) => {
		setDataCTE(rowData);
		setVisibleCardCte(true);
	};

	const columns = getColumns(
		handleChangeDataJanela,
		perguntarEAlterarDadosCoordenada,
		handleChangeResponsavelPlaca,
		showCardCTE
	);

	function resetView() {
		localStorage.removeItem("coordenadas-table");
		location.reload();
	}

	async function handleExportExcel(
		date_execel_inicio,
		date_execel_fim,
		categoria_veiculo
	) {
		setLoading(true);
		const { filters, orderBy } = lastOptions;
		const options = {
			...filters,
			order_column: orderBy?.column,
			order_direction: orderBy?.direction,
			date_execel_inicio,
			date_execel_fim,
			categoria_veiculo,
		};
		const response = await ServiceCoordenadas.exportToXlsx(options);

		if (response.status === 202) {
			const message =
				"O período entre a data de início e fim não pode ser maior que 31 dias!";
			await showToastMessage(toast, "warn", message, 7000);
			setLoading(false);
			setModalShowExcel(true);
		} else if (response.data.byteLength < 14493) {
			const message =
				"Não foram encontrados dados com essas informaçoes no filtro de data.";
			await showToastMessage(toast, "warn", message, 7000);
			setLoading(false);
			setModalShowExcel(true);
		} else {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute(
				"download",
				`RELATORIO-COORDENADAS_${new Date().getTime()}.xlsx`
			);
			link.click();
			setModalShowExcel(false);
			setLoading(false);
		}
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

	return (
		<div className="class-body-coordenadas">
			<LoadingScreen />
			<Toast ref={toast} className="w-25" position="top-center"></Toast>
			{/* <NavbarNavigator /> */}
			<Menusuperior />
			<ViewMonitoramento
				get_data={tableFetchData}
				columns={columns}
				data={cargas}
				handleExportExcel={handleExportExcel}
				totalRegisters={totalRegisters}
				resetView={resetView}
				itensPerPage={itensPerPage}
				setItensPerPage={setItensPerPage}
				visibleCteCardObject={{ visibleCardCte, setVisibleCardCte }}
				dadosCTEObjet={{ dataCTE, setDataCTE }}
				modalShowExcel={modalShowExcel}
				setModalShowExcel={setModalShowExcel}
			/>
		</div>
	);
}

export default RotasPendentes;
