import axios from "axios";
import { Request, Response } from "express";

interface IBotCsnController {
  locais(req: Request, res: Response): Promise<void>;
  postos(req: Request, res: Response): Promise<void>;
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
}

export default new BotCsnController();
