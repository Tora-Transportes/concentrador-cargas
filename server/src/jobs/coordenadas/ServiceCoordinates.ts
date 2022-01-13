import database, { mssqlCoordenadas } from "../../database";
import axios from "axios";
import cron from "node-cron";
import TextUtils from "../../Utils/text";
import ArrayUtils from "../../Utils/array";
import fs from "fs";
import path from "path";

class ServiceCoordinates {
  async getVehiclesCoodinates() {
    return mssqlCoordenadas("MAXPOSITION")
      .select([
        "MCT as mct",
        "PLACA as placa",
        "LAT as lat",
        "LON as lon",
        "CIDADE_UF as  cidade_uf",
      ])
      .whereNotNull("PLACA")
      .andWhereRaw("YEAR(DT_ALTERACAO) >= '2022'")
      .orderBy(["PLACA", "MCT"]);
  }

  async loadLastTripFleet(vehicles: number[]) {
    const outputVehicles: Array<any> = [];
    for (const currentVehicles of ArrayUtils.splitIntoChunks(vehicles, 999)) {
      const parameters = currentVehicles.map(() => "?").join(", ");
      outputVehicles.push(
        ...(await database.raw(
          `
        SELECT CID_ORI,
        CID_DES,
        COD_CAVALO AS VEI_COD,
        T1.NUM_DVF AS NUM_DOC,
        (CORI.CID_NOM || ' - ' || EORI.UF_SIGLA) AS ORIGEM,
        (CDES.CID_NOM || ' - ' || EDES.UF_SIGLA) AS DESTINO,
        DVF_DT_EMISSAO AS DT_EMISSAO
        FROM (SELECT ROW_NUMBER() OVER (PARTITION BY COD_CAVALO ORDER BY NUM_DVF DESC) as POS, DVF.CID_ORI, DVF.CID_DES, DVF.COD_CAVALO, DVF.NUM_DVF, DVF.DVF_DT_EMISSAO FROM DVF) T1 
        JOIN CIDADE CORI ON CORI.CID_COD = T1.CID_ORI
        JOIN ESTADO EORI ON CORI.UF_COD = EORI.UF_COD
        JOIN CIDADE CDES ON CDES.CID_COD = T1.CID_DES
        JOIN ESTADO EDES ON CDES.UF_COD = EDES.UF_COD
        WHERE T1.POS = 1 AND COD_CAVALO IN (${parameters})
        `,
          currentVehicles
        ))
      );
    }
    return outputVehicles;
  }

  async loadLastTripAutonomous(vehicles: number[]) {
    const outputVehicles: Array<any> = [];
    for (const currentVehicles of ArrayUtils.splitIntoChunks(vehicles, 999)) {
      const parameters = currentVehicles.map(() => "?").join(", ");
      outputVehicles.push(
        ...(await database.raw(
          `
      SELECT T1.CID_COD AS CID_ORI,
      CID_CID_COD AS CID_DES,
      T1.VEI_COD,
      T1.RPA_NUM AS NUM_DOC,
      (CORI.CID_NOM || ' - ' || EORI.UF_SIGLA) AS ORIGEM,
      (CDES.CID_NOM || ' - ' || EDES.UF_SIGLA) AS DESTINO,
      RPA_DT_EMISSAO AS DT_EMISSAO
      FROM (SELECT ROW_NUMBER() OVER (PARTITION BY VEI_COD ORDER BY RPA_NUM DESC) as POS, RPA.CID_COD, RPA.CID_CID_COD, RPA.VEI_COD, RPA.RPA_NUM, RPA.RPA_DT_EMISSAO FROM RPA) T1
      JOIN CIDADE CORI ON CORI.CID_COD = T1.CID_COD
      JOIN ESTADO EORI ON CORI.UF_COD = EORI.UF_COD
      JOIN CIDADE CDES ON CDES.CID_COD = T1.CID_CID_COD
      JOIN ESTADO EDES ON CDES.UF_COD = EDES.UF_COD
      WHERE T1.POS = 1 AND VEI_COD IN (${parameters})
      `,
          currentVehicles
        ))
      );
    }
    return outputVehicles;
  }

