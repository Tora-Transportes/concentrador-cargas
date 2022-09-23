import { Request, Response } from "express";
import AppError from "../models/AppError";
import ServiceProducao from "../services/ServiceProducao";
import zlib from "zlib";
import Cache from "../services/Cache";

class ProducaoController {
  async index(req: Request, res: Response) {
    const { placa_veiculo } = req.params;
    if (!placa_veiculo) {
      throw new AppError("Código do veículo inválido", 400);
    }

    const allowGzip = req.headers["accept-encoding"]?.indexOf("gzip") !== -1;
    res.setHeader("Content-type", "application/json");

    if (Cache.has(placa_veiculo)) {
      if (allowGzip) {
        res.setHeader("Content-Encoding", "gzip");
        return res.send(Cache.get(placa_veiculo));
      }

      const unziped = await new Promise((resolve) => {
        zlib.gunzip(
          Buffer.from(Cache.get(placa_veiculo) as ArrayBuffer),
          function (error, data) {
            if (!error) {
              resolve(data);
            }
          }
        );
      });
      return res.send(unziped);
    }

    console.time("Pegando dados");
    const data = await ServiceProducao.index(placa_veiculo);
    console.timeEnd("Pegando dados");

    console.time("Zipando dados");
    const json = JSON.stringify({ data });
    const gzip = await new Promise<Buffer>((resolve, reject) =>
      zlib.gzip(
        Buffer.from(json),
        { level: zlib.constants.Z_BEST_COMPRESSION },
        function (error, data) {
          if (error) {
            return reject(error);
          }
          return resolve(data);
        }
      )
    );
    const ALL_DAY_IN_SECONDS = 86400;
    Cache.set(placa_veiculo, gzip, ALL_DAY_IN_SECONDS);
    console.timeEnd("Zipando dados");

    if (allowGzip) {
      res.setHeader("Content-Encoding", "gzip");
      return res.send(gzip);
    }

    return res.json({ data });
  }

  async createEvent(req: Request, res: Response) {
    const { codigo_veiculo, data_inicio, data_final, conteudo } = req.body;
    if (!codigo_veiculo || !data_inicio || !data_final || !conteudo) {
      throw new AppError(
        "Evento em formato inválido, nenhum valor pode ser Falsy",
        400
      );
    }
    const id = await ServiceProducao.nextId();
    const evento = { codigo_veiculo, data_inicio, data_final, conteudo, id };

    await ServiceProducao.createEvent(evento);
    Cache.del(await ServiceProducao.getPlaca(codigo_veiculo));
    return res.json({ data: evento });
  }
}

export default new ProducaoController();
