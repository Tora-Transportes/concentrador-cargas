import React, { useState } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
//import NavbarNavigator from "../../Components/NavbarNavigator";
import ViewRaio from "./view";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";
import swal from "sweetalert";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";

function DestinoCarga() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [rota, setRota] = useState(null);

	async function calcularRotaDestino(placa, empresa) {
		setLoading(true);
		const campos = empresa.split(" - ");
		if (campos.length !== 3) {
			return swal("Ops! 👀", "Empresa inválida", "error");
		}
		const cnpj = String(campos[1]).trim();
		try {
			const vehicles = (
				await ServiceCoordenadas.searchRoute({
					placa,
					cnpj,
				})
			).data;
			setRota(vehicles);
		} catch (error) {
			setLoading(false);
		}
		setLoading(false);
	}

	function clearRota() {
		setRota(null);
	}

	return (
		<>
			<LoadingScreen />
			{/* <NavbarNavigator /> */}
			<Menusuperior />
			<ViewRaio
				rota={rota}
				calcularRotaDestino={calcularRotaDestino}
				clearRota={clearRota}
			/>
		</>
	);
}

export default DestinoCarga;
