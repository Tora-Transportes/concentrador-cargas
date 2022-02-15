require("dotenv").config();
require("oracledb").initOracleClient({
  libDir: process.env.DB_ORACLE_LIB_DIR,
});
const moment = require("moment-timezone");

const path = require("path");
const https = require("https");
const axios = require("axios").default;
const baixarNotas = require('./baixar-relatorios');
const minerarNotas = require('./minerar-relatorios');

const fs = require('fs');
const database = require('knex')({
    client: "oracledb",
    connection: {
      connectString: process.env.DB_ORACLE_HOST,
      server: process.env.DB_ORACLE_HOST,
      host: process.env.DB_ORACLE_HOST,
      user: process.env.DB_ORACLE_USERNAME,
      password: process.env.DB_ORACLE_PASSWORD,
      requestTimeout: 100,
      port: Number(process.env.DB_ORACLE_PORT),
      charset: "utf8",
      pool: {
        min: 2,
        max: 10,
      },
    },
});

const deParaTransportadorCarga = new Map();
deParaTransportadorCarga.set("20468310005020", {origem: "BRASIL/MG/SANTA LUZIA", cliente: "60894730002582", filial: 157});
deParaTransportadorCarga.set("20468310007317", {origem: "BRASIL/MG/IMBIRUCU", cliente: "60894730002582", filial: 154});
deParaTransportadorCarga.set("20468310009603", {origem: "BRASIL/MG/IPATINGA", cliente: "60894730002582", filial: 26});
  
function normalizeText (text){
    return text.toUpperCase()
        .normalize("NFD")
        .trim()
        .replace(/[\u0300-\u036f]/g, "");
}

function getCurrentDate() {
    const currentDate = moment
      .utc(moment.tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss"))
      .toDate();
    return currentDate;
}

async function enviarCargasParaApi(cargas) {
    const agent = new https.Agent({  
        rejectUnauthorized: false
    });

    try {
        await axios.post(`${process.env.URL_API}/portal/cargas`, {
            cargas
        }, {
            httpsAgent: agent
        });
    } catch (error) {
        console.log(error);
    }
}

function agruparCargasPorDocumento(cargas) {
    const hashCargas = new Map();

    for(const i of cargas) {
        if(hashCargas.has(i.documento_transporte)) {
            hashCargas.get(i.documento_transporte).observacao = hashCargas.get(i.documento_transporte).observacao || "";
            hashCargas.get(i.documento_transporte).quantidade = Number(hashCargas.get(i.documento_transporte).quantidade) + Number(i.quantidade);
            hashCargas.get(i.documento_transporte).quantidade_atual = hashCargas.get(i.documento_transporte).quantidade;
            hashCargas.get(i.documento_transporte).observacao += "Carga: "+i.tipo_carga+",\nQuantidade: "+i.quantidade+",\nUnidade medida: "+i.unidade_medida+"\n\n";
        } else {
            hashCargas.set(i.documento_transporte, i);
        }
    }
    const cargasAgrupadas = [];
    for(const i of hashCargas) {
        cargasAgrupadas.push(i[1]);
    }
    return cargasAgrupadas;
}

async function popularClientes(cargas) {
    const clientes = new Set();
    for(const i of cargas) {
        clientes.add(i.cliente);
    }

    const cnpjs = await database("ORGANIZACAO as ORG")
    .join("PRACA as PRA", "PRA.ORG_COD", "ORG.ORG_COD")
    .join("CIDADE as CID", "CID.CID_COD", "PRA.CID_COD")
    .join("ESTADO as EST", "EST.UF_COD", "CID.UF_COD")
    .select([
        "ORG.ORG_RAZAO_SOCIAL AS organizacao",
        "ORG.ORG_FANTASIA AS organizacao_fantasia",
        "PRA.PCA_DOC_FEDERAL as documento_federal",
        "PRA.PCA_END as endereco",
        "CID.CID_NOM as cidade",
        "EST.UF_SIGLA as uf",
    ])
    .whereIn("PRA.PCA_DOC_FEDERAL", Array.from(clientes));

    const fornecedoresCache = new Map();
    for(const i of cnpjs) {
        const value = `${i.organizacao} - ${i.documento_federal} - ${i.cidade}/${i.uf}`;
        fornecedoresCache.set(i.documento_federal, value);
    }

    return cargas.map(i => ({...i, cliente: fornecedoresCache.get(i.cliente) || i.cliente}));
}

function factoryCarga(row) {
    const {cliente, origem, filial} = deParaTransportadorCarga.get(row.cnpj_fornecedor);
    if(!cliente || !origem || !filial) {
        console.error(`O de para falhou com o cnpj '${i.cnpj_fornecedor}' > retornou cliente: ${cliente} | origem: ${origem} | filial: ${filial}`);
    }

    return {
        cliente: cliente,
        e_lote: false,
        origem_carga: origem,
        destino_carga: row.uf_destino && row.municipio_destino ? normalizeText(`BRASIL/${row.uf_destino}/${row.municipio_destino}`): null,
        data_entrega: null,
        data_coleta: null,
        tipo_carga: row.produto,
        quantidade: row.peso_etapa,
        unidade_medida: row.unidade_medida_documento,
        responsavel_cadastro: "BOT IMPORTACAO PORTAL",
        canal_comunicacao: "portal",
        observacao: null,
        data_cadastro: getCurrentDate(),
        data_atualizacao: getCurrentDate(),
        ativo: 1,
        acessorios_requisitos: null,
        usuario: "BOT IMPORTACAO PORTAL",
        informacoes_restritivas: null,
        janela_coleta: null,
        janela_entrega: null,
        local_coleta: row.origem,
        local_entrega: row.destino,
        fk_lote_pai: null,
        quantidade_atual: row.peso_etapa,
        fk_situacao: 1,
        placa_veiculo: null,
        observacao_gr: null,
        documento_transporte: row.documento_transporte,
        fk_filial: filial
    }
}

function deleteFolderRecursive(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file, index) => {
            const curPath = path.join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(directoryPath);
    }
}

async function main() {
    deleteFolderRecursive("htmls");
    try {
        await baixarNotas();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    const cargas = minerarNotas().filter(i => {
        return ["20468310005020","20468310007317","20468310009603"].includes(String(i.cnpj_fornecedor));
    });
    
    const cargasSemFornecedores = cargas.map(factoryCarga);
    const cargasComFornecedores = await popularClientes(cargasSemFornecedores);
    const cargasAgrupadas = agruparCargasPorDocumento(cargasComFornecedores);
    fs.writeFileSync("output.json", JSON.stringify(cargasAgrupadas));

    console.log("Enviando", cargasAgrupadas.length, "cargas");
    enviarCargasParaApi(cargasAgrupadas);
}

module.exports = main;