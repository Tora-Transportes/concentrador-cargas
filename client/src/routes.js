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
import ConsultaCarga from "./Pages/Coordenadas/ConsultaCargas/consultaCargas";
import RelatoriosMain from "./Pages/Relatorios/Totalizadores";
import Credenciais from "./Pages/Credenciais";
// import CalendarioProducao from "./Pages/CalendarioProducao";
import LinkRelatorios from "./Pages/Components/MenuSuperior/LinkRelatorios";
import RaioVeiculos from "./Pages/Veiculos/Raio";
import DestinoCarga from "./Pages/Veiculos/DestinoCarga";
import RaioEmpresa from "./Pages/Veiculos/RaioEmpresa";
import LinkCarga from "./Pages/Cargas/Manual/LinkCarga";
import HistoricoVeiculo from "./Pages/Veiculos/HistoricoVeiculo";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
// import Helper from "./Pages/Components/Helper/ajuda";
// import HelperCSN from "./Pages/Components/Helper/ajudaCSN";
import Avisos from "./Pages/Avisos";
import CadastroCargaCSN from "./Pages/Cargas/CargasCSN/Cadastrar";
import LocalizacaoCSN from "./Pages/LocalizacaoCSN";
import VisualizarCsn from "./Pages/Cargas/CargasCSN/VisualizarCsn";
import EditarCargaCsn from "./Pages/Cargas/CargasCSN/Editar";
// import MainPopUp from "./Pages/Avisos/indexPopUp";
import LinkRelatoriosApp from "./Pages/Components/MenuSuperior/LinkRelatoriosApp";
import RelatoriosAppMain from "./Pages/Relatorios/TotalizadoresApp";

export default function AllRoutes() {
	//Limpar cache quando subir uma nova versão , isto se tiver necessidade...
	// Tem que mudar a versão na pasta main linha 141 ...
	// const limparCache = localStorage.getItem("clear_Cache");
	// if (limparCache == null || limparCache.toString() !== "version_1") {
	// 	localStorage.removeItem("table-columns-csn");
	// 	localStorage.removeItem("table-columns");
	// 	localStorage.removeItem("table-columns-lote");
	// 	localStorage.removeItem("coordenadas-table");
	// 	localStorage.removeItem("viewsAviso");
	// 	localStorage.setItem("clear_Cache", "version_1");
	// 	location.reload();
	// }

	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Main} />

				<Route path="/cargas/visualizar" exact component={VisualizarCargas} />
				<Route path="/lotes/visualizar" exact component={VisualizarLotes} />
				<Route path="/cargas/visualizar/csn" exact component={VisualizarCsn} />
				<Route path="/cargas/menu" exact component={LoadMenu} />
				<Route path="/cargas/importar" exact component={ImportarCargas} />

				<Route path="/cargas/cadastro/csn" exact component={CadastroCargaCSN} />
				<Route path="/cargas/csn/:id" exact component={EditarCargaCsn} />
				<Route path="/localizacao" exact component={LocalizacaoCSN} />

				<Route path="/cargas/manual" exact component={CadastrarCargaManual} />
				<Route path="/cargas/manual/:id" exact component={EditarCargaManual} />
				<Route path="/cargas/consulta/:id" exact component={ConsultaCarga} />
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

				<Route
					path="/veiculos/aprovacao/:id"
					exact
					component={SituacaoVeiculos}
				/>
				<Route path="/veiculos/raio" exact component={RaioVeiculos} />
				<Route path="/veiculos/destino" exact component={DestinoCarga} />
				<Route path="/veiculos/raio/empresa" exact component={RaioEmpresa} />
				<Route path="/veiculos/historico" exact component={HistoricoVeiculo} />
				<Route
					path="/veiculos/coordenadas"
					exact
					component={CoordenadasVeiculos}
				/>

				<Route
					path="/relatorios/visualizar/:id"
					exact
					component={RelatoriosMain}
				/>
				<Route
					path="/relatorios/app/visualizar/:id"
					exact
					component={RelatoriosAppMain}
				/>
				<Route path="/relatorios/visualizar" exact component={LinkRelatorios} />
				<Route
					path="/relatorios/app/visualizar"
					exact
					component={LinkRelatoriosApp}
				/>
				<Route path="/credenciais" exact component={Credenciais} />
				{/* <Route path="/producao" exact component={CalendarioProducao} /> */}
				{/* <Route path="/ajuda" exact component={Helper} />
				<Route path="/ajuda/CSN" exact component={HelperCSN} /> */}
				<Route path="/avisos" exact component={Avisos} />
				<Route path="*" exact component={Main} />
			</Switch>

			{/* <MainPopUp /> */}
		</BrowserRouter>
	);
}
