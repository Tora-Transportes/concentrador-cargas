import express, { Router } from "express";
import path from "path";
import multer from "multer";
import CargaController from "./controllers/CargaController";
import UsuarioController from "./controllers/UsuarioController";
import TokenMiddleware from "./middlewares/Token";
import HasPermission from "./middlewares/HasPermissions";
import LogMiddleware from "./middlewares/Log";
import ConvertFieldsToDate from "./middlewares/ConvertFieldsToDate";
import ExportController from "./controllers/ExportController";
import ProdutoController from "./controllers/ProdutoController";
import RecomendacoesController from "./controllers/RecomendacoesController";
import RotasController from "./controllers/RotasController";
import SituacoesCargasController from "./controllers/SituacoesCargasController";
import SituacoesCargasCsnController from "./controllers/csn/SituacaoCargasCsnController";
import CoordenadasController from "./controllers/CoordenadaController";
import RelatorioController from "./controllers/RelatorioController";
import CredenciaisController from "./controllers/CredenciaisController";
import ProducaoController from "./controllers/ProducaoController";
import CargaTecController from "./controllers/CargaTecController";
import AvisosController from "./controllers/AvisosController";
import CargasCsnController from "./controllers/csn/CargasCsnController";
import PontoParadaController from "./controllers/PontoParadaController";
import CargasCsnInfoController from "./controllers/csn/CargasCsnInfoController";
import LogsErrorControllers from "./controllers/LogsErrorControllers";
import CargaAppController from "./controllers/AppTora/CargaAppController";
import PPOController from "./controllers/PPO/PPOController";
import PPOParametrosController from "./controllers/PPO/PPOParametrosController";
import PPOGruposController from "./controllers/PPO/PPOGruposController";
import PPOParametrosGrupoController from "./controllers/PPO/PPOParametrosGrupoController";
import WebhookAutentiqueController from "./controllers/WebhookAutentiqueController";
import PPOCalculadorController from "./controllers/PPO/PPOCalculadorController";
import WebhookGitHubController from "./controllers/WebhookGitHubController";
import PPOEventosPermissoesController from "./controllers/PPO/PPOEventosPermissoesController";
import PPOEventosAprovacaoController from "./controllers/PPO/PPOEventosAprovacaoController";
import PPOEventosRelatoriosController from "./controllers/PPO/PPOEventosRelatoriosController";
import PPOPermissoesVisualizacaoController from "./controllers/PPO/PPOPermissoesVisualizacaoController";
import PreRequisitoController from "./controllers/PreRequisitoController";
import LogsAppConcentradorController from "./controllers/LogsAppConcentrador/LogsAppConcentradorController";
import BotCsnController from "./controllers/BotCsnController";

const routes = Router();

routes.post(
  "/avisos",
  HasPermission("GERENCIAR_AVISOS"),
  AvisosController.create
);
routes.get("/avisos/:id", AvisosController.index);
routes.get("/avisos", AvisosController.search);
routes.get("/avisos/ultimo/id", AvisosController.lastIdAviso);
routes.patch("/avisos/:id", AvisosController.pathUpdate);
routes.put(
  "/avisos/:id",
  HasPermission("GERENCIAR_AVISOS"),
  AvisosController.update
);
routes.delete(
  "/avisos/:id",
  HasPermission("GERENCIAR_AVISOS"),
  AvisosController.delete
);

routes.post("/webhook/autentique", WebhookAutentiqueController.assinado);
routes.post("/webhook/jenkins", WebhookGitHubController.webhook);
routes.get("/credenciais", CredenciaisController.get);
routes.post("/credenciais", CredenciaisController.post);
routes.put("/credenciais/:portal/:user", CredenciaisController.put);
routes.get("/credenciais/:portal/:user", CredenciaisController.index);
routes.delete("/credenciais/:portal/:user", CredenciaisController.delete);

routes.post("/portal/cargas", CargaController.createByImport);

