import path from "path";
import fs from "fs";
import winston from "winston";
import AppError from "../models/AppError";
import { factoryLogsError } from "../validations/LogsValidator";
import { IClassErroReports, IErrorDefault } from "./interfaceReporter";

export class ErrorReports implements IClassErroReports {
  async run(body: IErrorDefault): Promise<string> {
    const { message, descricao, level, nameFile, id } = body;
    const pathNameLogs = path.join(__dirname, "..", "logs", `${nameFile}.txt`);

    if (fs.existsSync(pathNameLogs)) {
      fs.stat(pathNameLogs, (_err, start) => {
        if (start.size > 60000) {
          fs.writeFile(pathNameLogs, "", () => {
            return;
          });
        }
      });
    }
    const validator = factoryLogsError();
    await validator.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    const { combine, timestamp } = winston.format;
    const logConfiguration = {
      level,
      statusLevels: true,
      format: combine(
        timestamp({
          format: "DD-MM-YYYY HH:mm",
        }),
        winston.format.simple()
      ),
      prepend: true,
      transports: [
        new winston.transports.File({
          filename: path.join(__dirname, "..", "logs", `${nameFile}.txt`),
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
