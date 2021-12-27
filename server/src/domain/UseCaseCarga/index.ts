import { UsuarioRepository } from "../../repositories/UsuarioRepository";
import { notifyAll } from "../../socketsRoutes";

import { CargaRepository } from "../../repositories/CargaRepository";
import ServiceMigrarSIT from "../../services/ServiceMigrarSIT";

import { VeiculoRepository } from "../../repositories/VeiculoRepository";

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
const veiculoRepository = new VeiculoRepository();

const modules = {
  UseCaseAddCarga: new UseCaseAddCarga(
    cargaRepository,
    notifyAll,
    veiculoRepository
  ),
  UseCaseAddCargaDerivada: new UseCaseAddCargaDerivada(
    cargaRepository,
    notifyAll,
    veiculoRepository
  ),
  UseCaseUpdateCarga: new UseCaseUpdateCarga(
    cargaRepository,
    userRepository,
    notifyAll,
    ServiceMigrarSIT,
    veiculoRepository
  ),
  UseCaseViewCargas: new UseCaseViewCargas(cargaRepository),
  UseCaseDeleteCarga: new UseCaseDeleteCarga(cargaRepository, notifyAll),
  UseCaseImportCarga: new UseCaseImportCarga(cargaRepository),
};

export default modules;
