/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Request, Response } from "express";

interface IGMNotificacoesController {
  list(req: Request, res: Response): Promise<any>;
  index(req: Request, res: Response): Promise<any>;
  indicarInfrator(req: Request, res: Response): Promise<any>;
  excluirInfrator(req: Request, res: Response): Promise<any>;
  regerarInfratores(req: Request, res: Response): Promise<any>;
  atualizar(req: Request, res: Response): Promise<any>;
  atualizarStatus(req: Request, res: Response): Promise<any>;
  gerarFici(req: Request, res: Response): Promise<any>;
  solicitarBoleto(req: Request, res: Response): Promise<any>;
  gerarDespesa(req: Request, res: Response): Promise<any>;
  gerarTermo(req: Request, res: Response): Promise<any>;
  gerarExcel(req: Request, res: Response): Promise<any>;
  infratorManual(req: Request, res: Response): Promise<any>;
}

class GMNotificacoesController implements IGMNotificacoesController {
  constructor() {
    this.handleError = this.handleError.bind(this);
    this.list = this.list.bind(this);
    this.index = this.index.bind(this);
    this.indicarInfrator = this.indicarInfrator.bind(this);
    this.excluirInfrator = this.excluirInfrator.bind(this);
    this.regerarInfratores = this.regerarInfratores.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.atualizarStatus = this.atualizarStatus.bind(this);
    this.gerarFici = this.gerarFici.bind(this);
    this.solicitarBoleto = this.solicitarBoleto.bind(this);
    this.gerarDespesa = this.gerarDespesa.bind(this);
    this.gerarTermo = this.gerarTermo.bind(this);
    this.gerarExcel = this.gerarExcel.bind(this);
    this.infratorManual = this.infratorManual.bind(this);
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

  async gerarFici(req: Request, res: Response): Promise<any> {
    try {
      const response = await axios.get(
        `${String(process.env.URL_GESTAO_MULTAS)}/infrator/gerar-formulario`,
        {
          params: req.query,
          responseType: "arraybuffer",
        }
      );

      const { data, status, headers } = response;
      if (
        headers["content-type"] ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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

  async atualizar(req: Request, res: Response): Promise<any> {
    const { ait } = req.params;
    try {
      const response = await axios.get(
        `${String(process.env.URL_GESTAO_MULTAS)}/smartec/notificacoes/${ait}`
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async atualizarStatus(req: Request, res: Response): Promise<any> {
    try {
      const response = await axios.post(
        `${String(process.env.URL_GESTAO_MULTAS)}/status-interno`,
        req.body
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async solicitarBoleto(req: Request, res: Response): Promise<any> {
    try {
      const response = await axios.post(
        `${String(process.env.URL_GESTAO_MULTAS)}/boletos/gerar-solicitacao`,
        req.body
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async gerarDespesa(req: Request, res: Response): Promise<any> {
    try {
      const date = new Date(req.body.data_multa);
      const formattedDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
      req.body.data_multa = formattedDate;
      const response = await axios.post(
        `${String(process.env.URL_GESTAO_MULTAS)}/despesas`,
        req.body
      );
      const { data, status } = response;
      return res.status(status).json(data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async gerarTermo(req: Request, res: Response): Promise<any> {
    const { ait } = req.params;
    try {
      const response = await axios.get(
        `${String(process.env.URL_GESTAO_MULTAS)}/termos/ait/${ait}/download`,
        {
          responseType: "arraybuffer",
          params: req.query,
        }
      );

      const { data, status, headers } = response;
      if (
        headers["content-type"] ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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

  async gerarExcel(req: Request, res: Response): Promise<any> {
    try {
      const response = await axios.get(
        `${String(process.env.URL_GESTAO_MULTAS)}/notificacoes/excel`,
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

  async infratorManual(req: Request, res: Response): Promise<any> {
    const { cpf, ait } = req.params;
    try {
      const response = await axios.get(
        `${String(
          process.env.URL_GESTAO_MULTAS
        )}/viagem/infratores/${cpf}/ait/${ait}`,
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

export default new GMNotificacoesController();
