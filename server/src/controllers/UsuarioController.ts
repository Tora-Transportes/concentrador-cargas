import { Request, Response } from "express";
import { ServiceUsuarios } from "../services/ServiceUsuarios";
import TokenAd from "../models/TokenAd";

class UsuarioController {
  async search(req: Request, res: Response) {
    const { q, page } = req.query;

    const service = new ServiceUsuarios();
    const searchResult = await service.search(String(q), Number(page));

    return res.json({ data: searchResult });
  }

  async index(req: Request, res: Response) {
    const { oid } = req.params;
    const service = new ServiceUsuarios();
    const user = await service.index(oid);
    return res.json({ data: user });
  }

  async changePermissions(req: Request, res: Response) {
    const adminOid = TokenAd.getClaims(req.headers.authorization || "").oid;
    const { oid } = req.params;
    const { permissoes } = req.body;
    const service = new ServiceUsuarios();
    const createdPermissions = await service.changePermissions({
      targetOid: oid,
      permissions: permissoes,
      adminOid,
    });
    return res.json({ data: createdPermissions });
  }
}

export default new UsuarioController();