routes.use("/static/", express.static(path.resolve(__dirname, "..", "static")));
routes.use(TokenMiddleware);
routes.use(LogMiddleware);
routes.use(ConvertFieldsToDate);
routes.get("/cargas", CargaController.search);
routes.post("/cargas", CargaController.create);
routes.post("/cargas/derivada/:fk_lote_pai", CargaController.createDerivada);
routes.post(
  "/cargas/importacao",
  multer().single("file"),
  CargaController.importSheet
);
routes.get("/cargaCTE/:id", CargaTecController.indexCTE);
routes.get("/cargas/:id", CargaController.index);
routes.get("/cargas/placa/:plate", CargaController.indexPlate);
routes.put("/cargas/:id", CargaController.update);
routes.patch("/cargas/:id", CargaController.updatePatch);
routes.delete(
  "/cargas/:id",
  HasPermission("DELETAR_CARGAS"),
  CargaController.delete
);

routes.get("/csn/cargas", CargasCsnController.search);
routes.post("/csn/cargas", CargasCsnController.create);
routes.put("/csn/cargas/:id", CargasCsnController.update);
routes.delete("/csn/cargas/:id", CargasCsnController.delete);

routes.put("/csn/cargas/info/:id", CargasCsnInfoController.updateCsn);
routes.get("/csn/cargas/info", CargasCsnInfoController.search);
routes.get("/csn/cargas/info/:id", CargasCsnInfoController.index);
routes.get(
  "/csn/cargas/placa",
  CargasCsnInfoController.indexOfSituacaoEndPlaca
);
routes.get(
  "/csn/relatorio/cargas/info",
  ExportController.generateReportFromCargasInScreenCsn
);

routes.put("/csn/ponto_parada/:id", PontoParadaController.update);
routes.patch("/csn/ponto_parada/:id", PontoParadaController.updatePatch);
routes.post("/csn/ponto_parada", PontoParadaController.create);
routes.get("/csn/ponto_parada", PontoParadaController.serach);
routes.get("/csn/ponto_parada/:id", PontoParadaController.serachPerIdCarga);
routes.delete("/csn/ponto_parada/:id", PontoParadaController.delete);

routes.get("/usuarios", UsuarioController.search);
routes.get("/usuarios/nome", UsuarioController.searchName);
routes.get("/usuarios/:oid", UsuarioController.index);
routes.put(
  "/usuarios/:oid/permissoes",
  HasPermission("ALTERAR_PERMISSOES"),
  UsuarioController.changePermissions
);
routes.put(
  "/usuarios/permissoes/lote",
  HasPermission("ALTERAR_PERMISSOES"),
  UsuarioController.batchPermissions
);
routes.delete(
  "/usuarios/permissoes/lote",
  HasPermission("ALTERAR_PERMISSOES"),
  UsuarioController.deleteAllPermissions
);

routes.get(
  "/relatorio/cargas",
  ExportController.generateReportFromCargasInScreen
);

routes.post(
  "/produtos",
  HasPermission("CADASTRAR_PRODUTOS"),
  ProdutoController.create
);
routes.put(
  "/produtos/:id",
  HasPermission("CADASTRAR_PRODUTOS"),
  ProdutoController.update
);
routes.put(
  "/produtos/:id/ativar",
  HasPermission("CADASTRAR_PRODUTOS"),
  ProdutoController.enable
);
routes.delete(
  "/produtos/:id",
  HasPermission("CADASTRAR_PRODUTOS"),
  ProdutoController.delete
);
routes.get("/produtos", ProdutoController.list);

routes.post(
  "/distancia/:cidade_origem/:estado_origem/:cidade_destino/:estado_destino",
  RotasController.distanceBetweenLocations
);

routes.get("/rotas/pendentes", RotasController.listPendentRoutes);

routes.get("/veiculos/:placa", RotasController.listVehicles);
routes.get("/veiculos/:placa/detalhes", RotasController.detailsVehicle);
routes.get("/veiculos/:placa/debitos", RotasController.debitsVehicle);

