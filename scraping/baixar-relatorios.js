require("dotenv").config();
const Nightmare = require('nightmare')
const fs = require('fs');
const path = require('path');

const nightmare = Nightmare({ show: false, waitTimeout: 15000, 
    switches: {
        // 'proxy-server': '127.0.0.1:8080',
        // 'ignore-certificate-errors': true
    }
});


async function login() {
    try {
        return await nightmare.goto("https://portal.e-fornecedores.ind.br/")
            .insert("#ctlLoadedControl_txtLogin", process.env.PORTAL_USUARIO)
            .insert("#ctlLoadedControl_txtSenha", process.env.PORTAL_SENHA)
            
            .click("#ctlLoadedControl_btnOK")
            .wait("#mnuPrincipal_lstEmpresas");
    } catch (error) {
        throw new Error("Erro ao realizar login no sistema - "+JSON.stringify(error));
    }
}

async function requirirEmpresa(empresa=78) {
    await nightmare.wait("form");
    return await nightmare.evaluate(async (empresa) =>{
        const data = new FormData(document.getElementsByTagName("form")[0]);
        data.set("txtScriptEnabled", "true");
        data.set("Lang","rdBR");
        data.set("rdLang", "Radio1");
        data.set("__EVENTTARGET", "mnuPrincipal$lstEmpresas");
        data.set("mnuPrincipal:lstEmpresas", String(empresa));
        const response = await fetch('https://portal.e-fornecedores.ind.br/Default.aspx?cmp=Noticias.ascx', {
            credentials: 'include',
            method: 'POST',
            body: data
        });

        const decoder = new TextDecoder('iso-8859-1');
        const text = decoder.decode(await response.arrayBuffer());
        return text;
    }, empresa);
}

async function requirirFornecedor(empresa=78, fornecedor) {
    await nightmare.wait("form");
    return await nightmare.evaluate(async (empresa, fornecedor) => {
        const data = new FormData(document.getElementsByTagName("form")[0]);
        data.set("txtScriptEnabled", "true");
        data.set("Lang","rdBR");
        data.set("rdLang", "Radio1");
        data.set("__EVENTTARGET", "mnuPrincipal$lstFornecedor");
        data.set("mnuPrincipal:lstEmpresas", String(empresa));
        data.set("mnuPrincipal:lstFornecedor", String(fornecedor));
        const response = await fetch('https://portal.e-fornecedores.ind.br/Default.aspx?cmp=Noticias.ascx', {
            credentials: 'include',
            method: 'POST',
            body: data
        });

        const decoder = new TextDecoder('iso-8859-1');
        const text = decoder.decode(await response.arrayBuffer());
        return text;
    }, empresa, fornecedor);
}

async function requirirRelatorio() {
    return await nightmare.evaluate(async () => {
        
        const response = await fetch('https://portal.e-fornecedores.ind.br/Printer.aspx?cmp=RelCargaProgramada.ascx&cliente=&regiao=&tipo=1&dir=A&org=', {
            credentials: 'include',
            method: 'GET'
        });

        const decoder = new TextDecoder('iso-8859-1');
        const text = decoder.decode(await response.arrayBuffer());
        return text;
    });
}

async function listarEmpresas() {
    return [
        {id: 98, descricao: "USIMINAS"}
    ];
    return await nightmare.evaluate(() => {
        return Array.from(document.getElementsByName("mnuPrincipal:lstEmpresas")[0].getElementsByTagName("option")).map(i=> ({
            id: Number(i.value),
            descricao: i.innerText,
        })).filter(i=> !isNaN(i.id));
    })
}

async function main() {
    const documentosBaixados = [];
    console.time("Scraping");
    try {
        await login();
        for(const empresa of await listarEmpresas()) {
            console.time(`Minerando empresa ${empresa.descricao}`);

            console.log(`requerir empresa ${empresa.descricao}`);
            const htmlEmpresaRequirida = await requirirEmpresa(78);
            await nightmare.evaluate(htmlEmpresaRequirida=>{
                document.write(htmlEmpresaRequirida);
            }, htmlEmpresaRequirida);
            // console.log(`apos requerir empresa ${empresa.descricao}`);
    
            console.log(`pegando fornecedores ${empresa.descricao}`);
            const fornecedores = await nightmare.evaluate(() => {
                return Array.from(document.getElementById("mnuPrincipal_lstFornecedor").getElementsByTagName("option")).map(i=>({
                    value: i.value,
                    descricao: i.innerText.trim()
                })).slice(1);
            });
            // console.log(`apos pegando fornecedores ${empresa.descricao}`);

            for(const f of fornecedores) {
               
                const htmlFornecedorRequirido = await requirirFornecedor(78, f.value);
                await nightmare.evaluate(htmlFornecedorRequirido=>{
                    document.write(htmlFornecedorRequirido);
                }, htmlFornecedorRequirido);
                
                if(!fs.existsSync("htmls")) {
                    fs.mkdirSync("htmls");
                }

                if(!fs.existsSync(path.resolve("htmls", String(empresa.id)))) {
                    fs.mkdirSync(path.resolve("htmls", String(empresa.id)));
                }
    
                const nomeArquivo = path.resolve("htmls", String(empresa.id), f.descricao.split(" - ")[0].replace(/\D/g, "") + ".html");
                fs.writeFileSync(nomeArquivo, await requirirRelatorio());
                documentosBaixados.push(nomeArquivo);
            }

            console.timeEnd(`Minerando empresa ${empresa.descricao}`);
        }
        
    } catch (error) {
        console.error("DEU ERRO");
        console.error(error, error.message);
    }

    await nightmare.end()
    console.timeEnd("Scraping");
    return documentosBaixados;
}

module.exports = main;