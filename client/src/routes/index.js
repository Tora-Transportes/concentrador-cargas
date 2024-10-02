import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import Routes from "./Routes";

import Main from "../Pages/Main";
import LoadMenu from "../Pages/Cargas/Menu";
import ImportarCargas from "../Pages/Cargas/Importar";
import CadastrarCargaManual from "../Pages/Cargas/Manual/Cadastrar";
import CadastrarCargaDerivada from "../Pages/Cargas/Manual/Derivada";
import EditarCargaManual from "../Pages/Cargas/Manual/Editar";
import VisualizarCargas from "../Pages/Cargas/Visualizar";
import VisualizarLotes from "../Pages/Cargas/VisualizarLotes";
import PermissoesUsuarios from "../Pages/Usuarios/Permissoes";
import Produtos from "../Pages/Produtos";
import RotasPendentes from "../Pages/Rotas/Pendentes";
import SituacaoVeiculos from "../Pages/Veiculos/Pendentes";
import CoordenadasVeiculos from "../Pages/Coordenadas";
import ConsultaCarga from "../Pages/Coordenadas/ConsultaCargas/consultaCargas";
import RelatoriosMain from "../Pages/Relatorios/Totalizadores";
import Credenciais from "../Pages/Credenciais";
// import CalendarioProducao from "../Pages/CalendarioProducao";
import LinkRelatorios from "../Pages/Components/MenuSuperior/LinkRelatorios";
import RaioVeiculos from "../Pages/Veiculos/Raio";
import DestinoCarga from "../Pages/Veiculos/DestinoCarga";
import RaioEmpresa from "../Pages/Veiculos/RaioEmpresa";
import LinkCarga from "../Pages/Cargas/Manual/LinkCarga";
import HistoricoVeiculo from "../Pages/Veiculos/HistoricoVeiculo";
import HistoricoVeiculoTempo from "../Pages/Veiculos/Historico2.0";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
// import Helper from "../Pages/Components/Helper/ajuda";
//import HelperCSN from "../Pages/Components/Helper/ajudaCSN";
import Avisos from "../Pages/Avisos";
import CadastroCargaCSN from "../Pages/Cargas/CargasCSN/Cadastrar";
import LocalizacaoCSN from "../Pages/LocalizacaoCSN";
import VisualizarCsn from "../Pages/Cargas/CargasCSN/VisualizarCsn";
import EditarCargaCsn from "../Pages/Cargas/CargasCSN/Editar";
import LinkRelatoriosApp from "../Pages/Components/MenuSuperior/LinkRelatoriosApp";
import RelatoriosAppMain from "../Pages/Relatorios/TotalizadoresApp";
import MainPopUp from "../Pages/Avisos/popUp";
import Estatisticas from "../Pages/PPO/Estatisticas";
import Grupos from "../Pages/PPO/Grupos";
import Parametros from "../Pages/PPO/Parametros";
import GruposParametros from "../Pages/PPO/GruposParametros";
import RelatorioMotoristas from "../Pages/PPO/RelatorioMotoristas";
import DemonstrativoMotoristas from "../Pages/PPO/DemostrativoMotoristas";
import ExportaProtheus from "../Pages/PPO/ExportaProtheus";
import RelatorioDocumentos from "../Pages/PPO/RelatorioDocumentos";
import Calculador from "../Pages/PPO/Calculador";
import PermissoesVisualizacao from "../Pages/PPO/PermissoesVisualizacao";
import Permissoes from "src/Pages/PPO_Eventos/Permissoes";
import AprovacaoSupervisor from "src/Pages/PPO_Eventos/AprovacaoSupervisor";
import AprovacaoGerente from "src/Pages/PPO_Eventos/AprovacaoGerente";
import RelatorioEventos from "src/Pages/PPO_Eventos/RelatorioEventos";
import RelatorioAprovacoes from "src/Pages/PPO_Eventos/RelatorioAprovacoes";
import PreRequisitos from "src/Pages/Cargas/PreRequisitos";
import IntegracaoConcentadorApp from "src/Pages/Cargas/IntegracaoConcentadorApp";
import Multas from "src/Pages/GestaoMultas/Multas";
import Notificacoes from "src/Pages/GestaoMultas/Notificacoes";
import Empresas from "src/Pages/GestaoMultas/Empresas";
import PermissoesGestaoMultas from "src/Pages/GestaoMultas/Permissoes";
import EmpresasEditar from "src/Pages/GestaoMultas/Empresas/Editar";
import NotificacoesEditar from "src/Pages/GestaoMultas/Notificacoes/Editar";
import MultasEditar from "src/Pages/GestaoMultas/Multas/Editar";

