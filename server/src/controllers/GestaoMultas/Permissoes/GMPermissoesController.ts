/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Request, Response } from "express";

interface IGMPermissoesController {
  create(req: Request, res: Response): Promise<any>;
  index(req: Request, res: Response): Promise<any>;
  update(req: Request, res: Response): Promise<any>;
  list(req: Request, res: Response): Promise<any>;
  delete(req: Request, res: Response): Promise<any>;
  deletePermissioUser(req: Request, res: Response): Promise<any>;
}

class GMPermissoesController implements IGMPermissoesController {
  constructor() {
    this.handleError = this.handleError.bind(this);
    this.create = this.create.bind(this);
    this.index = this.index.bind(this);
    this.update = this.update.bind(this);
    this.list = this.list.bind(this);
    this.delete = this.delete.bind(this);
    this.deletePermissioUser = this.deletePermissioUser.bind(this);
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
        `${String(process.env.URL_GESTAO_MULTAS)}/usuarios`,
        req.body
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }
  async index(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    try {
      const response = await axios.get(
        `${String(process.env.URL_GESTAO_MULTAS)}/usuarios/${id}/permissoes`
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
        `${String(process.env.URL_GESTAO_MULTAS)}/usuarios/${id}`,
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
        `${String(process.env.URL_GESTAO_MULTAS)}/usuarios`,
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

  async delete(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    try {
      const response = await axios.delete(
        `${String(process.env.URL_GESTAO_MULTAS)}/usuarios/${id}`
      );
      const { status } = response;
      return res.status(status).json({
        message: "Empresa deletada com sucesso!",
      });
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async deletePermissioUser(req: Request, res: Response): Promise<any> {
    const { id, id_permissao } = req.params;
    try {
      const response = await axios.delete(
        `${String(
          process.env.URL_GESTAO_MULTAS
        )}/usuarios/${id}/permissoes/${id_permissao}`
      );
      const { status } = response;
      return res.status(status).json({
        message: "Empresa deletada com sucesso!",
      });
    } catch (error) {
      return this.handleError(error, res);
    }
  }
}

export default new GMPermissoesController();
