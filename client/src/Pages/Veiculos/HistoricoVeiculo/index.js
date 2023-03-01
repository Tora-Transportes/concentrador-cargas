import React, { useState, useRef, useEffect } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
import ViewHistoricoVeiculo from "./views";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";
import { showToastMessage } from "src/Pages/Utils/toastMessage";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { Toast } from "primereact/toast";

function HistoricoVeiculos() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [historicoRotas, setHistoricoRotas] = useState();
	const [isArrayLatLon, setArrayLatLon] = useState([]);
	const [isCountPosition, setCountPosition] = useState(0);
	const [isDataPosition, setDataPosition] = useState("");
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
					"Histórico do veículo não encontrado no período informado.";
				showToastMessage(toast, "warn", message, 8000);
			}
		} catch (error) {
			setLoading(false);
		}
		setLoading(false);
	}

	function clearHistoricoRotas() {
		setHistoricoRotas(null);
		setCountPosition(0);
		setDataPosition("");
	}

	useEffect(() => {
		if (historicoRotas?.posicao?.length > 0) {
			const arrayPosition = historicoRotas.posicao.map((position) => [
				Number(position.LAT.replace(",", ".")),
				Number(position.LON.replace(",", ".")),
			]);
			setArrayLatLon(arrayPosition);
		}
	}, [historicoRotas]);
	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Toast
				ref={toast}
				position="top-center"
				style={{ width: "30vw" }}
			></Toast>
			<ViewHistoricoVeiculo
				historicoRotas={historicoRotas}
				setHistoricoRotas={setHistoricoRotas}
				buscarHistoricoVeicles={buscarHistoricoVeicles}
				clearHistoricoRotas={clearHistoricoRotas}
				LoadingScreen={LoadingScreen}
				setLoading={setLoading}
				setDataPosition={setDataPosition}
				isDataPosition={isDataPosition}
				isArrayLatLon={isArrayLatLon}
				isCountPosition={isCountPosition}
				setCountPosition={setCountPosition}
			/>
		</>
	);
}

export default HistoricoVeiculos;
