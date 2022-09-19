import React, { useRef } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
// import NavbarNavigator from "../../Components/NavbarNavigator";
import RelatoriosMainView from "./view";
import ServiceRelatorios from "../../../services/ServiceRelatorios";
import { useEffect, useState } from "react";
import io from "../../../services/socket";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";

function RelatoriosMain() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [totalizadores, setTotalizadores] = useState({
		cargas_ativas: 0,
		cargas_desativadas: 0,
		cadastro_portal: 0,
		cadastro_manual: 0,
		lotes_ativos: 0,
		lotes_desativados: 0,
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
	const [tempoMedioAprovacaoGr, setTempoMedioAprovacaoGr] = useState(null);
	const [resumosDiarios, setResumosDiarios] = useState([]);
	const [filters, setFilters] = useState({
		data_inicio: "",
		data_final: "",
		fk_filial: "",
	});

	const interval = useRef(null);
	useEffect(() => {
		reload();
	}, [filters]);

	const reload = () => {
		clearInterval(interval.current);
		interval.current = setTimeout(async () => {
			setLoading(true);
			setTotalizadores(
				(await ServiceRelatorios.totalizadores(filters)).data.data
			);

			setTempoMedioAprovacaoGr(
				await (
					await ServiceRelatorios.mediaAprovacaoGr()
				).data.data[0]
			);

			if (!filters.fk_filial || !filters.data_final || !filters.data_inicio) {
				setResumosDiarios([]);
			} else {
				const a = (await ServiceRelatorios.resumosDiarios(filters)).data.data;
				setResumosDiarios(a);
			}
			setLoading(false);
		}, 300);
	};

	async function handleExportExcel(key = "") {
		setLoading(true);

		const response = await ServiceRelatorios.exportToXlsx({ key, ...filters });
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`RELATORIO_DETALHES-${new Date().getTime()}.xlsx`
		);
		link.click();
		setLoading(false);
	}

	useEffect(() => {
		io.on("@cargas-create", reload);
		io.on("@cargas-update", reload);
		io.on("@cargas-delete", reload);
		return () => {
			io.offAny(reload);
		};
	}, [io, reload, filters]);

	useEffect(() => {
		let isMounted = true;
		(async function () {
			if (isMounted) {
				const total = (await ServiceRelatorios.totalizadores()).data.data;
				setTotalizadores(total);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, []);
	return (
		<div className="class-body-relatorio">
			<LoadingScreen />
			{/* <NavbarNavigator /> */}
			<Menusuperior />
			<RelatoriosMainView
				totalizadores={totalizadores}
				reload={setFilters}
				handleExportExcel={handleExportExcel}
				resumosDiarios={resumosDiarios}
				tempoMedioAprovacaoGr={tempoMedioAprovacaoGr}
			/>
		</div>
	);
}

export default RelatoriosMain;
