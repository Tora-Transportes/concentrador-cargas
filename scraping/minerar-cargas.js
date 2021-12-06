const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

function splitIntoChunks(array = [], chunkSize = 3) {
    return array.reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index/chunkSize);
      
        if(!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []
        }
      
        resultArray[chunkIndex].push(item)
      
        return resultArray
      }, [])
}

function extrairLinhasRelatorio(html) {
    const $ = cheerio.load(html);
    const elementos = [];
    $('.rptSectionItem, .rptAlternatingSectionItem').contents().map( (i, el) => {
        elementos.push($(el).text().trim())
    })
    
    return splitIntoChunks(elementos, 12);
}

function converterLinhasRelatorioEmObjeto(linhas) {

    const colunasRelatorio = [
        "documento_transporte",
        "peso_etapa",
        "peso_documento",
        "produto",
        "pool",
        "origem",
        "municipio_origem",
        "uf_origem",
        "destino",
        "municipio_destino",
        "uf_destino",
        "chegada_planejada"
    ];
    
    return linhas.map(linha=> {
        const c = {};
        for(let i=0;i<colunasRelatorio.length;i++) {

            if(colunasRelatorio[i] === "chegada_planejada") {
                const [inicio, final] = linha[i].split("-");
                c.inicio_chegada_planejada = null;
                c.final_chegada_planejada = null;
                if(final && inicio) {
                    c.inicio_chegada_planejada = inicio.split(".").reverse().join("-");
                    c.final_chegada_planejada = final.split(".").reverse().join("-");
                }
            } else if(colunasRelatorio[i].startsWith("peso_")) {
                const [peso, unidade_medida] = linha[i].split(" ");
                c[colunasRelatorio[i].replace("peso_", "unidade_medida_")] = unidade_medida;
                c[colunasRelatorio[i]] = peso.replace(/\./g, "").replace(/,/g, ".");
            } else {
                c[colunasRelatorio[i]] = linha[i];
            }
        }
        return c;
    });
    
}

for(const empresa of fs.readdirSync("htmls")) {
    for(const filename of fs.readdirSync(path.resolve("htmls", empresa))) {
        const cnpj = filename.split(".")[0];
        const linhasRelatorio = extrairLinhasRelatorio(fs.readFileSync(path.resolve("htmls", empresa, `${cnpj}.html`)));
        const cargas = converterLinhasRelatorioEmObjeto(linhasRelatorio).map(i=> {
            const clone = {...i};
            clone.empresa = empresa;
            clone.cnpj_fornecedor = cnpj;
            for(const j in clone) {
                if(clone[j] === undefined || clone[j] === '') {
                    clone[j] = null;
                }
            }
            return clone;
        });
        console.log(cargas);
    }

}