routes.get("/recomendacoes/organizacoes", RecomendacoesController.organizacoes);
routes.get("/recomendacoes/locais", RecomendacoesController.cidadeEstados);
routes.get("/recomendacoes/filiais", RecomendacoesController.filiais);
routes.get(
  "/recomendacoes/locais/estado",
  RecomendacoesController.localidadePorEstado
);

routes.get("/situacoes/cargas", SituacoesCargasController.search);
routes.get("/csn/situacoes/cargas", SituacoesCargasCsnController.search);

routes.get(
  "/coordenadas/:placa/range",
  CoordenadasController.listVehiclesInRange
);
routes.get(
  "/coordenadas/:placa/history",
  CoordenadasController.historyTravelVeicleController
);
routes.get(
  "/coordenadas/:placa/history/tempo",
  CoordenadasController.historyTempVeicleController
);
routes.get(
  "/coordenadas/:placa/ultima_posicao_veiculo",
  CoordenadasController.searchLastPositionController
);
routes.get(
  "/coordenadas/:placa/empresa/:cnpj",
  CoordenadasController.searchRouteVehicles
);
routes.get(
  "/coordenadas/empresa/:cnpj",
  CoordenadasController.listVehiclesInRangeEnterprise
);
routes.put("/coordenadas/:placa", CoordenadasController.update);
routes.get("/coordenadas", CoordenadasController.search);
routes.get("/relatorio/coordenadas", CoordenadasController.export);

routes.get("/relatorio/totalizadores", RelatorioController.gerarTotalizadores);
routes.get(
  "/relatorio/totalizadores/:key",
  RelatorioController.detalhesTotalizadores
);
routes.get("/relatorio/resumo_diario", RelatorioController.gerarResumoDiario);
routes.get(
  "/relatorio/media_aprovacao_gr",
  RelatorioController.gerarResumoTempoMedioAtendimentoGr
);

routes.get(
  "/relatorio/producao_veiculo/:placa_veiculo",
  ProducaoController.index
);

routes.post(
  "/eventos/producao",
  HasPermission("REGISTRAR_JUSTIFICATIVA"),
  ProducaoController.createEvent
);

routes.post("/logs", LogsErrorControllers.error);

routes.put("/app/aprovar/carga", CargaAppController.aprovarCarga);
routes.patch("/app/carga:cancelar", CargaAppController.cancelarCarga);

//PPO
routes.get("/ppo/avaliacoes", PPOController.avaliacoes);
routes.get("/ppo/distancia", PPOController.distancia);
routes.get("/ppo/infracoes", PPOController.infracoes);
routes.get("/ppo/interjornadas", PPOController.interjornada);
routes.get("/ppo/atributos", PPOController.atributos);
routes.get("/ppo/demonstrativo", PPOController.demonstrativo);
routes.get(
  "/autentique/ppo/demonstrativo",
  PPOController.demonstrativoAutentique
);
routes.get("/ppo/relatorios/motoristas", PPOController.relatorio);
routes.get("/ppo/relatorios/excel", PPOController.relatorioExcel);
routes.get("/ppo/relatorios/documentos", PPOController.relatorioDocumentos);
routes.get(
  "/ppo/relatorios/documentos/excel",
  PPOController.relatorioDocumentosExcel
);
routes.get("/ppo/motoristas/demonstrativos", PPOController.demonstrativos);
routes.get("/ppo/protheus", PPOController.protheus);
routes.get("/ppo/protheus/txt", PPOController.protheusTxt);

routes.get("/ppo/parametros", PPOParametrosController.index);
routes.post("/ppo/parametros", PPOParametrosController.create);
routes.patch("/ppo/parametros/:id", PPOParametrosController.update);
routes.delete("/ppo/parametros/:id", PPOParametrosController.delete);

routes.get("/ppo/grupos", PPOGruposController.index);
routes.get("/ppo/grupos/termos", PPOGruposController.termos);
routes.post("/ppo/grupos", multer().single("file"), PPOGruposController.create);
routes.patch(
  "/ppo/grupos/:id",
  multer().single("file"),
  PPOGruposController.update
);
routes.delete("/ppo/grupos/:id", PPOGruposController.delete);

