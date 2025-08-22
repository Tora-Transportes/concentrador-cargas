import { PontoParadaRepository } from "./../../../repositories/PontoParadaRepository";
import {
  UseCaseViewCargasCsnInfo,
  UseCaseViewCargasCsn,
  UseCaseUpdateInfoCarga,
} from "./entities";
import { CargaCsnInfoRepository } from "../../../repositories/csn/CargaCsnInfoRepository";
import { CargaRepository } from "../../../repositories/CargaRepository";
import { UseCaseUpdateCarga } from "../../UseCaseCarga/entities";
import { notifyAll } from "../../../socketsRoutes";
import ServiceMigrarSIT from "../../../services/ServiceMigrarSIT";
import ServiceLogTime from "../../../services/ServiceLogTime";
import { ParadasRepository } from "../../../repositories/ParadasRepository";
import { UsuarioRepository } from "../../../repositories/UsuarioRepository";
import { UseCaseUpdatePontoParada } from "../../UseCasePontoParadas";
import { PreRequisitosCargaRepository } from "../../../repositories/PreRequisitosCargaRepository";

const cargaCsnInfoRepository = new CargaCsnInfoRepository();
const cargaRepository = new CargaRepository();
const userRepository = new UsuarioRepository();
const paradaRepository = new ParadasRepository();
const preRequisitoCargaRepository = new PreRequisitosCargaRepository();
const pontoParadaRepository = new PontoParadaRepository();
const useCaseUpdatePontoParada = new UseCaseUpdatePontoParada(
  pontoParadaRepository
);
const UseCaseUpdateCargaPadrao = new UseCaseUpdateCarga(
  cargaRepository,
  userRepository,
  notifyAll,
  ServiceMigrarSIT,
  ServiceLogTime,
  paradaRepository,
  preRequisitoCargaRepository,
  cargaCsnInfoRepository
);

const modules = {
  UseCaseAddCargaCsn: new UseCaseViewCargasCsnInfo(cargaCsnInfoRepository),
  UseCaseViewCargasCsn: new UseCaseViewCargasCsn(cargaCsnInfoRepository),
  UseCaseUpdateInfoCarga: new UseCaseUpdateInfoCarga(
    useCaseUpdatePontoParada,
    UseCaseUpdateCargaPadrao,
    pontoParadaRepository
  ),
};

export default modules;
