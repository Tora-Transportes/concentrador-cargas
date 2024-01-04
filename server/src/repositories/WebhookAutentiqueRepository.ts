import { mssqlAutentique } from "../database";
import IAutentiqueControle from "../models/IAutentiqueControle";
import { dateAtualMoment } from "../Utils/formatData";

interface IWebhookAutentiqueRepository {
  update(document: IAutentiqueControle): Promise<any>;
}

export class WebhookAutentiqueRepository
  implements IWebhookAutentiqueRepository
{
  async update(document: IAutentiqueControle) {
    document.updated_at = new Date(dateAtualMoment());
    return mssqlAutentique("dbo.controle")
      .update(document)
      .where("id_file", document.id_file);
  }
}
