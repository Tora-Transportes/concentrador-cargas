import { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();
import oracledb from "oracledb";

oracledb.initOracleClient({
  libDir: process.env.DB_ORACLE_LIB_DIR,
});

const configOracle: Knex.Config = {
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
};

const configMssql: Knex.Config = {
  client: "mssql",
  connection: {
    user: process.env.DB_MSSQL_USERNAME,
    password: process.env.DB_MSSQL_PASSWORD,
    server: process.env.DB_MSSQL_HOST,
    database: process.env.DB_MSSQL_DATABASE,
    debug: true,
    connectTimeout: 90000,
    ssl: { rejectUnauthorized: false },
    options: {
      encrypt: true,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
  },
};

const configCoordenadas: Knex.Config = {
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
};

const configMssqlPPO: Knex.Config = {
  client: "mssql",
  connection: {
    user: process.env.DB_MSSQL_PPO_USERNAME,
    password: process.env.DB_MSSQL_PPO_PASSWORD,
    server: process.env.DB_MSSQL_PPO_HOST,
    database: process.env.DB_MSSQL_PPO_DATABASE,
    debug: true,
    connectTimeout: 90000,
    ssl: { rejectUnauthorized: false },
    options: {
      encrypt: true,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
  },
};

const configMssqlPPOView: Knex.Config = {
  client: "mssql",
  connection: {
    user: process.env.DB_MSSQL_PPO_VIEW_USERNAME,
    password: process.env.DB_MSSQL_PPO_VIEW_PASSWORD,
    server: process.env.DB_MSSQL_PPO_VIEW_HOST,
    database: process.env.DB_MSSQL_PPO_VIEW_DATABASE,
    debug: true,
    connectTimeout: 90000,
    ssl: { rejectUnauthorized: false },
    options: {
      encrypt: true,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
  },
};

const configMssqlAutentique: Knex.Config = {
  client: "mssql",
  connection: {
    user: process.env.DB_MSSQL_AUTENTIQUE_USERNAME,
    password: process.env.DB_MSSQL_AUTENTIQUE_PASSWORD,
    server: process.env.DB_MSSQL_AUTENTIQUE_HOST,
    database: process.env.DB_MSSQL_AUTENTIQUE_DATABASE,
    debug: true,
    connectTimeout: 90000,
    ssl: { rejectUnauthorized: false },
    options: {
      encrypt: true,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
  },
};

export default {
  configMssql,
  configOracle,
  configCoordenadas,
  configMssqlPPO,
  configMssqlPPOView,
  configMssqlAutentique,
};
