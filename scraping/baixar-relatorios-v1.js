const Nightmare = require('nightmare')
const fs = require('fs');
const path = require('path');

const nightmare = Nightmare({ show: false, waitTimeout: 15000, 
    switches: {
        'proxy-server': '127.0.0.1:8080',
        'ignore-certificate-errors': true
      }
  });


async function main() {
    try {
        await nightmare.goto("https://portal.e-fornecedores.ind.br/")
            .insert("#ctlLoadedControl_txtLogin", "US204683")
            .insert("#ctlLoadedControl_txtSenha", "Tora2019")
            
            .click("#ctlLoadedControl_btnOK")
            .wait("#mnuPrincipal_lstEmpresas")

            .select("#mnuPrincipal_lstEmpresas", "78")
            .wait("#mnuPrincipal_lstFornecedor option");

        const fornecedores = await nightmare.evaluate(() => {
            return Array.from(document.getElementById("mnuPrincipal_lstFornecedor").getElementsByTagName("option")).map(i=>i.value).slice(1);
        });
        
        for(const f of fornecedores) {
            await nightmare.goto("https://portal.e-fornecedores.ind.br/Default.aspx?cmp=Noticias.ascx")

            await nightmare.wait("#imgUS");
            await nightmare.evaluate(()=>{
                document.getElementById("imgUS").remove()
            });

            await nightmare.select('#mnuPrincipal_lstFornecedor', f);
            await nightmare.wait("#imgUS");
            
            console.log("CARREGOU")           
            
            await nightmare.goto("https://portal.e-fornecedores.ind.br/Default.aspx?cmp=CargaProgramada.ascx&tipo=rel&menu=yes");
            await nightmare.wait("#ctlLoadedControl_btnReport");
            const htmlRelatorio = await nightmare.evaluate(async () => {
                
                const url = "https://portal.e-fornecedores.ind.br/Printer.aspx?cmp=RelCargaProgramada.ascx&cliente=&regiao=&tipo=1&dir=A&org=";
                const decoder = new TextDecoder('iso-8859-1');
                const text = decoder.decode(await (await fetch(url,{credentials: 'include'})).arrayBuffer());

                return text;
            });

            if(!fs.existsSync("htmls")) {
                fs.mkdirSync("htmls");
            }

            const nomeArquivo = path.resolve("htmls", f.replace(/\D/g, "") + ".html");
            fs.writeFileSync(nomeArquivo, htmlRelatorio);

            console.log("SALVEI O ARQUIVO");
        }
        
    } catch (error) {
        console.log("DEU ERRO");
        console.log(error, error.message);
    }

    console.log("Scrapping finalizado");
    await nightmare.end()
}

main();