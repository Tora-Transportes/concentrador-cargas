import { Request, Response } from "express";
import useCases from "../domain/UseCaseCoordenada";
import xlsx from "xlsx";
import os from "os";
import path from "path";
import fs from "fs";
import TokenAd from "../models/TokenAd";

class CoordenadasController {
  async search(req: Request, res: Response) {
    const pageSize = isNaN(Number(req.query.limit))
      ? 5
      : Number(req.query.limit);
    return res.json({
      data: await useCases.UseCaseViewCoordenada.run(req.query, pageSize),
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
    fs.unlinkSync(filename);
    return res;
  }

  async update(req: Request, res: Response) {
    const { placa } = req.params;
    const { observacao, responsavel_placa } = req.body;
    const { oid } = TokenAd.getClaims(String(req.headers.authorization));
    const objeto = await useCases.UseCaseUpdateDadosCoordenada.run(
      placa,
      { observacao, responsavel_placa },
      oid
    );
    return res.json({
      fk_placa: placa,
      ...objeto,
    });
  }
}

export default new CoordenadasController();
