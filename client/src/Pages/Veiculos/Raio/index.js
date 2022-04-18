import React, { useState } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
import NavbarNavigator from "../../Components/NavbarNavigator";
import ViewRaio from "./view";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";

function RaioVeiculos() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [raio, setRaio] = useState(null);

	async function buscarVeiculosNoRaio(placa, distancia_km) {
		setLoading(true);
		try {
			const vehicles = (
				await ServiceCoordenadas.listVehiclesInRange({
					placa,
					distancia_km,
				})
			).data;
			setRaio(vehicles);
		} catch (error) {
			setLoading(false);
		}
		setLoading(false);
	}

	function clearRaio() {
		setRaio(null);
	}

	return (
		<>
			<LoadingScreen />
			<NavbarNavigator />
			<ViewRaio
				raio={raio}
				buscarVeiculosNoRaio={buscarVeiculosNoRaio}
				clearRaio={clearRaio}
			/>
		</>
	);
}

export default RaioVeiculos;
