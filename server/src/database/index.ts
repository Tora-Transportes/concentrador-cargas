import knex from "knex";
import knexfile from "../../knexfile";

const oracle = knex(knexfile.configOracle);
const mssql = knex(knexfile.configMssql);

export default oracle;
export { mssql };
