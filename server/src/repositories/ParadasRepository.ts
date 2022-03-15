import database from "../database";
import { IParadasRepository } from "../domain/UseCaseCarga/entities";
export class ParadasRepository implements IParadasRepository {
  async clear(codigoCarga: number): Promise<void> {
    if (!codigoCarga) {
      return;
    }
    await database("con_locais_carga").delete().where("fk_carga", codigoCarga);
  }
  async insert(codigoCarga: number, locais: string[]): Promise<void> {
    if (locais.length === 0) return;
    const linhas = locais.map((i, index) => ({
      fk_carga: codigoCarga,
      descricao: i,
      posicao: index + 1,
    }));
    await database("con_locais_carga").insert(linhas);
  }
}
