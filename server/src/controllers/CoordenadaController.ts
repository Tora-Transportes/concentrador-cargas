import { Request, Response } from "express";
import xlsx from "xlsx";
import os from "os";
import path from "path";
import fs from "fs";

import useCases from "../domain/UseCaseCoordenada";
import TokenAd from "../models/TokenAd";
import { ServiceDistanceLocations } from "../services/ServiceDistanceLocations";
import AppError from "../models/AppError";
import { calculateDiffDate } from "../Utils/formatData";

class CoordenadasController {
  async search(req: Request, res: Response) {
    const pageSize = isNaN(Number(req.query.limit))
      ? 5
      : Number(req.query.limit);
    const result = await useCases.UseCaseViewCoordenada.run(
      req.query,
      pageSize
    );
    return res.json({
      data: result,
    });
  }

  async export(req: Request, res: Response) {
    const data = await useCases.UseCaseViewCoordenada.run(
      req.query,
      9999999999
    );

    const filename = path.resolve(
      os.tmpdir(),
      `RELATORIO_COORDENADAS-${new Date().getTime()}.xlsx`
    );

    const workbook = xlsx.utils.book_new();
    for (const i of data.results) {
      if (!i.categoria_veiculo) continue;
      switch (i.categoria_veiculo) {
        case "A":
          i.categoria_veiculo = "Agregado";
          break;
        case "C":
          i.categoria_veiculo = "Carreteiro";
          break;
        case "F":
          i.categoria_veiculo = "Frota";
          break;
      }
    }
    const sheet = xlsx.utils.json_to_sheet(data.results);
    xlsx.utils.book_append_sheet(workbook, sheet);

    xlsx.writeFile(workbook, filename, {
      bookType: "xlsx",
      type: "binary",
    });

    const stream = fs.createReadStream(filename);
    stream.pipe(res);
    if (fs.existsSync(filename)) fs.unlinkSync(filename);
    return res;
  }

  async update(req: Request, res: Response) {
    const { placa } = req.params;
    const { observacao, responsavel_placa, data_janela } = req.body;
    const { oid } = TokenAd.getClaims(String(req.headers.authorization));
    const objeto = await useCases.UseCaseUpdateDadosCoordenada.run(
      placa,
      { observacao, responsavel_placa, data_janela },
      oid
    );
    return res.json({
      fk_placa: placa,
      ...objeto,
    });
  }

  async listVehiclesInRange(req: Request, res: Response) {
    const placa = req.params.placa;
    const { distancia_km } = req.query;
    if (placa.length < 7) {
      throw new AppError("Placa inválida", 400);
    }

    if (!distancia_km || isNaN(Number(distancia_km))) {
      throw new AppError(
        "Query param distancia_km inválido ou não informado",
        400
      );
    }

    const service = new ServiceDistanceLocations();
    const veiculos = await service.listVehiclesInRange(
      placa,
      Number(distancia_km)
    );

    return res.json(veiculos);
  }

  async listVehiclesInRangeEnterprise(req: Request, res: Response) {
    const { distancia_km } = req.query;
    const { cnpj } = req.params;
    if (cnpj.length < 14) {
      throw new AppError("CNPJ inválido", 400);
    }

    if (!distancia_km || isNaN(Number(distancia_km))) {
      throw new AppError(
        "Query param distancia_km inválido ou não informado",
        400
      );
    }

    const service = new ServiceDistanceLocations();
    const veiculos = await service.listVehiclesInRangeEnterprise(
      cnpj,
      Number(distancia_km)
    );

    return res.json(veiculos);
  }

  async searchRouteVehicles(req: Request, res: Response) {
    const { cnpj, placa } = req.params;
    if (placa.length < 7) {
      throw new AppError("Placa inválida", 400);
    }
    // if (cnpj.length < 14) {
    //   throw new AppError("CNPJ inválido", 400);
    // }

    const service = new ServiceDistanceLocations();
    const veiculos = await service.searchRouteToEnterprise(placa, cnpj);

    return res.json(veiculos);
  }

  async historyTravelVeicleController(req: Request, res: Response) {
    const { placa } = req.params;
    const { date_inicio, date_fim } = req.query;

    if (placa.length !== 7) {
      throw new AppError("Placa inválida", 400);
    }

    if (!date_inicio || !date_fim) {
      throw new AppError(
        "Query param date_inicio ou date_fim não informado",
        400
      );
    } else {
      const diferencaDate = await calculateDiffDate(
        String(date_inicio),
        String(date_fim)
      );

      if (diferencaDate > 7) {
        throw new AppError(
          "O período entre as datas não pode ser maior que 07 dias.",
          400
        );
      }
    }

    const service = new ServiceDistanceLocations();
    const hitoryVeicle = await service.historyTravelVeicleService(
      placa,
      String(date_inicio),
      String(date_fim)
    );

    return res.json(hitoryVeicle);
  }
  async historyTempVeicleController(req: Request, res: Response) {
    const { placa } = req.params;
    const { date_inicio, date_fim } = req.query;

    const service = new ServiceDistanceLocations();
    const hitoryVeicle = await service.historyTempVeicleService(
      placa,
      String(date_inicio),
      String(date_fim)
    );

    return res.json(hitoryVeicle);
  }

  async searchLastPositionController(req: Request, res: Response) {
    const { placa } = req.params;
    const service = new ServiceDistanceLocations();
    const lastPositionVeicle = await service.lastPositionService(String(placa));

    if (!lastPositionVeicle) {
      throw new AppError(" ", 204);
    }

    return res.json(lastPositionVeicle);
  }
}

export default new CoordenadasController();
