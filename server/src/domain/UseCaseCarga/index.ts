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
  UseCaseDisableCarga,
} from "./entities";
import { PreRequisitosCargaRepository } from "../../repositories/PreRequisitosCargaRepository";

const userRepository = new UsuarioRepository();
const cargaRepository = new CargaRepository();
const clientRepository = new ClientRepository();
const paradaRepository = new ParadasRepository();
const preRequisitoCargaRepository = new PreRequisitosCargaRepository();
const cargaCsnInfoRepository = new CargaCsnInfoRepository();

const modules = {
  UseCaseAddCarga: new UseCaseAddCarga(
    cargaRepository,
    notifyAll,
    userRepository,
    paradaRepository,
    preRequisitoCargaRepository,
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
    preRequisitoCargaRepository,
    cargaCsnInfoRepository
  ),
  UseCaseUpdateCargaPatch: new UseCaseUpdateCargaPath(
    cargaRepository,
    cargaCsnInfoRepository,
    notifyAll
  ),
  UseCaseViewCargas: new UseCaseViewCargas(cargaRepository),
  UseCaseDeleteCarga: new UseCaseDeleteCarga(cargaRepository, notifyAll),
  UseCaseDisableCarga: new UseCaseDisableCarga(cargaRepository, notifyAll),
  UseCaseImportCarga: new UseCaseImportCarga(
    cargaRepository,
    notifyAll,
    clientRepository
  ),
  UseCaseViewCargasCTE: new UseCaseViewCargasCTE(cargaRepository),
};

export default modules;