  async searchInApi(latitude: number, longitude: number, placa: string) {
    console.log("--------------------API NOMINATIN----------------------");
    console.log("Placa: ", placa);
    const data = (
      await axios.get("https://nominatim.openstreetmap.org/reverse", {
        params: {
          format: "json",
          lat: latitude,
          lon: longitude,
        },
      })
    ).data;
    console.log(data);

    const city = TextUtils.normalize(
      data.address.town ||
        data.address.city ||
        data.address.city_district ||
        data.address.village ||
        data.address.road ||
        data.address.industrial
    ).trim();
    const state = TextUtils.normalize(data.address.state).trim();

    const tuple = await database("con_localizacoes")
      .first()
      .where("estado", state)
      .select("sigla_estado");

    const siglaEstado = tuple ? tuple.sigla_estado : "NC";

    console.log("Com tratamento", `${city} - ${siglaEstado}`);
    console.log(
      "Sem tratamento",
      `${data.address.town} || ${data.address.city} || ${data.address.city_district} || ${data.address.village} || ${data.address.road} || ${data.address.industrial} - ${siglaEstado}`
    );
    console.log("-------------------------------------------------------");

    return `${city} - ${siglaEstado}`;
  }

  async populateLocalTable() {
    console.time("Popular tabela");
    console.log("Carregando lista de coordenadas");
    const data = await this.list();
    console.log("Separando cidades vazias");
    const cidadesVazias = data.filter((i) => !i.cidade_atual);

    console.log("Atualizando cache local");
    await database("con_coordenadas_veiculos").delete();
    await database("con_coordenadas_veiculos").insert(data);
    console.timeEnd("Popular tabela");

    return cidadesVazias;
  }

