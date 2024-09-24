import axios from "axios";
import moment from "moment";
import * as https from "https";
import { orderBy } from "lodash";
import lodash from "lodash";

import oracle from "../database";
import database, { mssql, mssqlCoordenadas } from "../database";
import AppError from "../models/AppError";
import { calculateDiffDate } from "../Utils/formatData";
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
  VEI_CATEGORIA?: string | null;
  SV_DSC: string | null;
}

export interface ISearchVehicleRange {
  placa: string;
  veiculos: IVehicleRange[];
  latitude_origem: number;
  longitude_origem: number;
}
interface IHistoryTravelVehicle {
  MUN: string;
  UF: string;
  ROD: string;
  RUA: string;
  MOT: string;
  LAT: number;
  LON: number;
  DISIMEI: number;
  DTINC: Date;
  ID: number;
  DOWNTIME?: number;
}

export interface IResultHistoryVeicle {
  placa: string;
  posicao: IHistoryTravelVehicle[];
}

interface ILastLocations {
  MUN: string;
  UF: string;
  ROD: string;
  RUA: string;
  LAT: number;
  LOT: number;
  DISIMEI: string;
  DTINC: string;
  ID?: number;
  DOWNTIME?: number;
}

interface IInfoSetorVeiculo {
  VEI_PLACA: string;
  SV_DSC: string;
  VEI_CATEGORIA: string;
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

