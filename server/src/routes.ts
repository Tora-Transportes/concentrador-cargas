import { Router } from "express";

import CargaController from "./controllers/CargaController";
import UsuarioController from "./controllers/UsuarioController";
import TokenMiddleware from "./middlewares/Token";
import ConvertFieldsToDate from "./middlewares/ConvertFieldsToDate";
import ExportController from "./controllers/ExportController";
import ProdutoController from "./controllers/ProdutoController";
import RecomendacoesController from "./controllers/RecomendacoesController";

const routes = Router();

routes.use(TokenMiddleware);
routes.use(ConvertFieldsToDate);
routes.get("/cargas", CargaController.search);
routes.post("/cargas", CargaController.create);
routes.get("/cargas/:id", CargaController.index);
routes.put("/cargas/:id", CargaController.update);
routes.delete("/cargas/:id", CargaController.delete);

routes.get("/usuarios", UsuarioController.search);
routes.get("/usuarios/:oid", UsuarioController.index);
routes.put("/usuarios/:oid/permissoes", UsuarioController.changePermissions);

routes.get(
  "/relatorio/cargas",
  ExportController.generateReportFromCargasInScreen
);

routes.post("/produtos", ProdutoController.create);
routes.get("/produtos", ProdutoController.list);

routes.get("/recomendacoes/organizacoes", RecomendacoesController.organizacoes);
export default routes;
