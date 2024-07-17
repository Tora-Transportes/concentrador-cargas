import React, { useCallback, useEffect, useReducer, useState } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
// import NavbarNavigator from "../../Components/NavbarNavigator";
import ViewMonitoramento from "./view";
import ServiceCargas from "src/services/ServiceCargas";
import swal from "sweetalert";
import factoryReducerCargas from "../../../hooks/storageCargas/factoryReducerCargas";

import io from "../../../services/socket";
import { getColumns } from "./columnsTable";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { useParams } from "react-router-dom";

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
	const [itensPerPage, setItensPerPage] = useState(10);
	const [totalRegisters, setTotalRegisters] = useState(0);
	const { id } = useParams();
	const statusCargaId = String(id) === "padrao" ? 0 : 1;

	async function repopularVisao() {
		if (cargas.results.length <= 4) {
			tableFetchData(lastOptions);
		}
	}

	async function aprovarVeiculo(carga) {
		const observacaoGr = await swal(`Observação:`, {
			content: "input",
			buttons: ["Cancelar", true],
		});
		if (!observacaoGr) {
			await swal("Nenhuma alteração aplicada.");
		} else {
			await ServiceCargas.update({
				...carga,
				fk_situacao: 3,
				observacao_gr: observacaoGr,
			});
			await swal("Aprovado!");
			repopularVisao();
			dispatchCargas({ type: "DELETE_CARGA", payload: carga });
		}
	}

	async function reprovarVeiculo(carga) {
		const observacaoGr = await swal(`Observação`, {
			content: "input",
			buttons: ["Cancelar", true],
		});
		if (!observacaoGr) {
			await swal("Nenhuma alteração aplicada");
		} else {
			await ServiceCargas.update({
				...carga,
				fk_situacao: 4,
				observacao_gr: observacaoGr,
			});
			await swal("Reprovado");
			repopularVisao();
			dispatchCargas({ type: "DELETE_CARGA", payload: carga });
		}
	}

	const columnsResult = getColumns(aprovarVeiculo, reprovarVeiculo);
	const columnsPadrao = columnsResult.columsMonitoramento;
	const columnsCsn = columnsResult.columnMonitoramentoCsn;

	useEffect(() => {
		const actionCargasCreate = (payload) => {
			if (payload.fk_situacao === 2) {
				dispatchCargas({ type: "UPDATE_OR_ADD_CARGA", payload });
			}
		};
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
		io.on("@carga-create", actionCargasCreate);
		io.on("@carga-update", actionCargasUpdate);
		io.on("@carga-delete", actionCargasDelete);

		return () => {
			io.off("@carga-create", actionCargasCreate);
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
			const buscarPorIndex = id.split("-")[1];
			if (buscarPorIndex) options.filters = { id: buscarPorIndex };
			const { data } = await ServiceCargas.search({
				...options.filters,
				page: options.page,
				fk_situacao: 2,
				order_column: column,
				order_direction: direction,
				carga_csn: statusCargaId,
				exclude_cargas_app: 1,
			});
			setLoading(false);
			setTotalRegisters(data.data.total_registers);
			dispatchCargas({
				type: "SET",
				payload: { ...data.data, current_page: data.data.page },
			});
		},
		[setLoading, dispatchCargas]
	);

	const tipoColumns = String(id) === "padrao" ? columnsPadrao : columnsCsn;

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<ViewMonitoramento
				get_data={tableFetchData}
				columns={tipoColumns}
				data={cargas}
				itensPerPage={itensPerPage}
				setItensPerPage={setItensPerPage}
				totalRegisters={totalRegisters}
				tipoCarga={String(id)}
			/>
		</>
	);
}

export default RotasPendentes;
