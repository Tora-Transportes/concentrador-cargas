const cron = require('node-cron');
const main = require('./index');

console.log("Iniciando");
const login = async () => {
    console.log("|--------------Rodando job--------------|");
    await main();
    console.log("|---------------------------------------|");
};
cron.schedule("* * * * *", login);