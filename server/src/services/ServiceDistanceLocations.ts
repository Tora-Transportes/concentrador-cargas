import { mssql } from "../database";
import AppError from "../models/AppError";

export interface IQueryDistance {
  cidade_origem: string;
  cidade_destino: string;
  estado_destino: string;
  estado_origem: string;
}

export class ServiceDistanceLocations {
  async find(query: IQueryDistance) {
    const { cidade_origem, cidade_destino, estado_origem, estado_destino } =
      query;

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
      throw new AppError(
        "Não existe nenhuma rota cadastrada entre esses dois pontos",
        404
      );
    }

    return rota.distancia;
  }
}
