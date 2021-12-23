import { UsuarioRepository } from "../../repositories/UsuarioRepository";
import { notifyAll } from "../../socketsRoutes";

import { CargaRepository } from "../../repositories/CargaRepository";
import ServiceMigrarSIT from "../../services/ServiceMigrarSIT";

import {
  UseCaseAddCarga,
  UseCaseAddCargaDerivada,
  UseCaseUpdateCarga,
  UseCaseViewCargas,
  UseCaseDeleteCarga,
  UseCaseImportCarga,
} from "./entities";

const userRepository = new UsuarioRepository();
const cargaRepository = new CargaRepository();

const modules = {
  UseCaseAddCarga: new UseCaseAddCarga(cargaRepository, notifyAll),
  UseCaseAddCargaDerivada: new UseCaseAddCargaDerivada(
    cargaRepository,
    notifyAll
  ),
  UseCaseUpdateCarga: new UseCaseUpdateCarga(
    cargaRepository,
    userRepository,
    notifyAll,
    ServiceMigrarSIT
  ),
  UseCaseViewCargas: new UseCaseViewCargas(cargaRepository),
  UseCaseDeleteCarga: new UseCaseDeleteCarga(cargaRepository, notifyAll),
  UseCaseImportCarga: new UseCaseImportCarga(cargaRepository),
};

export default modules;
