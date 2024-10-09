import axios from "axios";
import { Request, Response } from "express";

interface IBotCsnController {
  locais(req: Request, res: Response): Promise<void>;
  postos(req: Request, res: Response): Promise<void>;
  operacoes(req: Request, res: Response): Promise<void>;
  posicoes(req: Request, res: Response): Promise<void>;
  operacoesVeiculos(req: Request, res: Response): Promise<void>;
}

class BotCsnController implements IBotCsnController {
  async locais(req: Request, res: Response): Promise<void> {
    axios
      .get(
        String(process.env.URL_API_BOT_CSN) +
          `/bot/locais?nome=${req.query.nome}&tipo_local=${req.query.tipo_local}`
      )
      .then((response) => {
        console.log("Redirecionado locais bot csn com sucesso!");
        return res.json(response.data);
      })
      .catch((error) => {
        console.error("Erro ao  locais bot csn :", error);
        return res.json({ msg: "Erro ao  locais bot csn :", erro: false });
      });
  }
  async postos(req: Request, res: Response): Promise<void> {
    axios
      .get(
        String(process.env.URL_API_BOT_CSN) +
          `/bot/postos?nome=${req.query.nome}&tipo_local=${req.query.tipo_local}`
      )
      .then((response) => {
        console.log("Redirecionado postos bot csn com sucesso!");
        return res.json(response.data);
      })
      .catch((error) => {
        console.error("Erro ao  postos bot csn :", error);
        return res.json({ msg: "Erro ao  postos bot csn :", erro: false });
      });
  }

  async posicoes(req: Request, res: Response): Promise<void> {
    axios
      .get(
        String(process.env.URL_API_BOT_CSN) +
          `/bot/posicoes?nome=${req.query.nome}&tipo_local=${req.query.tipo_local}&tipo_posicoes=${req.query.tipo_posicoes}`
      )
      .then((response) => {
        console.log("Redirecionado posicoes bot csn com sucesso!");
        return res.json(response.data);
      })
      .catch((error) => {
        console.error("Erro ao  posicoes bot csn :", error);
        return res.json({ msg: "Erro ao  posicoes bot csn :", erro: false });
      });
  }

  async operacoes(req: Request, res: Response): Promise<void> {
    axios
      .get(String(process.env.URL_API_BOT_CSN) + `/bot/operacoes`)
      .then((response) => {
        console.log("Redirecionado operacoes bot csn com sucesso!");
        return res.json(response.data);
      })
      .catch((error) => {
        console.error("Erro ao  operacoes bot csn :", error);
        return res.json({ msg: "Erro ao  operacoes bot csn :", erro: false });
      });
  }

  async operacoesVeiculos(req: Request, res: Response): Promise<void> {
    axios
      .get(String(process.env.URL_API_BOT_CSN) + `/bot/operacoes/veiculos`)
      .then((response) => {
        console.log("Redirecionado operacoesVeiculos bot csn com sucesso!");
        return res.json(response.data);
      })
      .catch((error) => {
        console.error("Erro ao  operacoesVeiculos bot csn :", error);
        return res.json({
          msg: "Erro ao  operacoesVeiculos bot csn :",
          erro: false,
        });
      });
  }
}

export default new BotCsnController();
