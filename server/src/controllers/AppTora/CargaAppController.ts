import { Request, Response } from "express";
import domainAppCarga from "../../domain/AppTora/UseCaseCartaApp";

interface ICargaAppController {
  aprovarCarga(req: Request, res: Response): Promise<Response>;
}

class CargaAppController implements ICargaAppController {
  async aprovarCarga(req: Request, res: Response): Promise<Response> {
    const result = await domainAppCarga.useCaseAprovacaoCargaApp.run(req.body);
    return res.status(201).json({ data: result });
  }
}

export default new CargaAppController();
