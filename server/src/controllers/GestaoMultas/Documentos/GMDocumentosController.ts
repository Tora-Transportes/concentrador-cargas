/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Request, Response } from "express";
import FormData from "form-data";

interface IGMDocumentosController {
  create(req: Request, res: Response): Promise<any>;
  listByAit(req: Request, res: Response): Promise<any>;
  logs(req: Request, res: Response): Promise<any>;
  delete(req: Request, res: Response): Promise<any>;
  download(req: Request, res: Response): Promise<any>;
}

class GMDocumentosController implements IGMDocumentosController {
  constructor() {
    this.handleError = this.handleError.bind(this);
    this.create = this.create.bind(this);
    this.listByAit = this.listByAit.bind(this);
    this.delete = this.delete.bind(this);
    this.download = this.download.bind(this);
    this.logs = this.logs.bind(this);
  }

  private handleError(error: any, res: Response) {
    if (axios.isAxiosError(error)) {
      const { response } = error;
      if (response) {
        if (response.data instanceof Buffer) {
          return res
            .status(response.status)
            .json(JSON.parse(response.data.toString("utf8")) || {});
        } else {
          return res.status(response.status).json(response.data || {});
        }
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
      const formData = new FormData();

      Object.keys(req.body).forEach((key) => {
        formData.append(key, req.body[key]);
      });

      if (req.file) {
        formData.append("arquivo", req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
        });
      }
      const headers = formData.getHeaders();

      const response = await axios.post(
        `${String(process.env.URL_GESTAO_MULTAS)}/documentos`,
        formData,
        { headers }
      );

      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async download(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    try {
      const response = await axios.get(
        `${String(process.env.URL_GESTAO_MULTAS)}/documentos/${id}/download`,
        {
          responseType: "arraybuffer",
        }
      );

      const { data, status, headers } = response;
      if (headers["content-type"] === "application/octet-stream") {
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

  async listByAit(req: Request, res: Response): Promise<any> {
    const { ait } = req.params;
    try {
      const response = await axios.get(
        `${String(process.env.URL_GESTAO_MULTAS)}/documentos/ait/${ait}`
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async logs(req: Request, res: Response): Promise<any> {
    const { ait } = req.params;
    try {
      const response = await axios.get(
        `${String(process.env.URL_GESTAO_MULTAS)}/documentos/ait/${ait}/logs`
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async delete(req: Request, res: Response): Promise<any> {
    const { id, user } = req.params;
    try {
      const response = await axios.delete(
        `${String(
          process.env.URL_GESTAO_MULTAS
        )}/documentos/${id}/user/${user}`,
        req.body
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }
}

export default new GMDocumentosController();
