import { mssql, mssqlCoordenadas } from "../database";
import AppError from "../models/AppError";

export interface IQueryDistance {
  cidade_origem: string | undefined | null;
  cidade_destino: string | undefined | null;
  estado_destino: string | undefined | null;
  estado_origem: string | undefined | null;
}

export interface IVehicleRange {
  distancia_km: number;
  placa: string;
  data_alteracao: Date;
  latitude: number;
  longitude: number;
}

export interface ISearchVehicleRange {
  placa: string;
  veiculos: IVehicleRange[];
  latitude_origem: number;
  longitude_origem: number;
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

  async listVehiclesInRange(
    startPlateVehicle: string,
    distanceInKm: number
  ): Promise<ISearchVehicleRange> {
    const originalVehicle = await mssqlCoordenadas("MAXPOSITION")
      .where("PLACA", startPlateVehicle)
      .whereNotNull("LAT")
      .whereNotNull("LON")
      .first()
      .select(["lat", "lon"]);

    if (!originalVehicle) {
      throw new AppError("Veiculo especificado não existe!", 404);
    }

    const { lat, lon } = originalVehicle;

    const vehicles: IVehicleRange[] = await mssqlCoordenadas.raw(
      `SELECT  
      dbo.fncCalcula_Distancia_Coordenada(LAT, LON, ?, ?) as distancia_km,
      PLACA as placa,
      DT_ALTERACAO as data_alteracao,
      LAT as latitude,
      LON as longitude

      from (
        SELECT MAXPOSITION.PLACA, MAXPOSITION.DT_ALTERACAO, MAXPOSITION.LAT, MAXPOSITION.LON,
        ROW_NUMBER() OVER (PARTITION BY PLACA ORDER BY DT_ALTERACAO DESC) as POS
        from MAXPOSITION
      ) M1
      WHERE PLACA is not null
      AND M1.POS = 1
      and LAT is not null
      and LON is not null
      and dbo.fncCalcula_Distancia_Coordenada(LAT, LON, ?, ?) <= ?
      order by DISTANCIA_KM ASC
    `,
      [lat, lon, lat, lon, distanceInKm]
    );

    return {
      placa: startPlateVehicle,
      latitude_origem: lat,
      longitude_origem: lon,
      veiculos: vehicles,
    };
  }
}
