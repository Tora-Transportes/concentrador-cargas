import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  for (const i in req.body) {
    if (i.toLowerCase().indexOf("data") !== -1) {
      req.body[i] = new Date(req.body[i]);
    }
  }
  return next();
};
