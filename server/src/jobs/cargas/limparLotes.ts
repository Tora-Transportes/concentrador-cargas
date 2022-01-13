import cron from "node-cron";
import database from "../../database";

export default function () {
  cron.schedule("0 0 * * *", async () => {
    console.log("|----------Limpando os lotes----------|");
    await database("con_cargas").update({ ativo: 0 }).where("e_lote", 1);
    console.log("|--------Fim limpeza dos lotes--------|");
  });
}