export default function AllRoutes() {
	//Limpar cache quando subir uma nova versão , isto se tiver necessidade...
	// Tem que mudar a versão na pasta main linha 141 ...
	const limparCache = localStorage.getItem("clear_Cache");
	if (limparCache == null || limparCache.toString() !== "version_14.3") {
		localStorage.removeItem("table-columns-csn");
		localStorage.removeItem("table-columns");
		//localStorage.removeItem("table-columns-lote");
		//localStorage.removeItem("coordenadas-table");
		//localStorage.removeItem("viewsAviso");
		localStorage.setItem("clear_Cache", "version_14.3");
		window.location.reload(true);
	}

	return (
		<BrowserRouter>
			<Switch>
				<Routes path="/" exact component={Main} />
				<Routes
					path="/ppo_eventos/aprovacao/supervisor"
					exact
					component={AprovacaoSupervisor}
				/>
				<Routes
					path="/ppo_eventos/aprovacao/gerente"
					exact
					component={AprovacaoGerente}
				/>
				<Routes path="/ppo_eventos/permissoes" exact component={Permissoes} />
				<Routes
					path="/ppo_eventos/relatorios/eventos"
					exact
					component={RelatorioEventos}
				/>

				<Routes
					path="/ppo_eventos/relatorios/aprovacoes"
					exact
					component={RelatorioAprovacoes}
				/>

				<Routes
					path="/ppo/permissoes-visualizacao"
					exact
					component={PermissoesVisualizacao}
				/>
				<Routes path="/ppo/estatisticas" exact component={Estatisticas} />
				<Routes path="/ppo/grupos" exact component={Grupos} />
				<Routes
					path="/ppo/grupos/:id/parametros"
					exact
					component={GruposParametros}
				/>
				<Routes path="/ppo/parametros" exact component={Parametros} />
				<Routes
					path="/ppo/relatorio/motoristas"
					exact
					component={RelatorioMotoristas}
				/>
				<Routes
					path="/ppo/relatorio/documentos"
					exact
					component={RelatorioDocumentos}
				/>
				<Routes path="/ppo/calculador" exact component={Calculador} />
				<Routes
					path="/ppo/demonstrativos"
					exact
					component={DemonstrativoMotoristas}
				/>

				<Routes
					path="/ppo/exportar/protheus"
					exact
					component={ExportaProtheus}
				/>

				<Routes path="/cargas/visualizar" exact component={VisualizarCargas} />
				<Routes path="/lotes/visualizar" exact component={VisualizarLotes} />
				<Routes path="/cargas/visualizar/csn" exact component={VisualizarCsn} />
				<Routes path="/cargas/menu" exact component={LoadMenu} />
				<Routes path="/cargas/importar" exact component={ImportarCargas} />

				<Routes
					path="/cargas/cadastro/csn"
					exact
					component={CadastroCargaCSN}
				/>
				<Routes path="/cargas/csn/:id" exact component={EditarCargaCsn} />
				<Routes path="/localizacao" exact component={LocalizacaoCSN} />

				<Routes path="/cargas/manual" exact component={CadastrarCargaManual} />
				<Routes path="/cargas/pre-requisitos" exact component={PreRequisitos} />
				<Routes
					path="/cargas/integracao"
					exact
					component={IntegracaoConcentadorApp}
				/>
				<Routes path="/cargas/manual/:id" exact component={EditarCargaManual} />
				<Routes path="/cargas/consulta/:id" exact component={ConsultaCarga} />
				<Routes
					path="/cargas/manual/visualizar/:id"
					exact
					component={LinkCarga}
				/>
				<Routes
					path="/cargas/derivadas/:id"
					exact
					component={CadastrarCargaDerivada}
				/>
				<Routes
					path="/usuarios/permissoes"
					exact
					component={PermissoesUsuarios}
				/>

				<Routes path="/produtos" exact component={Produtos} />

				<Routes path="/rotas/pendentes" exact component={RotasPendentes} />

				<Routes
					path="/veiculos/aprovacao/:id"
					exact
					component={SituacaoVeiculos}
				/>
				<Routes path="/veiculos/raio" exact component={RaioVeiculos} />
				<Routes path="/veiculos/destino" exact component={DestinoCarga} />
				<Routes path="/veiculos/raio/empresa" exact component={RaioEmpresa} />
				<Routes path="/veiculos/historico" exact component={HistoricoVeiculo} />
				<Routes
					path="/veiculos/historico/tempo"
					exact
					component={HistoricoVeiculoTempo}
				/>
				<Routes
					path="/veiculos/coordenadas"
					exact
					component={CoordenadasVeiculos}
				/>

				<Routes
					path="/relatorios/visualizar/:id"
					exact
					component={RelatoriosMain}
				/>
				<Routes
					path="/relatorios/app/visualizar/:id"
					exact
					component={RelatoriosAppMain}
				/>
				<Routes
					path="/relatorios/visualizar"
					exact
					component={LinkRelatorios}
				/>
				<Routes
					path="/relatorios/app/visualizar"
					exact
					component={LinkRelatoriosApp}
				/>
				<Routes path="/credenciais" exact component={Credenciais} />
				{/* <Routes path="/producao" exact component={CalendarioProducao} /> */}
				{/* <Routes path="/ajuda" exact component={Helper} /> */}
				{/* <Routes path="/ajuda/CSN" exact component={HelperCSN} /> */}
				<Routes path="/avisos" exact component={Avisos} />
				{/* */}
				<Routes path="/gestao-multas/multas" exact component={Multas} />
				<Routes
					path="/gestao-multas/multas/:id"
					exact
					component={MultasEditar}
				/>
				<Routes
					path="/gestao-multas/notificacoes"
					exact
					component={Notificacoes}
				/>
				<Routes
					path="/gestao-multas/notificacoes/:id"
					exact
					component={NotificacoesEditar}
				/>
				<Routes path="/gestao-multas/empresas" exact component={Empresas} />
				<Routes
					path="/gestao-multas/empresas/:id"
					exact
					component={EmpresasEditar}
				/>
				<Routes
					path="/gestao-multas/permissoes"
					exact
					component={PermissoesGestaoMultas}
				/>
				<Routes path="*" exact component={Main} />
			</Switch>

			<MainPopUp />
		</BrowserRouter>
	);
}
