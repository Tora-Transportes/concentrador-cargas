import React, {
	useCallback,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import ViewReport from "./components/view";
import { getColumns } from "./components/columns";
import useLoadingScreen from "../../Components/LoadingScreen";
import factoryReducerCargas from "../../../hooks/storageCargas/factoryReducerCargas";
import ServicePPA from "src/services/PPA/ServicePPA";
import { Toast } from "primereact/toast";
import swal from "sweetalert";
import { getClaims } from "../../../MicrosoftAuthentication";
import { formatDateAndHourForColumns } from "../../Utils/date";
import { STORAGE_COLUMNS_BLOCKADE } from "./constants";

const RelatorioBlockedDrivers = () => {
	const defaultCargas = {
		page: 1,
		total_pages: 1,
		results: [],
	};
	const cargasReducer = useCallback(factoryReducerCargas(defaultCargas), []);
	const toast = useRef(null);
	const [cargas, dispatchCargas] = useReducer(cargasReducer, defaultCargas);
	const [, setFiltroAtual] = useState(null);
	const [modalShowExcel, setModalShowExcel] = useState(false);
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [itensPerPage, setItensPerPage] = useState(10);
	const [totalRegisters, setTotalRegisters] = useState(0);
	const [lastOptions, setLastOptions] = useState({});

	function resetView() {
		localStorage.removeItem(STORAGE_COLUMNS_BLOCKADE);
		localStorage.removeItem("undefined"); // limpa bug antigo
		location.reload();
	}

	const tableFetchData = useCallback(
		async function (options) {
			setLoading(true);
			setLastOptions(options);

			const { column, direction } = options.orderBy ?? {};
			const { filters = {}, orderBy, page = 1 } = options;
			setFiltroAtual({ filters, orderBy, page });

			try {
				const { data } = await ServicePPA.searchBlockedDrivers({
					...filters,
					page,
					order_column: column,
					order_direction: direction,
				});

				const result = data?.data ?? {};
				setTotalRegisters(result.total_registers ?? 0);
				dispatchCargas({
					type: "SET",
					payload: {
						...result,
						current_page: result.page ?? page,
					},
				});
			} catch (error) {
				console.error("Erro ao consultar dados do PPA:", error);
				toast.current?.show({
					severity: "error",
					summary: "Erro ao carregar dados",
					detail: "Não foi possível carregar os motoristas para bloqueio.",
					life: 4000,
				});
			} finally {
				setLoading(false);
			}
		},
		[dispatchCargas]
	);

	async function handleRemovePontuacao(row) {
		const motorista = String(row?.motorista ?? "").toUpperCase();
		const cpf = String(row?.cpf ?? "").trim();
		const periodoInicial = row?.periodo_inicial;
		const periodoFinal = row?.periodo_final;
		const totalPontos = Number(row?.total_pontos || 0).toLocaleString("pt-BR");

		const periodoInicialFormatado = formatDateAndHourForColumns(periodoInicial);
		const periodoFinalFormatado = formatDateAndHourForColumns(periodoFinal);

		const confirmacao = await swal(
			"Remover pontuação?",
			`Essa opção irá remover ${totalPontos} ponto(s) computado(s) para ${motorista}, somente no período de ${periodoInicialFormatado} até ${periodoFinalFormatado}, além de remover este registro de bloqueio. Deseja continuar?`,
			"warning",
			{
				buttons: [
					"Cancelar",
					{
						text: "Remover pontuação",
						value: true,
					},
				],
				dangerMode: true,
			}
		);

		if (!confirmacao) return;

		setLoading(true);

		try {
			const concentradorUserId = getClaims()?.oid;

			if (!concentradorUserId) {
				throw new Error(
					"Não foi possível identificar o usuário logado no Concentrador."
				);
			}

			await ServicePPA.removeBlockedDriverPoints({
				cpf,
				periodo_inicial: periodoInicial,
				periodo_final: periodoFinal,
				concentrador_user_id: String(concentradorUserId),
			});

			/*
			 * Atualiza a tabela mantendo filtros, ordenação e página atuais.
			 * Se a linha removida era a única da página e não estamos na primeira,
			 * volta uma página para não deixar o usuário em uma página vazia.
			 */
			const currentPage = Number(lastOptions?.page) || 1;
			const nextPage =
				(cargas.results?.length || 0) === 1 && currentPage > 1
					? currentPage - 1
					: currentPage;

			await tableFetchData({
				...lastOptions,
				page: nextPage,
			});

			await swal(
				"Sucesso!",
				"A pontuação e o registro de bloqueio deste período foram removidos com sucesso.",
				"success"
			);
		} catch (error) {
			console.error("Erro ao remover pontuação do motorista:", error);

			await swal(
				"Erro!",
				error?.response?.data?.message ||
					error?.response?.data?.error ||
					error?.message ||
					"Não foi possível remover a pontuação do motorista.",
				"error"
			);
		} finally {
			setLoading(false);
		}
	}

	// IMPORTANTE: o callback deve ser passado para getColumns.
	const columnsResult = getColumns(handleRemovePontuacao);
	const columnsPadrao = columnsResult.columnsRelatorio;

	async function handleExportExcel() {
		setLoading(true);
		const { filters, orderBy } = lastOptions;
		const options = {
			...filters,
			order_column: orderBy?.column,
			order_direction: orderBy?.direction,
		};
		const response = await ServicePPA.exportToBlockadeDriversXlsx(options);
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`RELATORIO-PPA-MOTORISTAS_PARA_BLOQUEIO_${new Date().getTime()}.xlsx`
		);
		link.click();
		setModalShowExcel(false);
		setLoading(false);
	}

	useEffect(() => {
		if (modalShowExcel) handleExportExcel();
	}, [modalShowExcel]);

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Toast ref={toast} className="w-25" position="top-center"></Toast>
			<ViewReport
				handleExportExcel={handleExportExcel}
				get_data={tableFetchData}
				columns={columnsPadrao}
				data={cargas}
				itensPerPage={itensPerPage}
				setItensPerPage={setItensPerPage}
				totalRegisters={totalRegisters}
				//modalShowExcel={modalShowExcel}
				setModalShowExcel={setModalShowExcel}
				resetView={resetView}
			/>
		</>
	);
};

export default RelatorioBlockedDrivers;
