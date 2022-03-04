import database, { mssqlCoordenadas, mssql } from "../../database";
import axios from "axios";
import cron from "node-cron";
import TextUtils from "../../Utils/text";
import ArrayUtils from "../../Utils/array";
import DateUtils from "../../Utils/date";

class ServiceCoordinates {
  private tokensMapsRoute: Array<string> = [];
  private counterMapsRouter = 0;
  constructor() {
    this.tokensMapsRoute =
      process.env.BING_MAPS_API_TOKEN?.split(";").filter((i) => !!i) ?? [];
    if (!this.tokensMapsRoute || this.tokensMapsRoute.length === 0) {
      throw new Error("Os tokens BING_MAPS_API_TOKEN não foram definidos");
    }
  }

  nextDistanceToken() {
    return this.tokensMapsRoute[
      this.counterMapsRouter++ % this.tokensMapsRoute.length
    ];
  }

  async getVehiclesCoodinates() {
    return mssqlCoordenadas(
      mssqlCoordenadas.raw(`
      (select *,
      ROW_NUMBER() OVER (PARTITION BY PLACA ORDER BY DT_ALTERACAO DESC) POSITION
      from MAXPOSITION
      where placa is not null) t1
    `)
    )
      .select([
        "MCT as mct",
        "PLACA as placa",
        "LAT as lat",
        "LON as lon",
        "CIDADE_UF as  cidade_uf",
      ])
      .where("POSITION", 1)
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
        FROM (SELECT ROW_NUMBER() OVER (PARTITION BY COD_CAVALO ORDER BY DVF_DT_EMISSAO DESC) as POS, DVF.CID_ORI, DVF.CID_DES, DVF.COD_CAVALO, DVF.NUM_DVF, DVF.DVF_DT_EMISSAO FROM DVF) T1 
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
      FROM (SELECT ROW_NUMBER() OVER (PARTITION BY VEI_COD ORDER BY RPA_DT_EMISSAO DESC) as POS, RPA.CID_COD, RPA.CID_CID_COD, RPA.VEI_COD, RPA.RPA_NUM, RPA.RPA_DT_EMISSAO FROM RPA) T1
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
    console.time("Carregando dados para popular");
    const data = await this.list();
    console.timeEnd("Carregando dados para popular");

    console.log(
      "Calculando distancia prevista com base na tabela de rotas da produção"
    );
    const distanciasAProcurar = new Set<string>();
    for (const i of data) {
      if (i.ultima_viagem_origem && i.ultima_viagem_destino) {
        distanciasAProcurar.add(
          `${i.ultima_viagem_origem.replace(
            " - ",
            ", "
          )}_${i.ultima_viagem_destino.replace(" - ", ", ")}`
        );
      }
    }
    const cidadesAProcurar = Array.from<string>(distanciasAProcurar);
    if (cidadesAProcurar.length > 0) {
      const distancias: Array<Record<string, number | string>> =
        await mssql.raw(
          `select distancia, concat(origem,'_' ,destino) as token from ROTAS_OPERACAO_NEW where concat(origem,'_' ,destino) in (${cidadesAProcurar
            .map(() => `?`)
            .join(",")})`,
          cidadesAProcurar
        );

      const hash = new Map();
      for (const i of distancias) {
        const { distancia, token } = i;
        hash.set(token, distancia);
      }

      for (let i = 0; i < data.length; i++) {
        if (!data[i].ultima_viagem_destino || !data[i].ultima_viagem_origem) {
          continue;
        }

        const token = `${String(data[i].ultima_viagem_origem).replace(
          " - ",
          ", "
        )}_${String(data[i].ultima_viagem_destino).replace(" - ", ", ")}`;
        if (hash.get(token)) {
          data[i].distancia_prevista = hash.get(token) ?? null;
          data[i].tempo_ate_destino = this.calcularPrevisaoDeChegada(
            hash.get(token)
          ) as any;

          const DIA_EM_MS = 60 * 60 * 24 * 1000;
          const previsaoChegadaEmMs =
            new Date(data[i].data_emissao_documento).getTime() +
            DIA_EM_MS +
            Number(data[i].tempo_ate_destino) * 1000;

          const dataPrevisaochegada = new Date();
          dataPrevisaochegada.setTime(previsaoChegadaEmMs);
          data[i].data_previsao_chegada = dataPrevisaochegada as any;
        }
      }
    }

    console.time("Separando cidades vazias");
    const cidadesVazias = data.filter((i) => !i.cidade_atual);
    console.timeEnd("Separando cidades vazias");

    console.time("Atualizando cache local");
    await database("con_coordenadas_veiculos").delete();
    await database("con_coordenadas_veiculos").insert(data);
    console.timeEnd("Atualizando cache local");
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
      const queryTipoVeiculo = database("VEICULO")
        .select([
          "VEICULO.VEI_PLACA as placa",
          "VEICULO.VEI_CATEGORIA as categoria",
          "VEICULO.VEI_COD as codigo_veiculo",
          "AREA_PRODUCAO.ARE_DSC as area_producao",
          "SETOR_VEICULO.SV_DSC as setor_veiculo",
          "CADASTRO_GERAL.CG_NOME as nome_motorista",
          "TV_CAVALO.TV_DSC as tipo_cavalo",
          "TV_CARRETA.TV_DSC as tipo_carreta",
          database.raw(
            '(CGA_MOT_CEL.CGA_DDD || CGA_MOT_CEL.CGA_TELEFONE) "telefone_motorista"'
          ),
        ])
        .leftJoin("CADASTRO_GERAL", "CADASTRO_GERAL.CG_COD", "VEICULO.CG_MOT")
        .leftJoin("SETOR_VEICULO", "SETOR_VEICULO.SV_COD", "VEICULO.SV_COD")
        .leftJoin("AREA_PRODUCAO", "AREA_PRODUCAO.ARE_COD", "VEICULO.ARE_COD")
        .leftJoin(
          "TIPO_VEICULO as TV_CAVALO",
          "TV_CAVALO.TV_COD",
          "VEICULO.TV_COD"
        )
        .leftJoin(
          "VEICULO as VEICULO_CARRETA",
          "VEICULO_CARRETA.VEI_COD",
          "VEICULO.COD_CARRETA"
        )
        .leftJoin(
          "TIPO_VEICULO as TV_CARRETA",
          "TV_CARRETA.TV_COD",
          "VEICULO_CARRETA.TV_COD"
        )

        .leftJoin("CADASTRO_GERAL as CG_MOT", function () {
          this.on("CG_MOT.LOC_COD", "VEICULO.LOC_MOT").andOn(
            "CG_MOT.CG_COD",
            "VEICULO.CG_MOT"
          );
        })
        .leftJoin("CG_PRACA as CGP_MOT", function () {
          this.on("CGP_MOT.LOC_COD", "CG_MOT.LOC_COD")
            .andOn("CGP_MOT.CG_COD", "CG_MOT.CG_COD")
            .andOn("CGP_MOT.CGP_SEQ", database.raw("?", [1]));
        })
        .leftJoin("CG_CONTATO as CGC_MOT", function () {
          this.on("CGC_MOT.LOC_COD", "CGP_MOT.LOC_COD")
            .andOn("CGC_MOT.CG_COD", "CGP_MOT.CG_COD")
            .andOn("CGC_MOT.CGP_PRA", "CGP_MOT.CGP_SEQ")
            .andOn("CGC_MOT.CGC_SEQ", database.raw("?", [1]));
        })
        .leftJoin("CG_AGENDA as CGA_MOT_CEL", function () {
          this.on("CGA_MOT_CEL.LOC_CON", "CGC_MOT.LOC_COD")
            .andOn("CGA_MOT_CEL.CG_CON", "CGC_MOT.CG_COD")
            .andOn("CGA_MOT_CEL.CGC_CON", "CGC_MOT.CGP_PRA")
            .andOn("CGA_MOT_CEL.TA_COD", database.raw("?", [2]));
        })

        .whereIn(
          "VEICULO.VEI_PLACA",
          coordenadas.slice(start, end).map((i) => i.placa)
        );
      accumulatorPromise.push(queryTipoVeiculo);
    }

