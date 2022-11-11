import { Request, Response } from "express";
import useCases from "../domain/UseCasePontoParadas";

interface IPontoParadaController {
  create(req: Request, res: Response): Promise<Response>;
}

class PontoParadaController implements IPontoParadaController {
  async create(req: Request, res: Response): Promise<Response> {
    const result = await useCases.useCaseAddPontoParadas.run(req.body);

    return res.json({ data: result });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    const result = await useCases.useCaseUpdatePontoParadas.run(
      Number(id),
      req.body
    );
    return res.json({ data: result });
  }
}

export default new PontoParadaController();
