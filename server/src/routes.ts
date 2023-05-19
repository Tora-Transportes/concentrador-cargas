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
import EngateControllers from "./controllers/EngateControllers";

const routes = Router();
const upload = multer({ dest: "uploads/" });

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
routes.get("/veiculos/:placa/manutencao", RotasController.maintenanceVehicle);

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

routes.post("/engate", upload.single("fileName"), EngateControllers.create);
routes.get("/engate", EngateControllers.searchAll);
routes.put("/engate/:id", EngateControllers.update);

routes.put("/app/aprovar/carga", CargaAppController.aprovarCarga);
routes.patch("/app/cancelar/carga", CargaAppController.cancelarCarga);
export default routes;