    const complementosDadosVeiculos = [];
    for (const i of await Promise.all(accumulatorPromise)) {
      complementosDadosVeiculos.push(...i);
    }

    const veiculosAutonomos = [];
    const veiculosFrotas = [];
    for (const i of complementosDadosVeiculos) {
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
    const hashComplementosPorPlaca = new Map();
    for (const i of complementosDadosVeiculos) {
      hashComplementosPorPlaca.set(i.placa, i);

      // CALCULO DO SETOR DO VEICULO, ESSE BLOCO TEM UMA GRANDE CHANCE DE SER UMA GAMBIARRA DA PRODUCAO
      const setorVeiculo =
        i.area_producao === "DEDICADO CONGONHAS" && !i.setor_veiculo
          ? "FR-CONGONHAS"
          : i.setor_veiculo;
      hashComplementosPorPlaca.get(i.placa).setor_veiculo = setorVeiculo;
    }

    const veiculos = coordenadas.map((veiculo: Record<string, any>) => {
      const tipoDocumento = ["A", "C"].includes(
        hashComplementosPorPlaca.get(veiculo.placa)?.categoria
      )
        ? "RPA"
        : hashComplementosPorPlaca.get(veiculo.placa)?.categoria
        ? "DVF"
        : null;
      const arrayViagem =
        tipoDocumento === "RPA" ? lastTripsAutonomous : lastTripsFleet;
      const codigoVeiculo = hashComplementosPorPlaca.get(
        veiculo.placa
      )?.codigo_veiculo;
      const ultimaViagem = arrayViagem.find(
        (i: Record<string, any>) => i.VEI_COD === codigoVeiculo
      );
      return {
        mct: veiculo.mct,
        placa: veiculo.placa,
        lat: veiculo.lat ?? null,
        lon: veiculo.lon ?? null,
        documento: ultimaViagem?.NUM_DOC ?? null,
        distancia_prevista: null,
        tempo_ate_destino: null,
        data_previsao_chegada: null,
        tipo_documento: tipoDocumento,
        codigo_veiculo: codigoVeiculo ?? null,
        data_emissao_documento: ultimaViagem?.DT_EMISSAO,
        cidade_atual: veiculo.cidade_uf
          ? TextUtils.normalize(veiculo.cidade_uf).trim()
          : null,
        ultima_viagem_origem: ultimaViagem?.ORIGEM
          ? TextUtils.normalize(ultimaViagem.ORIGEM)
          : null,
        ultima_viagem_destino: ultimaViagem?.DESTINO
          ? TextUtils.normalize(ultimaViagem.DESTINO)
          : null,
        categoria_veiculo: hashComplementosPorPlaca.get(veiculo.placa)
          ?.categoria,
        setor_veiculo:
          hashComplementosPorPlaca.get(veiculo.placa)?.setor_veiculo ?? null,
        nome_motorista:
          hashComplementosPorPlaca.get(veiculo.placa)?.nome_motorista ?? null,
        telefone_motorista:
          hashComplementosPorPlaca.get(veiculo.placa)?.telefone_motorista ??
          null,
        tipo_cavalo:
          hashComplementosPorPlaca.get(veiculo.placa)?.tipo_cavalo ?? null,
        tipo_carreta:
          hashComplementosPorPlaca.get(veiculo.placa)?.tipo_carreta ?? null,
      };
    });
    return veiculos;
  }

