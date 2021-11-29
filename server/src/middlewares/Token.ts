import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../models/AppError";
import database from "../database";

interface IJwtClaims {
  oid: string;
  name: string;
  unique_name: string;
}

export default async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    throw new AppError("O Token do usuário não foi informado", 401);
  }

  try {
    const { oid, name, unique_name } = <IJwtClaims>(
      jwt.verify(
        req.headers.authorization,
        "-----BEGIN CERTIFICATE-----\n" +
          process.env.JWT_AZURE_PUBLIC_KEY +
          "\n-----END CERTIFICATE-----"
      )
    );

    const user = await database("con_usuarios")
      .select(["oid", "nome", "email"])
      .first()
      .where("oid", oid);

    if (user) {
      if (user.nome !== name || unique_name !== user.email) {
        await database("con_usuarios")
          .update({
            oid,
            nome: name,
            email: unique_name,
          })
          .where("oid", oid);
      }
    } else {
      await database("con_usuarios").insert({
        oid,
        nome: name,
        email: unique_name,
      });
    }
  } catch (error: any) {
    throw new AppError(error.message, 401);
  }

  return next();
};
