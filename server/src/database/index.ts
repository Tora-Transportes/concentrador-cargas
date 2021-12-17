import knex from "knex";
import knexfile from "../../knexfile";

const oracle = knex(knexfile.configOracle);
const mssql = knex(knexfile.configMssql);
const localizacoes = knex(knexfile.configLocalizacoes);

export default oracle;
export { mssql, localizacoes };
