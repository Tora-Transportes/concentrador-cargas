import { Router } from "express";
// import database from "./database";
import CargaController from "./controllers/CargaController";
import TokenMiddleware from "./middlewares/Token";
import ConvertFieldsToDate from "./middlewares/ConvertFieldsToDate";

const routes = Router();

routes.use(TokenMiddleware);
routes.use(ConvertFieldsToDate);
routes.get("/cargas", CargaController.search);
routes.post("/cargas", CargaController.create);
routes.get("/cargas/:id", CargaController.index);
routes.put("/cargas/:id", CargaController.update);
routes.delete("/cargas/:id", CargaController.delete);

export default routes;
