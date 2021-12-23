const cron = require('node-cron');
const main = require('./index');

console.log("Iniciando");
cron.schedule("* * * * *", async () => {
    console.log("|--------------Rodando job--------------|");
    await main();
    console.log("|---------------------------------------|");
});