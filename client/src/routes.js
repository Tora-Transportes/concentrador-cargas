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
import HistoricoVeiculoTempo from "./Pages/Veiculos/Historico2.0";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
// import Helper from "./Pages/Components/Helper/ajuda";
//import HelperCSN from "./Pages/Components/Helper/ajudaCSN";
import Avisos from "./Pages/Avisos";
import CadastroCargaCSN from "./Pages/Cargas/CargasCSN/Cadastrar";
import LocalizacaoCSN from "./Pages/LocalizacaoCSN";
import VisualizarCsn from "./Pages/Cargas/CargasCSN/VisualizarCsn";
import EditarCargaCsn from "./Pages/Cargas/CargasCSN/Editar";
import LinkRelatoriosApp from "./Pages/Components/MenuSuperior/LinkRelatoriosApp";
import RelatoriosAppMain from "./Pages/Relatorios/TotalizadoresApp";
import MainPopUp from "./Pages/Avisos/popUp";
import SiteEmManutencao from "./Pages/SiteEmManutencao";
import EngateDesengate from "./Pages/EngateDesengateCCa/selecionarProcesso";
import Engate from "./Pages/EngateDesengateCCa/engate";
import Desengate from "./Pages/EngateDesengateCCa/desengate";
import Estatisticas from "./Pages/PPO/Estatisticas";
import Grupos from "./Pages/PPO/Grupos";
import Parametros from "./Pages/PPO/Parametros";
import GruposParametros from "./Pages/PPO/GruposParametros";

export default function AllRoutes() {
	//Limpar cache quando subir uma nova versão , isto se tiver necessidade...
	// Tem que mudar a versão na pasta main linha 141 ...
	const limparCache = localStorage.getItem("clear_Cache");
	if (limparCache == null || limparCache.toString() !== "version_13") {
		localStorage.removeItem("table-columns-csn");
		localStorage.removeItem("table-columns");
		localStorage.setItem("clear_Cache", "version_13");
		window.location.reload(true);
	}

	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Main} />

				<Route path="/ppo/estatisticas" exact component={Estatisticas} />
				<Route path="/ppo/grupos" exact component={Grupos} />
				<Route
					path="/ppo/grupos/:id/parametros"
					exact
					component={GruposParametros}
				/>
				<Route path="/ppo/parametros" exact component={Parametros} />

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
					path="/veiculos/historico/tempo"
					exact
					component={HistoricoVeiculoTempo}
				/>
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
				<Route path="/opcao/engate" exact component={EngateDesengate} />
				<Route path="/engate" exact component={Engate} />
				<Route path="/desengate" exact component={Desengate} />

				<Route path="/avisos" exact component={Avisos} />
				<Route path="/manutencao" component={SiteEmManutencao} />
				<Route path="*" exact component={Main} />
			</Switch>

			<MainPopUp />
		</BrowserRouter>
	);
}
