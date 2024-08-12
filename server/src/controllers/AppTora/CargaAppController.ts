import { Request, Response } from "express";
import domainAppCarga from "../../domain/AppTora/UseCaseCartaApp";

interface ICargaAppController {
  aprovarCarga(req: Request, res: Response): Promise<Response>;
  cancelarCarga(req: Request, res: Response): Promise<Response>;
}

class CargaAppController implements ICargaAppController {
  async aprovarCarga(req: Request, res: Response): Promise<Response> {
    const result = await domainAppCarga.useCaseAprovacaoCargaApp.run(
      req.body,
      String(req.headers.authorization)
    );
    return res.status(201).json({ data: result });
  }
  async cancelarCarga(req: Request, res: Response): Promise<Response> {
    const result = await domainAppCarga.useCaseAppCancelarCarga.run(req.body);
    return res.status(200).json({ data: result });
  }
}

export default new CargaAppController();
