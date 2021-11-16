import { NextFunction, Request, Response } from "express";
import { ValidationError } from "yup";

interface ErrorApplication extends Error {
  status?: number;
  message: string;
  errors?: string[];
}

export default async function (
  error: ErrorApplication,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let errors: string[] = [];
  let statusCode: number = error.status || 500;
  let message: string = error.message;
  if (error instanceof ValidationError) {
    errors = error.errors;
    statusCode = 400;
    message = "Erro na validação dos campos";
  }
  res.status(statusCode);
  return res.json({
    message,
    errors,
    stack: error.stack,
  });
}
