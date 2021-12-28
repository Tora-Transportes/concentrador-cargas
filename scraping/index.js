require("dotenv").config();
require("oracledb").initOracleClient({
  libDir: process.env.DB_ORACLE_LIB_DIR,
});

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



// ORIGEM
const origemDePara = new Map();
// origemDePara.set('LU16', '60894730004011');
// origemDePara.set('LU10', '60894730002906');
// origemDePara.set('LU15', '60894730005093');
// origemDePara.set('LC01', '60894730006308');
// origemDePara.set('LC02', '60894730002663');
// origemDePara.set('LU08', '60894730002582');
// origemDePara.set('LU11', '60894730003120');
// origemDePara.set('LU20', '60894730007703');
origemDePara.set('LU16', 'SP/SAO PAULO');
origemDePara.set('LU08', 'MG/IPATINGA');
origemDePara.set('LC02', 'SP/SANTO ANDRE');
origemDePara.set('LU10', 'MG/SANTA LUZIA');
origemDePara.set('LU11', 'MG/BETIM');
origemDePara.set('LU15', 'MG/CONTAGEM');
origemDePara.set('LC01', 'SP/CUBATAO');
origemDePara.set('LU20', 'SP/ITAQUAQUECETUBA');

// CLIENTE
const clienteDePara = new Map();
clienteDePara.set('LU16', '60894730004011');
clienteDePara.set('LU10', '60894730002582');
clienteDePara.set('LU15', '60894730002582');
clienteDePara.set('LC01', '60894730006308');
clienteDePara.set('LC02', '60894730006308');
clienteDePara.set('LU08', '60894730002582');
clienteDePara.set('LU11', '60894730002582');
clienteDePara.set('LU20', '60894730004011');
  

async function factoryCarga(row, cnpjResolver) {
    const normalizeText = text => text.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    
    const codigoDePara = row.origem.split(" - ")[0];
    const cliente = clienteDePara.get(codigoDePara);
    const origem = origemDePara.get(codigoDePara);

    return {
        cliente: await cnpjResolver(cliente),
        e_lote: false,
        origem_carga: row.origem ? normalizeText(`BRASIL/${origem}`) : null,
        destino_carga: row.uf_destino && row.municipio_destino ? normalizeText(`BRASIL/${row.uf_destino}/${row.municipio_destino}`): null,
        data_entrega: null,
        data_coleta: null,
        tipo_carga: row.produto,
        quantidade: row.peso_etapa,
        unidade_medida: row.unidade_medida_documento,
        responsavel_cadastro: "BOT IMPORTACAO PORTAL",
        canal_comunicacao: "portal",
        observacao: null,
        data_cadastro: new Date(),
        data_atualizacao: new Date(),
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
        documento_transporte: row.documento_transporte
    }
}

const deleteFolderRecursive = function (directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file, index) => {
          const curPath = path.join(directoryPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
           // recurse
            deleteFolderRecursive(curPath);
          } else {
            // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(directoryPath);
      }
    };

async function main() {
    deleteFolderRecursive("htmls");
    try {
        await baixarNotas();
    } catch (error) {
        console.error(error);
        process.exit(1);
        throw error;
    }

    const cargas = minerarNotas().filter(i => {
        const match = "20468310005020";
        return String(i.cnpj_fornecedor) === match;
    });
    fs.writeFileSync("output.json", JSON.stringify(cargas));

    const fornecedoresCache = new Map();
    
    const cargasFormatadas = await Promise.all(cargas.map(i => factoryCarga(i, async (cnpj) => {
        const cached = fornecedoresCache.get(cnpj);
        if(cached) {
            return `${cached.organizacao} - ${cached.documento_federal} - ${cached.cidade}/${cached.uf}`;
        } else {
            const query = await database("ORGANIZACAO as ORG")
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
                .where("PRA.PCA_DOC_FEDERAL", cnpj)
                .first();
            fornecedoresCache.set(cnpj, query);
            return `${query.organizacao} - ${query.documento_federal} - ${query.cidade}/${query.uf}`;
        }
    })));

    const hashCargas = new Map();

    for(const i of cargasFormatadas) {
        if(hashCargas.has(i.documento_transporte)) {
            hashCargas.get(i.documento_transporte).observacao = hashCargas.get(i.documento_transporte).observacao || "";
            hashCargas.get(i.documento_transporte).observacao += "Carga: "+i.tipo_carga+",\nQuantidade: "+i.quantidade+",\nUnidade medida: "+i.unidade_medida+"\n\n";
        } else {
            hashCargas.set(i.documento_transporte, i);
        }
    }
    const cargasParaInserir = [];
    for(const i of hashCargas) {
        cargasParaInserir.push(i[1]);
    }
    console.log("Enviando", cargasParaInserir.length, "cargas");
    const agent = new https.Agent({  
        rejectUnauthorized: false
    });

    try {
        await axios.post(`${process.env.URL_API}/portal/cargas`, {
            cargas: cargasParaInserir
        }, {
            httpsAgent: agent
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = main;
// main().then(()=> {
//     process.exit(0);
// });