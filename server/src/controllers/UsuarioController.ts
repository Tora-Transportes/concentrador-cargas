import { Request, Response } from "express";
import {
  UseCaseViewUsuario,
  UseCaseUpdateUsuario,
} from "../domain/UseCaseUsuario";

class UsuarioController {
  async search(req: Request, res: Response) {
    const { q } = req.query;
    const searchResult = await new UseCaseViewUsuario().run({
      query: String(q),
    });

    return res.json({ data: searchResult });
  }

  async index(req: Request, res: Response) {
    const { oid } = req.params;
    const user = (await new UseCaseViewUsuario().run({ oid })).results[0];
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
}

export default new UsuarioController();
