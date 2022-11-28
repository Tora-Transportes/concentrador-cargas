import { PontoParadaRepository } from "../../../repositories/PontoParadaRepository";
import { notifyAll } from "../../../socketsRoutes";
import { CargaCsnRepository } from "../../../repositories/csn/CargaCsnRepository";
import {
  UseCaseAddRouter,
  UseCaseDeleteRouter,
  UseCaseSearchRouter,
  UseCaseUpdateRouter,
} from "./entities";

const cargasCsnrepository = new CargaCsnRepository();
const pontoParadaRepository = new PontoParadaRepository();

const modules = {
  useCaseAddRota: new UseCaseAddRouter(cargasCsnrepository),
  useCaseSearchRouter: new UseCaseSearchRouter(cargasCsnrepository),
  useCaseUpdateRouter: new UseCaseUpdateRouter(cargasCsnrepository, notifyAll),
  useCaseDeleteRouter: new UseCaseDeleteRouter(
    cargasCsnrepository,
    pontoParadaRepository,
    notifyAll
  ),
};

export default modules;
