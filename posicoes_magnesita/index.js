require("dotenv").config();
const knex = require("knex");
const oracledb = require("oracledb");
const cron = require("node-cron");
const fs = require("fs");
const axios = require("axios").default;

if (process.env.DB_ORACLE_LIB_DIR) {
  oracledb.initOracleClient({
    libDir: process.env.DB_ORACLE_LIB_DIR,
  });
}

const oracleDatabase = knex({
  client: "oracledb",
  connection: {
    connectString: process.env.DB_ORACLE_HOST,
    server: process.env.DB_ORACLE_HOST,
    host: process.env.DB_ORACLE_HOST,
    user: process.env.DB_ORACLE_USERNAME,
    password: process.env.DB_ORACLE_PASSWORD,
    requestTimeout: 100,
    port: Number(process.env.DB_ORACLE_PORT),
    charset: "utf8",
  },
  pool: {
    min: 2,
    max: 10,
  },
});

const mssqlDatabase = knex({
  client: "mssql",
  connection: {
    user: process.env.DB_MSSQL_COORDENADA_USERNAME,
    password: process.env.DB_MSSQL_COORDENADA_PASSWORD,
    server: process.env.DB_MSSQL_COORDENADA_HOST,
    database: process.env.DB_MSSQL_COORDENADA_DATABASE,
    debug: true,
    connectTimeout: 90000,
    ssl: { rejectUnauthorized: false },
    options: {
      encrypt: true,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
  },
});

const SITUACAO_DOCUMENTO_EMITIDO = 6;
const SITUACOES_APROVADO_PELO_GR = 3;
const DIAS_A_ENVIAR_APOS_EMISSAO = 2;

async function buscarCoordenadasVeiculos(placas) {
  return mssqlDatabase(
    mssqlDatabase.raw(`
        (select *,
        ROW_NUMBER() OVER (PARTITION BY PLACA ORDER BY DT_ALTERACAO DESC) POSITION
        from MAXPOSITION
        where placa is not null) t1
        `)
  )
    .select([
      "MCT as mct",
      "PLACA as placa",
      "LAT as latitude",
      "LON as longitude",
      "CIDADE_UF as cidade_uf",
    ])
    .where("POSITION", 1)
    .andWhereRaw("YEAR(DT_ALTERACAO) >= '2022'")
    .whereIn("PLACA", placas)
    .orderBy(["PLACA", "MCT"]);
}

async function buscarDataPrevisaoChegada(placas) {
  return oracleDatabase("con_coordenadas_veiculos")
    .select(["placa", "data_previsao_chegada"])
    .whereIn("placa", placas);
}

async function job() {
  const dataAtual = new Date(
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  )
    .toISOString()
    .split(".")[0];
  const query = oracleDatabase("con_cargas")
    .select([
      "id",
      "placa_veiculo",
      "documento_transporte",
      "cliente",
      "data_atualizacao",
      "fk_situacao",
    ])
    .where("cliente", "like", "%MAGNESITA%")
    .whereNotNull("placa_veiculo")
    .whereIn("fk_situacao", [
      SITUACOES_APROVADO_PELO_GR,
      SITUACAO_DOCUMENTO_EMITIDO,
    ]);

  const veiculos = await query;
  const CHUNK_SIZE = 50;
  for (let i = 0; i < veiculos.length; i += CHUNK_SIZE) {
    console.log(`Processando chunk ${i} - ${i + CHUNK_SIZE}`);
    const chunk = veiculos.slice(i, i + CHUNK_SIZE);

    const placas = [...new Set(chunk.map((v) => v.placa_veiculo))];
    const coordenadas = await buscarCoordenadasVeiculos(placas);
    for (const coordenada of coordenadas) {
      for (const veiculo of chunk) {
        if (veiculo.placa_veiculo === coordenada.placa) {
          veiculo.latitude = coordenada.latitude;
          veiculo.longitude = coordenada.longitude;
        }
      }
    }

    const datasPrevisaoChegada = await buscarDataPrevisaoChegada(placas);
    for (const data of datasPrevisaoChegada) {
      for (const veiculo of chunk) {
        if (veiculo.placa_veiculo === data.placa) {
          veiculo.data_previsao_chegada = data.data_previsao_chegada;
        }
      }
    }

    const rastreios = {
      locations: chunk
        .filter((carga) => !!carga.latitude)
        .filter((carga) => {
          if (!carga.data_previsao_chegada) {
            return false;
          }
          return (
            carga.data_previsao_chegada.toISOString().split(".")[0] >= dataAtual
          );
        })
        .map((carga) => ({
          shipper: "59740",
          billOfLading: carga.documento_transporte,
          latitude: carga.latitude,
          longitude: carga.longitude,
        })),
    };
    const stream = fs.createWriteStream(`chunk_${i}_${i + CHUNK_SIZE}.json`);
    await new Promise((resolve) =>
      stream.write(JSON.stringify(rastreios), resolve)
    );

    const response = await axios.post(
      "https://tracking-api.fourkites.com/api/v1/tracking/batch_locations",
      rastreios,
      {
        headers: {
          Authorization: "Basic Zm91cmtpdGVzQHRvcmEuY29tLmJyOkFQIXRvckAzMjE=",
        },
      }
    );
    if (String(response.status) !== "200") {
      console.log(
        `Erro ao enviar chunk ${i} - ${i + CHUNK_SIZE}`,
        response.status
      );
    }
  }
}

// job().then(() => process.exit(0));

console.log("Starting job...");
cron.schedule("*/30 * * * *", job);
