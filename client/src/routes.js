import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Main from "./Pages/Main";
import LoadMenu from "./Pages/Cargas/Menu";
import ImportarCargas from "./Pages/Cargas/Importar";
import CadastrarCargaManual from "./Pages/Cargas/Manual/Cadastrar";
import EditarCargaManual from "./Pages/Cargas/Manual/Editar";
import VisualizarCargas from "./Pages/Cargas/Visualizar";
import PermissoesUsuarios from "./Pages/Usuarios/Permissoes";
import Produtos from "./Pages/Produtos";
import RotasPendentes from "./Pages/Rotas/Pendentes";

export default function AllRoutes() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Main} />
				<Route path="/cargas/visualizar" exact component={VisualizarCargas} />
				<Route path="/cargas/menu" exact component={LoadMenu} />
				<Route path="/cargas/importar" exact component={ImportarCargas} />

				<Route path="/cargas/manual" exact component={CadastrarCargaManual} />
				<Route path="/cargas/manual/:id" exact component={EditarCargaManual} />
				<Route
					path="/usuarios/permissoes"
					exact
					component={PermissoesUsuarios}
				/>

				<Route path="/produtos" exact component={Produtos} />
				<Route path="/rotas/pendentes" exact component={RotasPendentes} />
			</Switch>
		</BrowserRouter>
	);
}
