const Nightmare = require('nightmare')
const fs = require('fs');
const path = require('path');

const nightmare = Nightmare({ show: false, waitTimeout: 15000, 
    switches: {
        'proxy-server': '127.0.0.1:8080',
        'ignore-certificate-errors': true
    }
});


async function login() {
    return await nightmare.goto("https://portal.e-fornecedores.ind.br/")
        .insert("#ctlLoadedControl_txtLogin", "US204683")
        .insert("#ctlLoadedControl_txtSenha", "Tora2019")
        
        .click("#ctlLoadedControl_btnOK")
        .wait("#mnuPrincipal_lstEmpresas");
}

async function requirirEmpresa(empresa=78) {
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




async function main() {
    try {
        await login();
        const htmlEmpresaRequirida = await requirirEmpresa(78);
        await nightmare.evaluate(htmlEmpresaRequirida=>{
            document.write(htmlEmpresaRequirida);
        }, htmlEmpresaRequirida);

        const fornecedores = await nightmare.evaluate(() => {
            return Array.from(document.getElementById("mnuPrincipal_lstFornecedor").getElementsByTagName("option")).map(i=>i.value).slice(1);
        });
        for(const f of fornecedores) {
           
            const htmlFornecedorRequirido = await requirirFornecedor(78, f);
            await nightmare.evaluate(htmlFornecedorRequirido=>{
                document.write(htmlFornecedorRequirido);
            }, htmlFornecedorRequirido);
            
            if(!fs.existsSync("req")) {
                fs.mkdirSync("req");
            }

            const nomeArquivo = path.resolve("htmls", f.replace(/\D/g, "") + ".html");
            fs.writeFileSync(nomeArquivo, await requirirRelatorio());
        }
        
    } catch (error) {
        console.error("DEU ERRO");
        console.error(error, error.message);
    }

    console.log("Scrapping finalizado");
    await nightmare.end()
}

main();