import { mssql } from "../database";
import AppError from "../models/AppError";

export interface IQueryDistance {
  cidade_origem: string | undefined | null;
  cidade_destino: string | undefined | null;
  estado_destino: string | undefined | null;
  estado_origem: string | undefined | null;
}

export class ServiceDistanceLocations {
  async find(query: IQueryDistance): Promise<null | number> {
    const { cidade_origem, cidade_destino, estado_origem, estado_destino } =
      JSON.parse(
        JSON.stringify(query)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      );

    if (
      [cidade_origem, cidade_destino, estado_origem, estado_destino].includes(
        "UNDEFINED"
      )
    ) {
      throw new AppError(
        "As duas localizações devem ser informadas para proseguir com o cálculo",
        400
      );
    }

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
