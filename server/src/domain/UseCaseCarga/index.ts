import { CargaCsnInfoRepository } from "./../../repositories/csn/CargaCsnInfoRepository";
import { UsuarioRepository } from "../../repositories/UsuarioRepository";
import { notifyAll } from "../../socketsRoutes";

import { CargaRepository } from "../../repositories/CargaRepository";
import ServiceMigrarSIT from "../../services/ServiceMigrarSIT";
import { ClientRepository } from "../../repositories/ClientRepository";
import { ParadasRepository } from "../../repositories/ParadasRepository";
import ServiceLogTime from "../../services/ServiceLogTime";

import {
  UseCaseAddCarga,
  UseCaseAddCargaDerivada,
  UseCaseUpdateCarga,
  UseCaseUpdateCargaPath,
  UseCaseViewCargas,
  UseCaseDeleteCarga,
  UseCaseImportCarga,
  UseCaseViewCargasCTE,
} from "./entities";

const userRepository = new UsuarioRepository();
const cargaRepository = new CargaRepository();
const clientRepository = new ClientRepository();
const paradaRepository = new ParadasRepository();
const cargaCsnInfoRepository = new CargaCsnInfoRepository();

const modules = {
  UseCaseAddCarga: new UseCaseAddCarga(
    cargaRepository,
    notifyAll,
    userRepository,
    paradaRepository,
    cargaCsnInfoRepository
  ),
  UseCaseAddCargaDerivada: new UseCaseAddCargaDerivada(
    cargaRepository,
    notifyAll,
    paradaRepository
  ),
  UseCaseUpdateCarga: new UseCaseUpdateCarga(
    cargaRepository,
    userRepository,
    notifyAll,
    ServiceMigrarSIT,
    ServiceLogTime,
    paradaRepository,
    cargaCsnInfoRepository
  ),
  UseCaseUpdateCargaPatch: new UseCaseUpdateCargaPath(
    cargaRepository,
    cargaCsnInfoRepository,
    notifyAll
  ),
  UseCaseViewCargas: new UseCaseViewCargas(cargaRepository),
  UseCaseDeleteCarga: new UseCaseDeleteCarga(cargaRepository, notifyAll),
  UseCaseImportCarga: new UseCaseImportCarga(
    cargaRepository,
    notifyAll,
    clientRepository
  ),
  UseCaseViewCargasCTE: new UseCaseViewCargasCTE(cargaRepository),
};

export default modules;
