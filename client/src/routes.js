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
// import CalendarioProducao from "./Pages/CalendarioProducao";
import RaioVeiculos from "./Pages/Veiculos/Raio";
import DestinoCarga from "./Pages/Veiculos/DestinoCarga";
import RaioEmpresa from "./Pages/Veiculos/RaioEmpresa";
import LinkCarga from "./Pages/Cargas/Manual/LinkCarga";
import HistoricoVeiculo from "./Pages/Veiculos/HistoricoVeiculo";
// import Menusuperior from "./Pages/Components/MenuSuperior/menusuperior";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
import Helper from "./Pages/Components/Helper/ajuda";

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
					path="/cargas/manual/visualizar/:id"
					exact
					component={LinkCarga}
				/>
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

				<Route path="/veiculos/raio" exact component={RaioVeiculos} />
				<Route path="/veiculos/destino" exact component={DestinoCarga} />
				<Route path="/veiculos/raio/empresa" exact component={RaioEmpresa} />
				<Route path="/veiculos/historico" exact component={HistoricoVeiculo} />

				<Route
					path="/veiculos/coordenadas"
					exact
					component={CoordenadasVeiculos}
				/>
				<Route path="/relatorios" exact component={RelatoriosMain} />
				<Route path="/credenciais" exact component={Credenciais} />
				{/* <Route path="/producao" exact component={CalendarioProducao} /> */}
				<Route path="/ajuda" exact component={Helper} />
			</Switch>
		</BrowserRouter>
	);
}
