import { UseCaseViewCargasCsnInfo, UseCaseViewCargasCsn } from "./entities";
import { CargaCsnInfoRepository } from "../../../repositories/csn/CargaCsnInfoRepository";

const cargaCsnInfoRepository = new CargaCsnInfoRepository();

const modules = {
  UseCaseAddCargaCsn: new UseCaseViewCargasCsnInfo(cargaCsnInfoRepository),
  UseCaseViewCargasCsn: new UseCaseViewCargasCsn(cargaCsnInfoRepository),
};

export default modules;
