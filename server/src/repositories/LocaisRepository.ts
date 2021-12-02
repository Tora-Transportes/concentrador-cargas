import { localizacoes } from "../database";
export class LocaisRepository {
  async search(query: string) {
    return localizacoes("con_localizacoes")
      .select(["sigla_estado", "sigla_pais", "cidade", "estado", "pais"])
      .limit(20)
      .whereRaw("(pais || '/' || sigla_estado || '/' || cidade) like ?", [
        `%${query.toUpperCase()}%`,
      ]);
  }
}
// async function teste() {
//   console.log(await new LocaisRepository().search("Betim"));
// }

// teste();
