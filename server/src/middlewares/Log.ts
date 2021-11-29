import { NextFunction, Request, Response } from "express";
import ServiceLogsSingleton from "../services/ServiceLogsSingleton";

export default async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET") return next();
  const token = req.headers.authorization;
  const log = {
    corpo: JSON.stringify(req.body),
    metodo: req.method,
    url: req.url,
    token: String(token),
  };
  await ServiceLogsSingleton.write(log);
  return next();
};
