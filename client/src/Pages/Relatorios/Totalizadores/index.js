import React from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
import NavbarNavigator from "../../Components/NavbarNavigator";
import RelatoriosMainView from "./view";
import ServiceRelatorios from "../../../services/ServiceRelatorios";
import { useEffect, useState } from "react";
import io from "../../../services/socket";

function RelatoriosMain() {
	const [LoadingScreen] = useLoadingScreen();
	const [totalizadores, setTotalizadores] = useState({
		cargas_ativas: 0,
		cargas_desativadas: 0,
		cadastro_portal: 0,
		cadastro_manual: 0,
		geral: [
			{
				total: 0,
				fk_situacao: 1,
				descricao: "Aguardando Alocação (Veículo)",
			},
			{
				total: 0,
				fk_situacao: 2,
				descricao: "Aguardando GR",
			},
			{
				total: 0,
				fk_situacao: 3,
				descricao: "Validado pelo GR",
			},
			{
				total: 0,
				fk_situacao: 4,
				descricao: "Veículo Reprovado",
			},
			{
				total: 0,
				fk_situacao: 5,
				descricao: "Carga cancelada",
			},
		],
	});

	useEffect(() => {
		let interval;
		const reload = () => {
			clearInterval(interval);
			interval = setTimeout(async () => {
				setTotalizadores((await ServiceRelatorios.totalizadores()).data.data);
			}, 1000);
		};
		io.onAny(reload);
		return () => {
			io.offAny(reload);
		};
	}, [io]);

	useEffect(() => {
		let isMounted = true;
		(async function () {
			if (isMounted) {
				const total = (await ServiceRelatorios.totalizadores()).data.data;
				console.log(total);
				setTotalizadores(total);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, []);
	return (
		<>
			<LoadingScreen />
			<NavbarNavigator />
			<RelatoriosMainView totalizadores={totalizadores} />
		</>
	);
}

export default RelatoriosMain;
