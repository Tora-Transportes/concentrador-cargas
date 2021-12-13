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

const routes = Router();

routes.use("/static/", express.static(path.resolve(__dirname, "..", "static")));
routes.use(LogMiddleware);
routes.use(TokenMiddleware);
routes.use(ConvertFieldsToDate);
routes.get("/cargas", CargaController.search);
routes.post("/cargas", CargaController.create);
routes.post("/cargas/derivada/:fk_lote_pai", CargaController.createDerivada);
routes.post(
  "/cargas/importacao",
  multer().single("file"),
  CargaController.importSheet
);
routes.get("/cargas/:id", CargaController.index);
routes.put("/cargas/:id", CargaController.update);
routes.delete(
  "/cargas/:id",
  HasPermission("DELETAR_CARGAS"),
  CargaController.delete
);

routes.get("/usuarios", UsuarioController.search);
routes.get("/usuarios/:oid", UsuarioController.index);
routes.put(
  "/usuarios/:oid/permissoes",
  HasPermission("ALTERAR_PERMISSOES"),
  UsuarioController.changePermissions
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

routes.get("/recomendacoes/organizacoes", RecomendacoesController.organizacoes);
routes.get("/recomendacoes/locais", RecomendacoesController.cidadeEstados);

export default routes;
