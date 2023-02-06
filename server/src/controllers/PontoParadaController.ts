import { Request, Response } from "express";
import useCases from "../domain/UseCasePontoParadas";

interface IPontoParadaController {
  create(req: Request, res: Response): Promise<Response>;
  serach(_req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
}

class PontoParadaController implements IPontoParadaController {
  async create(req: Request, res: Response): Promise<Response> {
    const result = await useCases.useCaseAddPontoParadas.run(req.body);

    return res.json({ data: result });
  }
  async serach(_req: Request, res: Response): Promise<Response> {
    const result = await useCases.useCaseSearchPontoParada.run();

    return res.json({ data: result });
  }
  async serachPerIdCarga(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await useCases.useCaseSearchPontoParadaIdCarga.run(
      Number(id)
    );

    return res.json({ data: result });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const result = await useCases.useCaseUpdatePontoParadasRota.run(
      Number(id),
      req.body
    );
    return res.json({ data: result });
  }

  async updatePatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const result = await useCases.useCaseUpdatePontoParadaPartial.run(
      Number(id),
      req.body
    );
    return res.json({ data: result });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const result = await useCases.useCaseDeletePontoParada.run(Number(id));
    return res.json({ data: result });
  }
}

export default new PontoParadaController();
