import { mssql } from "../database";

export interface IQueryDistance {
  cidade_origem: string;
  cidade_destino: string;
  estado_destino: string;
  estado_origem: string;
}

export class ServiceDistanceLocations {
  async find(query: IQueryDistance) {
    const { cidade_origem, cidade_destino, estado_origem, estado_destino } =
      JSON.parse(
        JSON.stringify(query)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      );

    const rota = await mssql("ROTAS_OPERACAO_NEW")
      .first()
      .where(
        "ORIGEM",
        `${cidade_origem.toUpperCase()}, ${estado_origem.toUpperCase()}`
      )
      .where(
        "DESTINO",
        `${cidade_destino.toUpperCase()}, ${estado_destino.toUpperCase()}`
      )
      .select(["DISTANCIA as distancia"]);

    if (!rota) {
      return null;
    }

    return rota.distancia;
  }
}
