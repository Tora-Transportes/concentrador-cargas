import axios from "axios";
import { Request, Response } from "express";

interface IWebhookGitHubController {
  webhook(req: Request, res: Response): Promise<void>;
}

class WebhookGitHubController implements IWebhookGitHubController {
  async webhook(req: Request, res: Response): Promise<void> {
    axios
      .post(String(process.env.URL_API_ASSINADOR), req)
      .then((response) => {
        console.log("Redirecionado hook com sucesso!", response);
        return { msg: "Redirecionado hook com sucesso ", erro: false };
      })
      .catch((error) => {
        console.error("Erro ao redirecionar hook :", error);
        return { msg: "Erro ao redirecionar hook :", erro: false };
      });
  }
}

export default new WebhookGitHubController();
