import React, { useEffect, useState } from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import { makeStyles } from "@material-ui/core/styles";
import StepperComponent from "./components/Stepper";
import PainelComponent from "./components/Painel";
import ServicePPOCalculador from "src/services/ServicePPOCalculador";
import Swal from "sweetalert2";

const useStyles = makeStyles(() => ({
	root: {
		width: "100%",
	},
}));

const Calculador = () => {
	const classes = useStyles();
	const [info, setInfo] = useState({});
	const [estado, setEstado] = useState(false);

	const fetchData = async () => {
		try {
			const { data } = await ServicePPOCalculador.info();
			setInfo(data.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);

	async function reprocessar() {
		const { data } = await ServicePPOCalculador.emExecucao({
			status: 1,
		});
		if (data.data.length > 0) {
			Swal.fire({
				title: "Reprocessamento em andamento",
				text: "Não é possível reprocessar no momento pois já possui um agendamento de reprocessamento ou o serviço já está em execução",
			});
		} else {
			setEstado(!estado);
		}
	}

	async function voltar() {
		setEstado(!estado);
	}

	useEffect(() => {
		const intervalId = setInterval(() => {
			fetchData();
		}, 5000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className={classes.root}>
			<Menusuperior />
			{!estado ? (
				<PainelComponent data={info} handleReprocessar={reprocessar} />
			) : (
				<StepperComponent handleReprocessar={voltar} />
			)}
		</div>
	);
};

export default Calculador;
