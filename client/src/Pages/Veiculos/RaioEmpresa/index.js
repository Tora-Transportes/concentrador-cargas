import React, { useState } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
import NavbarNavigator from "../../Components/NavbarNavigator";
import ViewRaio from "./view";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";
import swal from "sweetalert";

function RaioEmpresa() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [rota, setRota] = useState(null);

	async function calcularRotaDestino(empresa, distancia_km) {
		setLoading(true);
		const campos = empresa.split(" - ");
		if (campos.length !== 3) {
			return swal("Ops! 👀", "Empresa inválida", "error");
		}
		const cnpj = String(campos[1]).trim();
		try {
			const vehicles = (
				await ServiceCoordenadas.listVehiclesInRangeEnterprise({
					cnpj,
					distancia_km,
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
			<NavbarNavigator />
			<ViewRaio
				rota={rota}
				calcularRotaDestino={calcularRotaDestino}
				clearRota={clearRota}
			/>
		</>
	);
}

export default RaioEmpresa;
