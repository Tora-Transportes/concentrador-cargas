/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Request, Response } from "express";

interface IGMNotificacoesController {
  list(req: Request, res: Response): Promise<any>;
  index(req: Request, res: Response): Promise<any>;
  indicarInfrator(req: Request, res: Response): Promise<any>;
  excluirInfrator(req: Request, res: Response): Promise<any>;
  regerarInfratores(req: Request, res: Response): Promise<any>;
}

class GMNotificacoesController implements IGMNotificacoesController {
  constructor() {
    this.handleError = this.handleError.bind(this);
    this.list = this.list.bind(this);
    this.index = this.index.bind(this);
    this.indicarInfrator = this.indicarInfrator.bind(this);
    this.excluirInfrator = this.excluirInfrator.bind(this);
    this.regerarInfratores = this.regerarInfratores.bind(this);
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

  async indicarInfrator(req: Request, res: Response): Promise<any> {
    try {
      const response = await axios.post(
        `${String(process.env.URL_GESTAO_MULTAS)}/infrator`,
        req.body
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async excluirInfrator(req: Request, res: Response): Promise<any> {
    try {
      const response = await axios.post(
        `${String(process.env.URL_GESTAO_MULTAS)}/infrator/excluir`,
        req.body
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async regerarInfratores(req: Request, res: Response): Promise<any> {
    try {
      const response = await axios.post(
        `${String(process.env.URL_GESTAO_MULTAS)}/viagem/infratores:regerar`,
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
        `${String(process.env.URL_GESTAO_MULTAS)}/notificacoes`,
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
        `${String(process.env.URL_GESTAO_MULTAS)}/notificacoes/${ait}`
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }
}

export default new GMNotificacoesController();
