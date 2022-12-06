import database from "../database";
export class LocaisRepository {
  async search(query: string) {
    return database("con_localizacoes")
      .select(["sigla_estado", "sigla_pais", "cidade", "estado", "pais"])
      .limit(20)
      .whereRaw(`("pais" || '/' || "sigla_estado" || '/' || "cidade") like ?`, [
        `%${query.toUpperCase()}%`,
      ]);
  }

  async searchOfState(uf: string, cidade: string) {
    return database("con_localizacoes")
      .select("*")
      .where("sigla_estado", uf)
      .andWhere("cidade", "like", `%${cidade}%`)
      .first();
  }
}
