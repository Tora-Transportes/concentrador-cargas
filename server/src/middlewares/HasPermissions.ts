import { NextFunction, Request, Response } from "express";
import { ViewUsuarioRepository } from "../repositories/UsuarioRepository";
import TokenAd from "../models/TokenAd";
import AppError from "../models/AppError";

export default function (permissao: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = String(req.headers.authorization);
    const oid = TokenAd.getClaims(token).oid;
    const users = await new ViewUsuarioRepository().run({ oid });
    if (!users) {
      throw new AppError("Erro ao encontrar usuario", 500);
    }
    if (!users.results[0]?.permissoes.includes(permissao)) {
      throw new AppError(`Usuário não possui a permissão '${permissao}'`, 403);
    }

    return next();
  };
}
