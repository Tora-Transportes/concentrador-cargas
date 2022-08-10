import { Request, Response } from "express";
//import AppError from "../models/AppError";
import useCasesCarga from "../domain/UseCaseCarga";

class CargaCteController {
  async indexCTE(req: Request, res: Response) {
    const { id } = req.params;
    const result = await useCasesCarga.UseCaseViewCargasCTE.run(String(id));
    return res.json({ data: result });
  }
}

export default new CargaCteController();