  async list() {
    console.log("Carregando coordenadas dos veiculos da integracao");
    const coordenadas = await this.getVehiclesCoodinates();
    const totalPages = Math.ceil(coordenadas.length / 1000) || 1;

    const accumulatorPromise = [];
    for (let page = 1; page <= totalPages; page++) {
      const start = (page - 1) * 1000;
      const end = start + 999;
      console.log(`Carregando Chunk de dados ${page} dos veiculos`);
      const queryTipoVeiculo = await database("VEICULO")
        .select([
          "VEI_PLACA as placa",
          "VEI_CATEGORIA as categoria",
          "VEI_COD as codigo_veiculo",
        ])
        .whereIn(
          "VEI_PLACA",
          coordenadas.slice(start, end).map((i) => i.placa)
        );
      accumulatorPromise.push(queryTipoVeiculo);
    }

    const categorias = [];
    for (const i of await Promise.all(accumulatorPromise)) {
      categorias.push(...i);
    }

    const veiculosAutonomos = [];
    const veiculosFrotas = [];
    for (const i of categorias) {
      if (i.categoria === "A" || i.categoria === "C") {
        veiculosAutonomos.push(i.codigo_veiculo);
      } else if (i.categoria === "F") {
        veiculosFrotas.push(i.codigo_veiculo);
      } else {
        console.log("CATEGORIA DE VEICULO QUE NAO DEVERIA APARECER", i);
      }
    }
    console.log("Carregando ultima viagem dos veiculos");
    const [lastTripsFleet, lastTripsAutonomous] = await Promise.all([
      this.loadLastTripFleet(veiculosFrotas),
      this.loadLastTripAutonomous(veiculosAutonomos),
    ]);

    console.log("Traduzindo a saida para o formato desejado");
    const tradutorCodigosPlacas = new Map();
    const tradutorCategoriaVeiculo = new Map();
    for (const i of categorias) {
      tradutorCategoriaVeiculo.set(i.placa, i.categoria);
      tradutorCategoriaVeiculo.set(i.codigo_veiculo, i.categoria);
      tradutorCodigosPlacas.set(i.placa, i.codigo_veiculo);
      tradutorCodigosPlacas.set(i.codigo_veiculo, i.placa);
    }

    const veiculos = coordenadas.map((veiculo: Record<string, any>) => {
      const tipoDocumento = ["A", "C"].includes(
        tradutorCategoriaVeiculo.get(veiculo.placa)
      )
        ? "RPA"
        : tradutorCategoriaVeiculo.get(veiculo.placa)
        ? "DVF"
        : null;
      const arrayViagem =
        tipoDocumento === "RPA" ? lastTripsAutonomous : lastTripsFleet;
      const codigoVeiculo = tradutorCodigosPlacas.get(veiculo.placa);
      const ultimaViagem = arrayViagem.find(
        (i: Record<string, any>) => i.VEI_COD === codigoVeiculo
      );
      return {
        mct: veiculo.mct,
        placa: veiculo.placa,
        lat: veiculo.lat ?? null,
        lon: veiculo.lon ?? null,
        documento: ultimaViagem?.NUM_DOC ?? null,
        tipo_documento: tipoDocumento,
        cidade_atual: veiculo.cidade_uf
          ? TextUtils.normalize(veiculo.cidade_uf).trim()
          : null,
        codigo_veiculo: codigoVeiculo ?? null,
        ultima_viagem_origem: ultimaViagem?.ORIGEM
          ? TextUtils.normalize(ultimaViagem.ORIGEM)
          : null,
        ultima_viagem_destino: ultimaViagem?.DESTINO
          ? TextUtils.normalize(ultimaViagem.DESTINO)
          : null,
        categoria_veiculo: tradutorCategoriaVeiculo.get(veiculo.placa),
        data_emissao_documento: ultimaViagem?.DT_EMISSAO,
      };
    });
    return veiculos;
  }
}

export default async function () {
  async function job() {
    console.log("--------------JOB COORDENADAS--------------");
    console.time("JOB COORDENADAS");
    const service = new ServiceCoordinates();
    const cidadesVazias = await service.populateLocalTable();
    console.log("tenho que buscar ", cidadesVazias.length, " cidades");
    console.log(
      "Buscando cidades na api e salvando na base de dados de tecnologia"
    );
    console.time("AUTOCOMPLETE - Cidades destino");
    await new Promise((resolve) => {
      let requestInProgress = false;
      const interval = setInterval(async () => {
        if (requestInProgress) return;
        if (cidadesVazias.length === 0) {
          clearInterval(interval);
          return resolve(true);
        }
        const cidade = cidadesVazias.pop();
        if (!cidade) {
          throw new Error("Impossivel");
        }

        try {
          requestInProgress = true;
          cidade.cidade_atual = await service.searchInApi(
            cidade.lat,
            cidade.lon,
            cidade.placa
          );
          await Promise.all([
            mssqlCoordenadas("MAXPOSITION")
              .where("PLACA", cidade.placa)
              .where("MCT", cidade.mct)
              .update({
                CIDADE_UF: cidade.cidade_atual,
              }),
            database("con_coordenadas_veiculos")
              .where("placa", cidade.placa)
              .where("mct", cidade.mct)
              .update({
                cidade_atual: cidade.cidade_atual,
              }),
          ]);
          console.log(`Busquei e retornei ${cidade.cidade_atual}`);
          requestInProgress = false;
        } catch (error) {
          requestInProgress = false;
          console.error("Erro no job", error, cidade);
        }
      }, 1000);
    });
    console.timeEnd("AUTOCOMPLETE - Cidades destino");
    console.timeEnd("JOB COORDENADAS");
    console.log("------------FIM JOB COORDENADAS------------");
  }

  cron.schedule("*/30 * * * *", job);
}
