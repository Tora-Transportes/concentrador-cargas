import React, { useState, useRef } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
import ViewHistoricoVeiculo from "./views";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";
import { showToastMessage } from "src/Pages/Utils/toastMessage";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { Toast } from "primereact/toast";

function HistoricoVeiculos() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [historicoRotas, setHistoricoRotas] = useState();
	const toast = useRef(null);

	async function buscarHistoricoVeicles(placa, date_inicio, date_fim) {
		setLoading(true);
		try {
			const historico = (
				await ServiceCoordenadas.listHistoryVeicles({
					placa,
					date_inicio,
					date_fim,
				})
			).data;

			if (historico?.posicao?.length > 0) {
				setHistoricoRotas(historico);
			} else {
				const message =
					"Não foram encontrado hitórico do veículo com este filtro de data!";
				showToastMessage(toast, "warn", message, 7000);
			}
		} catch (error) {
			setLoading(false);
		}
		setLoading(false);
	}

	function clearHistoricoRotas() {
		setHistoricoRotas(null);
	}

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Toast ref={toast} className="w-25" position="top-center"></Toast>
			<ViewHistoricoVeiculo
				historicoRotas={historicoRotas}
				setHistoricoRotas={setHistoricoRotas}
				buscarHistoricoVeicles={buscarHistoricoVeicles}
				clearHistoricoRotas={clearHistoricoRotas}
			/>
		</>
	);
}

export default HistoricoVeiculos;
