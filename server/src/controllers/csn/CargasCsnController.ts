import { Request, Response } from "express";
import useCasesCargaCsn from "../../domain/csn/UseCaseCargaCsn";

interface CargasCsnController {
  create(req: Request, res: Response): Promise<Response>;
}

class CargasCsnController implements CargasCsnController {
  async create(req: Request, res: Response): Promise<Response> {
    const result = await useCasesCargaCsn.useCaseAddRota.run(req.body);
    return res.json({
      data: result,
    });
  }

  async search(_req: Request, res: Response) {
    //const result = await useCasesCargaCsn.useCaseSearchRouter.run(req.query);
    const result = await useCasesCargaCsn.useCaseSearchRouter.run();
    return res.json({ data: result });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    const result = await useCasesCargaCsn.useCaseUpdateRouter.run(
      Number(id),
      req.body
    );
    return res.json({ data: result });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const result = await useCasesCargaCsn.useCaseDeleteRouter.run(Number(id));
    return res.json({ data: result });
  }
}

export default new CargasCsnController();
