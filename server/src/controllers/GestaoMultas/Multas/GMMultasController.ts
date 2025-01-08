/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Request, Response } from "express";

interface IGMNotificacoesController {
  list(req: Request, res: Response): Promise<any>;
  index(req: Request, res: Response): Promise<any>;
  gerarExcel(req: Request, res: Response): Promise<any>;
}

class GMNotificacoesController implements IGMNotificacoesController {
  constructor() {
    this.handleError = this.handleError.bind(this);
    this.list = this.list.bind(this);
    this.index = this.index.bind(this);
    this.gerarExcel = this.gerarExcel.bind(this);
  }

  private handleError(error: any, res: Response) {
    if (axios.isAxiosError(error)) {
      const { response } = error;
      if (response) {
        return res.status(response.status).json(response.data || {});
      }
    }

    console.log("Erro desconhecido:", error);
    return res.status(500).json({
      message: "Erro interno no servidor.",
      details: error.message || {},
    });
  }

  async list(req: Request, res: Response): Promise<any> {
    try {
      const response = await axios.get(
        `${String(process.env.URL_GESTAO_MULTAS)}/multas`,
        {
          params: req.query,
        }
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async index(req: Request, res: Response): Promise<any> {
    const { ait } = req.params;
    try {
      const response = await axios.get(
        `${String(process.env.URL_GESTAO_MULTAS)}/multas/${ait}`
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async gerarExcel(req: Request, res: Response): Promise<any> {
    try {
      const response = await axios.get(
        `${String(process.env.URL_GESTAO_MULTAS)}/multas/excel`,
        {
          responseType: "arraybuffer",
          params: req.query,
        }
      );

      const { data, status, headers } = response;
      if (
        headers["content-type"] ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="documento.pdf"'
        );
        res.setHeader("Content-Type", "application/pdf");
        res.status(status).send(data);
      } else {
        return res.status(status).json(JSON.parse(data.toString("utf8")));
      }
    } catch (error) {
      return this.handleError(error, res);
    }
  }
}

export default new GMNotificacoesController();
