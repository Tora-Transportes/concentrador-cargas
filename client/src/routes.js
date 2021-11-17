import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Main from "./Pages/Main";
import LoadMenu from "./Pages/Cargas/Menu";
import CadastrarCargaLigacao from "./Pages/Cargas/Ligacao/Cadastrar";
import EditarCargaLigacao from "./Pages/Cargas/Ligacao/Editar";
import VisualizarCargas from "./Pages/Cargas/Visualizar";
import PermissoesUsuarios from "./Pages/Usuarios/Permissoes";
import Produtos from "./Pages/Produtos";

export default function AllRoutes() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Main} />
				<Route path="/cargas/visualizar" exact component={VisualizarCargas} />
				<Route path="/cargas/menu" exact component={LoadMenu} />

				<Route path="/cargas/ligacao" exact component={CadastrarCargaLigacao} />
				<Route
					path="/cargas/ligacao/:id"
					exact
					component={EditarCargaLigacao}
				/>
				<Route
					path="/usuarios/permissoes"
					exact
					component={PermissoesUsuarios}
				/>

				<Route path="/produtos" exact component={Produtos} />
			</Switch>
		</BrowserRouter>
	);
}
