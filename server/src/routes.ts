import { Router } from "express";
// import database from "./database";
import CargaController from "./controllers/CargaController";
import TokenMiddleware from "./middlewares/Token";

const routes = Router();

routes.use(TokenMiddleware);
routes.get("/cargas/:id", CargaController.index);
routes.post("/cargas", CargaController.create);
routes.put("/cargas/:id", CargaController.update);
routes.delete("/cargas/:id", CargaController.delete);

export default routes;
