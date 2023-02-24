import { ErrorReports } from "../reports/errorsReports";
import { Request, Response } from "express";

class LogsErrors {
  async error(req: Request, res: Response) {
    const errorReports = new ErrorReports();
    const result = await errorReports.run(req.body);
    return res.json({ data: { message: result } });
  }
}

export default new LogsErrors();
