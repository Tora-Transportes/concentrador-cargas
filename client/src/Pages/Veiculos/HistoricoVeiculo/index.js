import React, { useState } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
import ViewHistoricoVeiculo from "./views";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";

function HistoricoVeiculos() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [historicoRotas, setHistoricoRotas] = useState(false);

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
			setHistoricoRotas(historico);
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