routes.get("/ppo/calculador/relatorio", PPOCalculadorController.relatorio);
routes.get("/ppo/calculador/info", PPOCalculadorController.dash);
routes.get("/ppo/calculador", PPOCalculadorController.index);
routes.post("/ppo/calculador", PPOCalculadorController.create);
routes.get("/ppo/calculador/execucao", PPOCalculadorController.emExecucao);
routes.get("/ppo/calculador/blocos", PPOCalculadorController.blocos);

routes.get("/ppo/grupos/parametros", PPOParametrosGrupoController.index);
routes.post("/ppo/grupos/parametros", PPOParametrosGrupoController.create);
routes.patch("/ppo/grupos/parametros/:id", PPOParametrosGrupoController.update);
routes.delete(
  "/ppo/grupos/parametros/:id",
  PPOParametrosGrupoController.delete
);

routes.get(
  "/ppo/permissoes-visualizacao/users",
  PPOPermissoesVisualizacaoController.getAllUsers
);
routes.post(
  "/ppo/permissoes-visualizacao",
  PPOPermissoesVisualizacaoController.create
);

routes.get(
  "/ppo/permissoes-visualizacao",
  PPOPermissoesVisualizacaoController.index
);

routes.delete(
  "/ppo/permissoes-visualizacao/users/:uid/grupos/:id",
  PPOPermissoesVisualizacaoController.delete
);

routes.delete(
  "/ppo/permissoes-visualizacao/users/:uid",
  PPOPermissoesVisualizacaoController.deleteUser
);

routes.put(
  "/ppo/permissoes-visualizacao/users/:uid",
  PPOPermissoesVisualizacaoController.updateUser
);

routes.get("/ppo/motoristas/grupos", PPOController.motorista_by_grupo);

routes.get(
  "/ppo_eventos/permissoes/users",
  PPOEventosPermissoesController.getAllUsers
);

routes.get("/ppo_eventos/permissoes", PPOEventosPermissoesController.index);

routes.post("/ppo_eventos/permissoes", PPOEventosPermissoesController.create);
routes.delete(
  "/ppo_eventos/permissoes/users/:oid",
  PPOEventosPermissoesController.deleteUser
);

routes.put(
  "/ppo_eventos/permissoes/users/:oid",
  PPOEventosPermissoesController.updateUser
);

routes.get("/ppo_eventos/aprovacoes", PPOEventosAprovacaoController.index);
routes.put("/ppo_eventos/aprovacoes/:id", PPOEventosAprovacaoController.update);

routes.get(
  "/ppo_eventos/relatorios/aprovacoes",
  PPOEventosRelatoriosController.relatorioAprovacoes
);

routes.get(
  "/ppo_eventos/relatorios/aprovacoes/excel",
  PPOEventosRelatoriosController.relatorioAprovacoesExcel
);

routes.get(
  "/ppo_eventos/relatorios/eventos",
  PPOEventosRelatoriosController.relatorioEventos
);

routes.get(
  "/ppo_eventos/relatorios/eventos/excel",
  PPOEventosRelatoriosController.relatorioEventosExcel
);

routes.get(
  "/ppo_eventos/aprovacoes/detalhes",
  PPOEventosAprovacaoController.detalhes
);

routes.get("/pre-requisito", PreRequisitoController.list);
routes.post("/pre-requisito", PreRequisitoController.create);
routes.put("/pre-requisito/:id", PreRequisitoController.update);

routes.post("/logs/app/integracao", LogsAppConcentradorController.create);
routes.get("/logs/app/integracao/info", LogsAppConcentradorController.info);
routes.get(
  "/logs/app/integracao/relatorio",
  LogsAppConcentradorController.relatorio
);
routes.get("/bot/locais", BotCsnController.locais);
routes.get("/bot/postos", BotCsnController.postos);
routes.get("/bot/operacoes", BotCsnController.operacoes);
routes.get("/bot/operacoes/veiculos", BotCsnController.operacoesVeiculos);
routes.get("/bot/posicoes", BotCsnController.posicoes);

export default routes;
