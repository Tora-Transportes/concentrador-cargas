import { Request, Response } from "express";
import { WebhookAutentiqueRepository } from "../repositories/WebhookAutentiqueRepository";

interface IWebhookAutentiqueController {
  assinado(req: Request, res: Response): Promise<Response>;
}

class WebhookAutentiqueController implements IWebhookAutentiqueController {
  async assinado(req: Request, res: Response): Promise<Response> {
    console.log("Webhook Autentique...");
    const webhookRepository = new WebhookAutentiqueRepository();
    const data = {
      id_file: req.body["documento[uuid]"] ?? "",
      viewed: new Date(
        req.body["partes[0][visualizado][created]"].replace("+", "T") ?? ""
      ),
      signed: new Date(
        req.body["partes[0][assinado][created]"].replace("+", "T") ?? ""
      ),
      file_link_original: req.body["arquivo[original]"] ?? "",
      file_link_signed: req.body["arquivo[assinado]"] ?? "",
    };
    const result = await webhookRepository.update(data);
    if (result != 0) {
      console.log("Webhook Autentique doc atualizado...");
      return res.json(data);
    } else {
      console.log("Webhook Autentique doc não atualizado...");
      return res.json({ erro: true, message: "documento não atualizado" });
    }
  }
}

export default new WebhookAutentiqueController();
