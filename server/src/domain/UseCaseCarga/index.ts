import { UsuarioRepository } from "../../repositories/UsuarioRepository";
import { notifyAll } from "../../socketsRoutes";

import { CargaRepository } from "../../repositories/CargaRepository";
import ServiceMigrarSIT from "../../services/ServiceMigrarSIT";
import { ClientRepository } from "../../repositories/ClientRepository";
import ServiceLogTime from "../../services/ServiceLogTime";

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
const clientRepository = new ClientRepository();

const modules = {
  UseCaseAddCarga: new UseCaseAddCarga(
    cargaRepository,
    notifyAll,
    userRepository
  ),
  UseCaseAddCargaDerivada: new UseCaseAddCargaDerivada(
    cargaRepository,
    notifyAll
  ),
  UseCaseUpdateCarga: new UseCaseUpdateCarga(
    cargaRepository,
    userRepository,
    notifyAll,
    ServiceMigrarSIT,
    ServiceLogTime
  ),
  UseCaseViewCargas: new UseCaseViewCargas(cargaRepository),
  UseCaseDeleteCarga: new UseCaseDeleteCarga(cargaRepository, notifyAll),
  UseCaseImportCarga: new UseCaseImportCarga(
    cargaRepository,
    notifyAll,
    clientRepository
  ),
};

export default modules;
