import knex from "knex";
import knexfile from "../../knexfile";

console.log("INICIANDO DB");

const oracle = knex(knexfile.configOracle);
const mssql = knex(knexfile.configMssql);
const mssqlCoordenadas = knex(knexfile.configCoordenadas);

export default oracle;
export { mssql, mssqlCoordenadas };
