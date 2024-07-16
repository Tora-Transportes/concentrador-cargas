import React, { useEffect, useState } from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import { makeStyles } from "@material-ui/core/styles";
import PainelComponent from "./components/Painel";
import ServiceIntegracaoConcentradorApp from "src/services/ServiceIntegracaoConcentradorApp";

const useStyles = makeStyles(() => ({
	root: {
		width: "100%",
	},
}));

const IntegracaoConcentadorApp = () => {
	const classes = useStyles();
	const [info, setInfo] = useState({});

	const fetchData = async () => {
		try {
			const { data } = await ServiceIntegracaoConcentradorApp.info();
			setInfo(data.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className={classes.root}>
			<Menusuperior />
			<PainelComponent data={info} />
		</div>
	);
};

export default IntegracaoConcentadorApp;
