import { NextFunction, Request, Response } from "express";
import AppError from "../models/AppError";

export default async (req: Request, res: Response, next: NextFunction) => {
  const uuidKey = String(req.headers.api_key);

  if (!uuidKey) {
    throw new AppError("O Token não foi informada", 401);
  }

  const isValidUuid =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      uuidKey
    );
  if (!isValidUuid) {
    throw new AppError("Token inválido", 400);
  }

  if (uuidKey != "7cfe7a40-e390-4eb0-90e7-d16395547de3") {
    throw new AppError("Não autorizado", 403);
  }

  return next();
};
