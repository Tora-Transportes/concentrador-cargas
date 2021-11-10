import { NextFunction, Request, Response } from "express";
import AppError from "../models/AppError";

export default (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    throw new AppError("O Token do usuário não foi informado", 401);
  }
  return next();
};
