import knex from "knex";
import knexfile from "../../knexfile";

console.log("INICIANDO DB");

const oracle = knex(knexfile.configOracle);
const mssql = knex(knexfile.configMssql);
const mssqlCoordenadas = knex(knexfile.configCoordenadas);
const mssqlPPO = knex(knexfile.configMssqlPPO);

export default oracle;
export { mssql, mssqlCoordenadas, mssqlPPO };
