import { notifyAll } from "../../socketsRoutes";
import { CargaCsnRepository } from "./../../repositories/CargaCsnRepository";
import {
  UseCaseAddRouter,
  UseCaseDeleteRouter,
  UseCaseSearchRouter,
  UseCaseUpdateRouter,
} from "./entities";

const cargasCsnrepository = new CargaCsnRepository();

const modules = {
  useCaseAddRota: new UseCaseAddRouter(cargasCsnrepository, notifyAll),
  useCaseSearchRouter: new UseCaseSearchRouter(cargasCsnrepository),
  useCaseUpdateRouter: new UseCaseUpdateRouter(cargasCsnrepository, notifyAll),
  useCaseDeleteRouter: new UseCaseDeleteRouter(cargasCsnrepository, notifyAll),
};

export default modules;
