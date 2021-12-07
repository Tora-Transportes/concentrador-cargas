const baixarNotas = require('./baixar-relatorios');
const minerarNotas = require('./minerar-relatorios');

baixarNotas().then(() => {
    const cargas = minerarNotas();
    console.log(cargas);
});