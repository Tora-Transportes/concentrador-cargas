/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Request, Response } from "express";

interface IGMImpedimentosController {
  list(req: Request, res: Response): Promise<any>;
  update(req: Request, res: Response): Promise<any>;
  create(req: Request, res: Response): Promise<any>;
  historico(req: Request, res: Response): Promise<any>;
}

class GMImpedimentosController implements IGMImpedimentosController {
  constructor() {
    this.handleError = this.handleError.bind(this);
    this.list = this.list.bind(this);
    this.update = this.update.bind(this);
    this.create = this.create.bind(this);
    this.historico = this.historico.bind(this);
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

  async create(req: Request, res: Response): Promise<any> {
    try {
      const response = await axios.post(
        `${String(process.env.URL_GESTAO_MULTAS)}/impedimentos`,
        req.body
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async list(req: Request, res: Response): Promise<any> {
    try {
      const response = await axios.get(
        `${String(process.env.URL_GESTAO_MULTAS)}/impedimentos`,
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

  async update(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    try {
      const response = await axios.put(
        `${String(process.env.URL_GESTAO_MULTAS)}/impedimentos/${id}`,
        req.body
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async historico(req: Request, res: Response): Promise<any> {
    try {
      const response = await axios.get(
        `${String(process.env.URL_GESTAO_MULTAS)}/impedimentos/historico`,
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
}

export default new GMImpedimentosController();
