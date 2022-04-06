import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Main from "./Pages/Main";
import LoadMenu from "./Pages/Cargas/Menu";
import ImportarCargas from "./Pages/Cargas/Importar";
import CadastrarCargaManual from "./Pages/Cargas/Manual/Cadastrar";
import CadastrarCargaDerivada from "./Pages/Cargas/Manual/Derivada";
import EditarCargaManual from "./Pages/Cargas/Manual/Editar";
import VisualizarCargas from "./Pages/Cargas/Visualizar";
import VisualizarLotes from "./Pages/Cargas/VisualizarLotes";
import PermissoesUsuarios from "./Pages/Usuarios/Permissoes";
import Produtos from "./Pages/Produtos";
import RotasPendentes from "./Pages/Rotas/Pendentes";
import SituacaoVeiculos from "./Pages/Veiculos/Pendentes";
import CoordenadasVeiculos from "./Pages/Coordenadas";
import RelatoriosMain from "./Pages/Relatorios/Totalizadores";
import Credenciais from "./Pages/Credenciais";
import CalendarioProducao from "./Pages/CalendarioProducao";

export default function AllRoutes() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Main} />
				<Route path="/cargas/visualizar" exact component={VisualizarCargas} />
				<Route path="/lotes/visualizar" exact component={VisualizarLotes} />
				<Route path="/cargas/menu" exact component={LoadMenu} />
				<Route path="/cargas/importar" exact component={ImportarCargas} />

				<Route path="/cargas/manual" exact component={CadastrarCargaManual} />
				<Route path="/cargas/manual/:id" exact component={EditarCargaManual} />
				<Route
					path="/cargas/derivadas/:id"
					exact
					component={CadastrarCargaDerivada}
				/>
				<Route
					path="/usuarios/permissoes"
					exact
					component={PermissoesUsuarios}
				/>

				<Route path="/produtos" exact component={Produtos} />
				<Route path="/rotas/pendentes" exact component={RotasPendentes} />
				<Route path="/veiculos/aprovacao" exact component={SituacaoVeiculos} />

				<Route
					path="/veiculos/coordenadas"
					exact
					component={CoordenadasVeiculos}
				/>
				<Route path="/relatorios" exact component={RelatoriosMain} />
				<Route path="/credenciais" exact component={Credenciais} />
				<Route path="/producao" exact component={CalendarioProducao} />
			</Switch>
		</BrowserRouter>
	);
}
