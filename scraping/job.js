const cron = require('node-cron');
const main = require('./index');

console.log("Iniciando");
const login = async () => {
    console.log("|--------------Rodando job--------------|");
    await main().catch(console.error);
    console.log("|---------------------------------------|");
};
cron.schedule("*/3 * * * *", login);