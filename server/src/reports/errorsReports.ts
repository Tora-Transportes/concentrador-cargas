import path from "path";
import winston from "winston";
import AppError from "../models/AppError";
import { factoryLogsError } from "../validations/LogsValidator";
import { IClassErroReports, IErrorDefault } from "./interfaceReporter";

export class ErrorReports implements IClassErroReports {
  async run(body: IErrorDefault): Promise<string> {
    const validator = factoryLogsError();
    const bodyValidator = await validator.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    const { message, descricao, level, nameFile, id } = bodyValidator;
    const { combine, timestamp } = winston.format;
    const logConfiguration = {
      level,
      format: combine(
        timestamp({
          format: "DD-MM-YYYY HH:mm",
        }),
        // printf(
        //   (info) =>
        //     `[${info.timestamp}], descricao: ${info.descricao}, message: ${info.message}, status: ${info.status}, level: ${level}`
        // )
        winston.format.simple()
        //winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          //maxsize: 524, // 5MB
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          filename: path.join(__dirname, "..", "logs", `${nameFile}.log`),
          level,
        }),
      ],
    };

    try {
      const logger = winston.createLogger(logConfiguration);

      switch (level) {
        case "info":
          logger.info({ message, descricao, id });
          break;
        case "warn":
          logger.warn({ message, descricao, id });
          break;
        default:
          logger.error({ message, descricao, id });
          break;
      }

      return "Log registrado com sucesso!";
    } catch (error) {
      throw new AppError("Erro ao registrar log", 500);
    }
  }
}
