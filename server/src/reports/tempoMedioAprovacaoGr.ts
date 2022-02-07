import database from "../database";
export class TempoMedioAprovacaoGr {
  async generate() {
    return database.raw(
      `select avg("segundos") "media" from "con_cargas_logs_aprovacao"`
    );
  }
}
