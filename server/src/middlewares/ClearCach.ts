import { RequestHandler } from "express";

export default function (): RequestHandler {
  return (req, res, next) => {
    res.setHeader("Cache-Control", "max-age=3600");
    next();
  };
}