  async searchRouteToEnterprise(plateVehicle: string, cnpj: string) {
    const originalVehicle = await mssqlCoordenadas("MAXPOSITION")
      .where("PLACA", plateVehicle)
      .whereNotNull("LAT")
      .whereNotNull("LON")
      .first()
      .select(["lat", "lon"]);

    if (!originalVehicle) {
      throw new AppError("Veiculo especificado não existe!", 404);
    }

    const { lat: latitude_origem, lon: longitude_origem } = originalVehicle;

    const enterpriseCoordinates = await database("PRACA")
      .whereNotNull("PCA_LATITUDE")
      .whereNotNull("PCA_LONGITUDE")
      .where("PCA_DOC_FEDERAL", cnpj?.trim())
      .select([
        "PCA_DOC_FEDERAL as cnpj",
        "PCA_LATITUDE as latitude",
        "PCA_LONGITUDE as longitude",
      ])
      .first();

    if (!enterpriseCoordinates) {
      throw new AppError(
        "O cnpj especificado ou não existe ou não possui coordenadas cadastradas!",
        404
      );
    }

    const { latitude: latitude_destino, longitude: longitude_destino } =
      enterpriseCoordinates;

    const tokensMapsRoute =
      process.env.BING_MAPS_API_TOKEN?.split(";").filter((i) => !!i) ?? [];

    if (!tokensMapsRoute || tokensMapsRoute.length === 0) {
      throw new Error("Os tokens BING_MAPS_API_TOKEN não foram definidos");
    }
    const api_key = String(tokensMapsRoute[0]);

    const anularCertificadoApiEmDev =
      process.env.ANULAR_CERTIFICADO_BING_MAPS_API_TOKEN;

    let apiVirtualLearth;
    if (anularCertificadoApiEmDev === "true") {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
      apiVirtualLearth = axios.create({
        httpsAgent,
        baseURL: "https://dev.virtualearth.net/REST/v1/Routes",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      apiVirtualLearth = axios.create({
        baseURL: "https://dev.virtualearth.net/REST/v1/Routes",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const routeData = (
      await apiVirtualLearth.post(`/DistanceMatrix?key=${api_key}`, {
        origins: [
          {
            latitude: latitude_origem,
            longitude: longitude_origem,
          },
        ],
        destinations: [
          {
            latitude: latitude_destino,
            longitude: longitude_destino,
          },
        ],
        travelMode: "Driving",
        timeUnit: "second",
      })
    ).data;

    let distancia_km = undefined;
    let duracao_viagem_direta = undefined;
    const tripInfo = routeData?.resourceSets[0]?.resources[0]?.results[0];
    if (
      tripInfo &&
      tripInfo.travelDistance !== -1 &&
      tripInfo.travelDuration !== -1
    ) {
      const { travelDuration, travelDistance } = tripInfo;
      distancia_km = travelDistance;
      duracao_viagem_direta = travelDuration;
    }

    return {
      cnpj,
      placa: plateVehicle,
      latitude_origem,
      longitude_origem,
      latitude_destino,
      longitude_destino,
      distancia_km,
      duracao_viagem_direta,
    };
  }

  async listVehiclesInRangeEnterprise(cnpj: string, distanceInKm: number) {
    const enterpriseCoordinates = await database("PRACA")
      .whereNotNull("PCA_LATITUDE")
      .whereNotNull("PCA_LONGITUDE")
      .where("PCA_DOC_FEDERAL", cnpj)
      .select([
        "PCA_DOC_FEDERAL as cnpj",
        "PCA_LATITUDE as latitude",
        "PCA_LONGITUDE as longitude",
      ])
      .first();

    if (!enterpriseCoordinates) {
      throw new AppError(
        "O cnpj especificado não existe ou não possui coordenadas cadastradas!",
        404
      );
    }

    const { latitude: lat, longitude: lon } = enterpriseCoordinates;

    const vehicles: IVehicleRange[] = await mssqlCoordenadas.raw(
      `SELECT  
      dbo.fncCalcula_Distancia_Coordenada(LAT, LON, ?, ?) as distancia_km,
      PLACA as placa,
      LAT as latitude,
      LON as longitude
      from (
        SELECT MAXPOSITION.PLACA, MAXPOSITION.DT_ALTERACAO, MAXPOSITION.LAT, MAXPOSITION.LON,
        ROW_NUMBER() OVER (PARTITION BY PLACA ORDER BY DT_ALTERACAO DESC) as POS
        from MAXPOSITION
      ) M1
      WHERE CONVERT(DATE,DT_ALTERACAO) >= CONVERT(DATE,GETDATE()-7)
      AND PLACA is not null
      AND M1.POS = 1
      and LAT is not null
      and LON is not null
      and dbo.fncCalcula_Distancia_Coordenada(LAT, LON, ?, ?) <= ?
      order by DISTANCIA_KM ASC
    `,
      [lat, lon, lat, lon, distanceInKm]
    );

    const placas = vehicles.map((item) => ` '${item.placa}'`);
    const infoSetorVeiculo = await database.raw(
      `SELECT VEI_CATEGORIA, SVI.SV_DSC, VEI_PLACA  FROM VEICULO VEI INNER JOIN SETOR_VEICULO SVI
              ON SVI.SV_COD = VEI.SV_COD WHERE VEI_PLACA IN (${placas})`
    ).catch(error => {
      throw new AppError(
        "Não foram encontrados veículos que atendam os requisitos!",
        404
      );
    });

    vehicles.forEach((elem) => {
      return infoSetorVeiculo.filter((filtroData: IInfoSetorVeiculo) => {
        if (elem.placa === filtroData.VEI_PLACA) {
          elem.SV_DSC = filtroData.SV_DSC;
          elem.VEI_CATEGORIA = filtroData.VEI_CATEGORIA;
        }
      });
    });

    return {
      cnpj,
      latitude_origem: lat,
      longitude_origem: lon,
      veiculos: vehicles,
    };
  }

  async historyTravelVeicleService(
    plate: string,
    date_inicio: string,
    date_fim: string
  ): Promise<IResultHistoryVeicle> {
    try {
      const query = await oracle("VEICULO")
        .select(["VEI_REFERENCIA"])
        .first()
        .where("VEI_PLACA", plate);
  
      if (!query) {
        throw new AppError(
          "A placa especificada não existe ou não possui coordenadas cadastradas!",
          404
        );
      }
  
      date_inicio = moment(date_inicio).format("YYYY-MM-DDT00:00:00");
      if (date_fim !== moment().format("YYYY-MM-DD")) {
        date_fim = moment(date_fim).format("YYYY-MM-DDT23:59:59");
      } else {
        date_fim = moment().subtract(4, "minutes").format("YYYY-MM-DDTHH:mm:ss");
      }
  
      const historyVeicle = await mssqlCoordenadas("REPORTES")
        .select([
          "ID",
          "DISIMEI",
          "LAT",
          "LON",
          "UF",
          "ROD",
          "RUA",
          "MUN",
          "LOC",
          "DTINC",
        ])
        .where("DISIMEI", query?.VEI_REFERENCIA?.trim())
        .andWhere("DTINC", ">=", date_inicio)
        .andWhere("DTINC", "<=", date_fim);
  
      //retirando duplicidades do array
      // const historicosSemDuplicidade: IHistoryTravelVehicle[] = [];
      // historyVeicle.forEach((elem, index, arrayHistorico) => {
      //   if (index > 0) {
      //     const indexMenosUm = index - 1;
      //     const latitudeArr = arrayHistorico[indexMenosUm].LAT;
      //     const longitudeArr = arrayHistorico[indexMenosUm].LON;
  
      //     if (elem.LAT !== latitudeArr || elem.LON !== longitudeArr) {
      //       historicosSemDuplicidade.push(elem);
      //     }
      //   } else {
      //     historicosSemDuplicidade.push(elem);
      //   }
      // });
  
      //ordenação de historyVeicle DESC (se ordernar na query fica muito lento a busca);
      function compare(a: IHistoryTravelVehicle, b: IHistoryTravelVehicle) {
        if (a.ID > b.ID) return -1;
        if (a.ID < b.ID) return 1;
        return 0;
      }
      historyVeicle.sort(compare);
  
      return {
        placa: plate,
        posicao: historyVeicle,
      };
    } catch (err: any) {
      if (err?.message?.includes('Undefined binding(s)')) {
        throw new Error('Veículo sem rastreador vinculado no SIT')
      } else {
        throw new Error(err.message)
      }
    }
  }

  async historyTempVeicleService(
    plate: string,
    date_inicio: string,
    date_fim: string
  ): Promise<IResultHistoryVeicle> {
    const query = await oracle("VEICULO")
      .select(["VEI_REFERENCIA"])
      .first()
      .where("VEI_PLACA", plate);

    if (!query) {
      throw new AppError(
        "A placa especificada não existe ou não possui coordenadas cadastradas!",
        404
      );
    }

    date_inicio = moment(date_inicio).format("YYYY-MM-DDT00:00:00");
    if (plate.length !== 7) {
      throw new AppError("Placa inválida", 400);
    }

    if (!date_inicio || !date_fim) {
      throw new AppError(
        "Query param date_inicio ou date_fim não informado",
        400
      );
    } else {
      const diferencaDate = await calculateDiffDate(
        String(date_inicio),
        String(date_fim)
      );

      if (diferencaDate > 7) {
        throw new AppError(
          "O período entre as datas não pode ser maior que 07 dias.",
          400
        );
      }
    }
    if (date_fim !== moment().format("YYYY-MM-DD")) {
      date_fim = moment(date_fim).format("YYYY-MM-DDT23:59:59");
    } else {
      date_fim = moment().subtract(4, "minutes").format("YYYY-MM-DDTHH:mm:ss");
    }

    const historyVeicle = await mssqlCoordenadas("REPORTES")
      .select([
        "ID",
        "DISIMEI",
        "LAT",
        "LON",
        "UF",
        "ROD",
        "RUA",
        "MUN",
        "LOC",
        "DTINC",
      ])
      .where("DISIMEI", query?.VEI_REFERENCIA?.trim())
      .andWhere("DTINC", ">=", date_inicio)
      .andWhere("DTINC", "<=", date_fim);

    let objAnterior: IHistoryTravelVehicle = historyVeicle[0];
    let totalTime = 0;

    //retirando os duplicados e adicionando o tempo parada do veiculo;
    const historicos: IHistoryTravelVehicle[] = [];
    historyVeicle.push({
      ID: "0",
      DISIMEI: "00",
      LAT: "-0",
      LON: "-0",
      UF: "0",
      DTINC: "2023-04-13T11:30:50.267Z",
    });

    lodash.forEach(
      historyVeicle,
      (dadosPositionAtual, index, arrayHistorico) => {
        if (
          dadosPositionAtual.LAT !== objAnterior.LAT ||
          dadosPositionAtual.LON !== objAnterior.LON
        ) {
          const positionIndice = index > 0 ? index - 1 : index;
          const dataInicioParado = objAnterior.DTINC;
          const dataFinParado = arrayHistorico[positionIndice].DTINC;

          totalTime = dataFinParado.getTime() - dataInicioParado.getTime();
          objAnterior.DOWNTIME = Math.floor(totalTime / (1000 * 60));

          historicos.push(objAnterior);
          objAnterior = dadosPositionAtual;
          totalTime = 0;
        }
      }
    );

    // Remove duplicatas usando a função uniqWith da lodash
    const historicosSemDuplicidade: IHistoryTravelVehicle[] = lodash.uniqWith(
      historicos,
      lodash.isEqual
    );

    //ordenação de historyVeicle DESC;
    const historicosSemDuplicidadeOrdenado = orderBy(
      historicosSemDuplicidade,
      ["ID"],
      ["desc"]
    );

    return {
      placa: plate,
      posicao: historicosSemDuplicidadeOrdenado,
    };
  }

  async lastPositionService(plate: string): Promise<ILastLocations> {
    const { VEI_REFERENCIA } = await oracle("VEICULO")
      .select(["VEI_REFERENCIA"])
      .first()
      .where("VEI_PLACA", plate);

    if (!VEI_REFERENCIA) {
      throw new AppError(" ", 204);
    }

    const dataAtualMenos2Minuto = moment()
      .subtract(2, "minutes")
      .format("YYYY-MM-DDTHH:mm:ss");

    const queryBuild = await mssqlCoordenadas.raw(
      `select top 1 DISIMEI, LAT, LON, UF, ROD, RUA, MUN, DTINC
      from REPORTES where DISIMEI = '${VEI_REFERENCIA}' and (dtinc < '${dataAtualMenos2Minuto}') order by dtinc desc`
    );

    return queryBuild[0];
  }
}