  async getCoordinatesFromAPI(city: string, state: string, country?: string) {
    const data = (
      await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          format: "json",
          city,
          state,
          country,
        },
        headers: {
          "Accept-Language": "pt-br",
        },
      })
    ).data;

    return data;
  }

  async getDistancesFromAPI(
    origin_lat: string,
    origin_lon: string,
    target_lat: string,
    target_lon: string
  ) {
    const api_key = String(this.nextDistanceToken());

    const data = (
      await axios.post(
        `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?key=${api_key}`,
        {
          origins: [
            {
              latitude: origin_lat,
              longitude: origin_lon,
            },
          ],
          destinations: [
            {
              latitude: target_lat,
              longitude: target_lon,
            },
          ],
          travelMode: "Driving",
          timeUnit: "second",
        }
      )
    ).data;

    return data;
  }

  calcularPrevisaoDeChegada(distancia: number) {
    return (
      Math.trunc(distancia / 500) * 86400 +
      (((distancia % 500) * 8) / 500) * 60 * 60
    );
  }

  async removerObservacoesEAtualizarDocumentosModificados() {
    await database.raw(`merge into "con_dados_coordenadas" dados
    using "con_coordenadas_veiculos" coord
    on (dados."fk_placa" = coord."placa")
    when matched then update set dados."ultimo_documento" = coord."documento", dados."observacao" = null, dados."usuario_observacao" = null where ("ultimo_documento" <> "documento" or ("ultimo_documento" is null and "documento" is not null))
    when not matched then insert ("fk_placa", "ultimo_documento") values (coord."placa", coord."documento")`);
  }
}

