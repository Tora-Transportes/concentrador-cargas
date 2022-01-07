import knex from "knex";
import knexfile from "../../knexfile";

const oracle = knex(knexfile.configOracle);
const mssql = knex(knexfile.configMssql);
const mssqlCoordenadas = knex(knexfile.configCoordenadas);

export default oracle;
export { mssql, mssqlCoordenadas };
