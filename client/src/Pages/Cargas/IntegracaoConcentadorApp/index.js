import React from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import { makeStyles } from "@material-ui/core/styles";
import PainelComponent from "./components/Painel";

const useStyles = makeStyles(() => ({
	root: {
		width: "100%",
	},
}));

const IntegracaoConcentadorApp = () => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Menusuperior />
			<PainelComponent />
		</div>
	);
};

export default IntegracaoConcentadorApp;
