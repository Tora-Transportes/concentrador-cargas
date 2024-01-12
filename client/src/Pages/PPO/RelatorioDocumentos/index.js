import React, { useEffect } from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import useLoadingScreen from "../../Components/LoadingScreen";

const RelatorioDocumentos = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();

	useEffect(() => {
		setLoading(true);
		async function dados() {
			setLoading(false);
		}
		dados();
	}, []);

	return (
		<div>
			<LoadingScreen />
			<Menusuperior />
		</div>
	);
};

export default RelatorioDocumentos;
