require("dotenv").config();
require("oracledb").initOracleClient({
  libDir: process.env.DB_ORACLE_LIB_DIR,
});

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
    },
});
  


class Generator {
    constructor() {
        this.counter = 0;
        this.currentDate = new Date().getTime();
    }

    nextId() {
        const current = new Date().getTime();
        if(current === this.currentDate) {
            this.counter++;
        } else {
            this.counter = 0;
            this.currentDate = current;
        }

        return `P-${this.currentDate}-${this.counter}`;
    }
    
}

async function factoryCarga(row, id, cnpjResolver) {
    const normalizeText = text => text.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    return {
        id: id,
        cliente: await cnpjResolver(row.cnpj_fornecedor),
        e_lote: false,
        origem_carga: row.uf_origem && row.municipio_origem ? normalizeText(`BRASIL/${row.uf_origem}/${row.municipio_origem}`) : null,
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

async function main() {
    await baixarNotas();

    const cargas = minerarNotas();
    fs.writeFileSync("output.json", JSON.stringify(cargas));
    
    const generator = new Generator();
    const fornecedoresCache = new Map();
    
    const cargasFormatadas = await Promise.all(cargas.map(i => factoryCarga(i, generator.nextId(), async (cnpj) => {
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
    const agent = new https.Agent({  
        rejectUnauthorized: false
    });

    try {
        await axios.post(`${process.env.URL_API}/portal/cargas`, {
            cargas: cargasFormatadas
        }, {
            httpsAgent: agent
        });
    } catch (error) {
        console.log(error);
    }
}

main().then(()=> {
    process.exit(0);
});