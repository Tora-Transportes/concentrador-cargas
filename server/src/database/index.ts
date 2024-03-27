import knex from "knex";
import knexfile from "../../knexfile";

console.log("INICIANDO DB");

const oracle = knex(knexfile.configOracle);
const mssql = knex(knexfile.configMssql);
const mssqlCoordenadas = knex(knexfile.configCoordenadas);
const mssqlPPO = knex(knexfile.configMssqlPPO);
const mssqlPPOView = knex(knexfile.configMssqlPPOView);
const mssqlAutentique = knex(knexfile.configMssqlAutentique);
const mssqlConcV2 = knex(knexfile.configMssqlConcV2);

export default oracle;
export {
  mssql,
  mssqlCoordenadas,
  mssqlPPO,
  mssqlPPOView,
  mssqlAutentique,
  mssqlConcV2,
};