export default async function () {
  async function calcDistance(service: ServiceCoordinates, vehicle: any) {
    const response = await service.getDistancesFromAPI(
      vehicle.lat,
      vehicle.lon,
      vehicle.lat_destino,
      vehicle.lon_destino
    );
    const tripInfo = response?.resourceSets[0]?.resources[0]?.results[0];
    if (
      tripInfo &&
      tripInfo.travelDistance !== -1 &&
      tripInfo.travelDuration !== -1
    ) {
      const { travelDistance } = tripInfo;
      const actualVehicle = await database("con_veiculos_distancia")
        .where("fk_placa", vehicle.placa)
        .first();
      if (actualVehicle) {
        await database("con_veiculos_distancia")
          .update({
            distancia_ate_destino: travelDistance,
            data_atualizacao: DateUtils.getCurrentDate(),
          })
          .where("fk_placa", vehicle.placa);
      } else {
        await database("con_veiculos_distancia").insert({
          fk_placa: vehicle.placa,
          distancia_ate_destino: travelDistance,
          data_atualizacao: DateUtils.getCurrentDate(),
        });
      }
    }
  }

  async function job() {
    console.log("--------------JOB COORDENADAS--------------");
    console.time("JOB COORDENADAS");
    const service = new ServiceCoordinates();
    const cidadesVazias = await service.populateLocalTable();
    console.log("tenho que buscar ", cidadesVazias.length, " cidades");

    try {
      console.time("Atualizando documentos e removendo observacoes");
      await service.removerObservacoesEAtualizarDocumentosModificados();
      console.timeEnd("Atualizando documentos e removendo observacoes");
    } catch (error) {
      console.error("PUTS");
      throw "cole";
    }

    console.log(
      "Buscando cidades na api e salvando na base de dados de tecnologia"
    );
    const promiseUpdateCityName = new Promise((resolve) => {
      console.time("AUTOCOMPLETE - Cidades destino");
      let requestInProgress = false;
      const interval = setInterval(async () => {
        if (requestInProgress) return;
        if (cidadesVazias.length === 0) {
          console.timeEnd("AUTOCOMPLETE - Cidades destino");
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

    console.time("CALC - DISTANCIA VEICULOS");
    console.log("Calculando distancia e salvando na base de dados");
    console.log("Carregando veiculos em memoria para completar com distancia");
    const veiculos = await database.raw(`
      select "placa", "con_coordenadas_veiculos"."lat", "con_coordenadas_veiculos"."lon", "ultima_viagem_destino", "con_localizacoes"."lat" "lat_destino", "lng" "lon_destino"
        from "con_coordenadas_veiculos"
        left join "con_localizacoes" on ("cidade" || ' - ' || "sigla_estado") = "ultima_viagem_destino"
        where "con_coordenadas_veiculos"."lat" is not null and "con_coordenadas_veiculos"."lon" is not null and "con_coordenadas_veiculos"."ultima_viagem_destino" is not null and "placa" is not null
    `);

    const jobsApiDistance = new Set();
    for (let i = 0; i < veiculos.length; i++) {
      const veiculo = veiculos[i];

      // este bloco atualiza as informações das cidades para funcionar como uma especie de cache
      if (veiculo.lat_destino === null || veiculo.lon_destino === null) {
        const [city, state] = String(veiculo.ultima_viagem_destino).split(
          " - "
        );

        if (state === "NC") {
          continue;
        }
        const coords = await service.getCoordinatesFromAPI(city, state);
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });

        if (coords.length === 0) {
          continue;
        }

        const { lat, lon } = coords[0];
        console.log(
          "Encontrei as coordenadas ",
          coords[0],
          " para a localidade de ",
          city,
          state
        );
        const cityExists = await database("con_localizacoes")
          .select("cidade")
          .where("cidade", city)
          .where("sigla_estado", state)
          .first();
        if (cityExists) {
          await database("con_localizacoes")
            .update({
              lat,
              lng: lon,
            })
            .where("cidade", city)
            .where("sigla_estado", state);
        } else {
          const fields = coords[0]?.display_name?.split(", ");
          const pais =
            fields.length > 0
              ? fields[fields.length - 1].toUpperCase().trim()
              : "BRASIL";
          const countryInfo = await database("con_localizacoes")
            .select(["sigla_pais", "sigla_pais_estendida", "estado"])
            .where("sigla_estado", state)
            .where("pais", pais)
            .whereNotNull("estado")
            .whereNotNull("sigla_pais")
            .whereNotNull("sigla_pais_estendida")
            .first();
          await database("con_localizacoes").insert({
            id: 2,
            lat,
            lng: lon,
            cidade: city,
            pais,
            sigla_pais: countryInfo?.sigla_pais ?? "NC",
            sigla_pais_estendida: countryInfo?.sigla_pais_estendida ?? "NC",
            estado: countryInfo?.estado ?? null,
            sigla_estado: state,
          });
        }
        for (let j = i; j < veiculos.length; j++) {
          if (veiculos[j].ultima_viagem_destino === `${city} - ${state}`) {
            veiculos[j].lat_destino = lat;
            veiculos[j].lon_destino = lon;
          }
        }
      }

      jobsApiDistance.add(veiculo);

      if (jobsApiDistance.size >= 5) {
        console.log("Processando lote");
        console.time(`Lote com ${jobsApiDistance.size}`);
        await Promise.all(
          Array.from(jobsApiDistance).map((j) =>
            calcDistance(service, j).catch(console.error)
          )
        );
        console.timeEnd(`Lote com ${jobsApiDistance.size}`);
        jobsApiDistance.clear();
      }
    }

    if (jobsApiDistance.size > 0) {
      console.log("Processando lote final", jobsApiDistance);
      console.time(`Lote com ${jobsApiDistance.size}`);
      await Promise.all(
        Array.from(jobsApiDistance).map((j) =>
          calcDistance(service, j).catch(console.error)
        )
      );
      console.timeEnd(`Lote com ${jobsApiDistance.size}`);
      jobsApiDistance.clear();
    }
    console.timeEnd("CALC - DISTANCIA VEICULOS");

    await promiseUpdateCityName;

    console.timeEnd("JOB COORDENADAS");
    console.log("------------FIM JOB COORDENADAS------------");
  }
  cron.schedule("0 * * * *", job);
}
