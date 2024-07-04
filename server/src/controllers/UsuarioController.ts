import { Request, Response } from "express";
import {
  UseCaseViewUsuario,
  UseCaseUpdateUsuario,
  UseCaseSearchName,
  UseCaseBatchPermissions,
  UseCaseDeleteAllPermissions,
} from "../domain/UseCaseUsuario";

class UsuarioController {
  async search(req: Request, res: Response) {
    const { q } = req.query;
    const searchResult = await new UseCaseViewUsuario().run(
      {
        query: String(q),
      },
      true
    );

    return res.json({ data: searchResult });
  }
  async searchName(req: Request, res: Response) {
    const { q } = req.query;
    const searchResult = await new UseCaseSearchName().run({
      query: String(q),
    });

    return res.json({ data: searchResult });
  }

  async index(req: Request, res: Response) {
    const { oid } = req.params;
    const user = (await new UseCaseViewUsuario().run({ oid }, false))
      .results[0];
    return res.json({ data: user });
  }

  async changePermissions(req: Request, res: Response) {
    const { oid } = req.params;
    const { permissoes } = req.body;
    const user = await new UseCaseUpdateUsuario().run({
      oid,
      permissoes,
    });
    return res.json({ data: user });
  }

  async batchPermissions(req: Request, res: Response) {
    const { permissoes } = req.body;
    const result = await new UseCaseBatchPermissions().run(permissoes);
    return res.json({ data: result });
  }
  async deleteAllPermissions(req: Request, res: Response) {
    const { permissoes } = req.body;
    const result = await new UseCaseDeleteAllPermissions().run(permissoes);
    return res.json({ data: result });
  }
}

export default new UsuarioController();
