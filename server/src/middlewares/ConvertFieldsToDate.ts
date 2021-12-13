import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  for (const i in req.body) {
    if (req.body[i] !== null) {
      if (i.toLowerCase().indexOf("data") !== -1) {
        const conversion = new Date(req.body[i]);
        if (isNaN(conversion.getTime())) {
          req.body[i] = null;
        } else {
          req.body[i] = conversion;
        }
      }
    }
  }
  return next();
};
