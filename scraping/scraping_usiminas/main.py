import json
import os
import unicodedata
from requests import Session, post
from bs4 import BeautifulSoup
import time

import sys
sys.path.append("..")

from credenciais import Credenciais


deParaTransportadorCarga = {
    "20468310005020": {"origem": "BRASIL/MG/SANTA LUZIA", "cliente": "USINAS SIDERURGICAS M.G. S/A USIMINAS - 60894730002582 - IPATINGA/MG", "filial": 157},
    "20468310007317": {"origem": "BRASIL/MG/BETIM", "cliente": "USINAS SIDERURGICAS M.G. S/A USIMINAS - 60894730002582 - IPATINGA/MG", "filial": 154},
    "20468310009603": {"origem": "BRASIL/MG/IPATINGA", "cliente": "USINAS SIDERURGICAS M.G. S/A USIMINAS - 60894730002582 - IPATINGA/MG", "filial": 26},
    "20468310000223": {"origem": "BRASIL/SP/SAO PAULO", "cliente": "USINAS SIDERURGICAS M.G. S/A USIMINAS - 60894730002663 - SANTO ANDRE/SP", "filial": 158},
    "20468310007236": {"origem":"BRASIL/ES/CARIACICA", "cliente": "USINAS SIDERURGICAS M.G. S/A USIMINAS - 60894730002582 - IPATINGA/MG", "filial": 121}
}


BASE_URL = "https://portal.e-fornecedores.ind.br"
def normalize_text(text):
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    
def extract_inputs(html: BeautifulSoup):
    inputs = {}
    for i in html.find_all("input"):
        try:
            inputs[i["name"]] = ""
            inputs[i["name"]] = i["value"]
        except:
            pass
    for i in html.find_all("select"):
        try:
            inputs[i["name"]] = ""
            inputs[i["name"]] = i["value"]
        except:
            pass
    return inputs

def login(session: Session, username: str, password: str):

    html = session.get(f"{BASE_URL}")

    soup = BeautifulSoup(html.text, "html.parser")
    inputs = extract_inputs(soup)
    inputs["txtScriptEnabled"] = "true"
    inputs["Lang"] = "rdBR"
    inputs["rdLang"] = "Radio1"
    inputs["ctlLoadedControl:txtLogin"] = username
    inputs["ctlLoadedControl:txtSenha"] = password
    inputs["ctlLoadedControl:btnOK.x"] = 0
    inputs["ctlLoadedControl:btnOK.y"] = 0
    html = session.post(f"{BASE_URL}/default.aspx", data=inputs, cookies={"check": "true"})
    return html

def extrair_empresas(html: BeautifulSoup):
    options = html.find(attrs={"id": "mnuPrincipal_lstEmpresas"}).find_all("option")[1:]
    return list(map(lambda x: {"name": normalize_text(x.text), "value": x["value"]}, options))

def selecionar_empresa(session: Session, html_logado: BeautifulSoup, empresa: str):
    inputs = extract_inputs(html_logado)
    inputs['__EVENTTARGET'] = "mnuPrincipal$lstEmpresas"
    inputs['txtScriptEnabled'] = 'true'
    inputs['Lang'] = "rdBR"
    inputs['rdLang'] = "Radio1"
    inputs['mnuPrincipal:lstEmpresas'] = empresa

    html = session.post(f"{BASE_URL}/Default.aspx?cmp=Noticias.ascx", data=inputs)
    return html


def extrair_fornecedores(html: BeautifulSoup):
    options = html.find(attrs={"id": "mnuPrincipal_lstFornecedor"}).find_all("option")[1:]
    return list(map(lambda x: {"name": normalize_text(x['alt']), "value": x["value"], "text": x.text}, options))

def selecionar_fornecedor(session: Session, html_logado: BeautifulSoup, empresa: str, fornecedor: str):
    inputs = extract_inputs(html_logado)
    inputs['__EVENTTARGET'] = "mnuPrincipal$lstFornecedor"
    inputs['txtScriptEnabled'] = 'true'
    inputs['Lang'] = "rdBR"
    inputs['rdLang'] = "Radio1"
    inputs['mnuPrincipal:lstEmpresas'] = empresa
    inputs['mnuPrincipal:lstFornecedor'] = fornecedor

    html = session.post(f"{BASE_URL}/Default.aspx?cmp=Noticias.ascx", data=inputs)
    return html

def requerir_relatorio(session: Session):
    return session.get(f"{BASE_URL}/Printer.aspx?cmp=RelCargaProgramada.ascx&cliente=&regiao=&tipo=1&dir=A&org=")

session = Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
})


credenciais_storage = Credenciais()
url_api_credenciais = f"{os.environ['API_URL']}/credenciais/{os.environ['PORTAL']}/{os.environ['LOGIN']}"
credenciais = credenciais_storage.buscar_credenciais_login(url_api_credenciais, os.environ['API_TOKEN'])
if credenciais["errored"]:
    print("Credencial invalida na api")
    print("Esperando 30 minutos antes de finalizar processo")
    time.sleep(1800)
    exit(1)
    
print("Realizando login")
html_logado = login(session, credenciais['user'], credenciais['password'])
if "Login ou Senha Incorretos!" in html_logado.text:
    print("Login e/ou senha incorretos")
    credenciais_storage.emitir_erro_login(url_api_credenciais, os.environ['API_TOKEN'])
    print("Esperando 30 minutos antes de finalizar processo")
    time.sleep(1800)
    exit(1)

credenciais_storage.incrementar_sucesso_login(credenciais ,url_api_credenciais)
soup_logado = BeautifulSoup(html_logado.text, "html.parser")
empresas = extrair_empresas(soup_logado)

for emp in empresas:
    print("Minerando empresa ", emp['value'])
    empresa = emp['value']

    if empresa != "78":
        continue

    html_empresa_selecionada = selecionar_empresa(session, soup_logado, empresa)
    soup_empresa_selecionada = BeautifulSoup(html_empresa_selecionada.text, "html.parser")
    fornecedores = extrair_fornecedores(soup_empresa_selecionada)

    for forn in fornecedores:
        print("minerando fornecedor", forn['name'])
        fornecedor = forn['value']
        cnpj = ''.join(c for c in forn['text'].split(" - ")[0] if c.isdigit())
        if not os.path.exists("htmls"):
            os.mkdir("htmls")

        path_empresa = os.path.join("htmls", empresa)
        if not os.path.exists(path_empresa):
            os.mkdir(path_empresa)

        path_relatorio = os.path.join(path_empresa, f"{cnpj}.html") 
        selecionar_fornecedor(session, soup_empresa_selecionada, empresa, fornecedor)

        html_relatorio = requerir_relatorio(session)
        with open(path_relatorio, "wb") as file:
            file.write(html_relatorio.content)
        if cnpj not in ["20468310005020","20468310007317","20468310009603","20468310000223","20468310007236"]:
            continue

        print(f"Minerando cnpj {cnpj}")
        soup = BeautifulSoup(html_relatorio.text, "html.parser")
        container_dados = soup.find(attrs={"class": "rptData"})
        if container_dados is None:
            print("CNPJ VAZIO")
            continue
        trs = container_dados.find_all("tr")[2:]
        trs.pop()
        linhas = []
        cabecalho = [
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
        ]
        for i in trs:
            row = [normalize_text(j.text.strip()) for j in i.find_all("td")]
            output = {}
            for j in range(len(cabecalho)):
                output[cabecalho[j]] = row[j]

            inicio_final = output["chegada_planejada"].split("-")
            del output["chegada_planejada"]

            output["inicio_chegada_planejada"] = None
            output["final_chegada_planejada"] = None
            if len(inicio_final) > 1 and inicio_final[0] and inicio_final[1]:
                output["inicio_chegada_planejada"] = "-".join(reversed(inicio_final[0].split(".")))
                output["final_chegada_planejada"] = "-".join(reversed(inicio_final[1].split(".")))

            [peso, unidade_medida] = output["peso_documento"].split(" ")
            output["unidade_medida_documento"] = unidade_medida
            output["peso_documento"] = peso.replace("." , "").replace(",", ".")

            [peso, unidade_medida] = output["peso_etapa"].split(" ")
            output["unidade_medida_etapa"] = unidade_medida
            output["peso_etapa"] = peso.replace("." , "").replace(",", ".")

            output["empresa"] = empresa
            output["cnpj_fornecedor"] = cnpj


            for j in output:
                if output[j] == "":
                    output[j] = None

            data_atual = time.strftime('%Y-%m-%dT%H:%M:%S')
            carga = {
                "cliente": deParaTransportadorCarga[cnpj]["cliente"],
                "e_lote": False,
                "origem_carga": deParaTransportadorCarga[cnpj]["origem"],
                "destino_carga": f"BRASIL/{output['uf_destino']}/{output['municipio_destino']}" if output['uf_destino'] and output['municipio_destino'] else None,
                "data_entrega": None,
                "data_coleta": None,
                "tipo_carga": output['produto'],
                "quantidade": output['peso_etapa'],
                "unidade_medida": output['unidade_medida_documento'],
                "responsavel_cadastro": "BOT IMPORTACAO PORTAL",
                "canal_comunicacao": "portal",
                "observacao": None,
                "data_cadastro": data_atual,
                "data_atualizacao": data_atual,
                "ativo": 1,
                "acessorios_requisitos": None,
                "usuario": "BOT IMPORTACAO PORTAL",
                "informacoes_restritivas": None,
                "janela_coleta": None,
                "janela_entrega": None,
                "local_coleta": output['origem'],
                "local_entrega": output['destino'],
                "fk_lote_pai": None,
                "quantidade_atual": output['peso_etapa'],
                "fk_situacao": 1,
                "placa_veiculo": None,
                "observacao_gr": None,
                "documento_transporte": output['documento_transporte'],
                "fk_filial": deParaTransportadorCarga[cnpj]["filial"]
            }

            linhas.append(carga)
        hashCargas = {}
        for i in linhas:
            if i["documento_transporte"] in hashCargas:
                hashCargas[i["documento_transporte"]]["observacao"] = "" if hashCargas[i["documento_transporte"]]["observacao"] is None else hashCargas[i["documento_transporte"]]["observacao"]
                hashCargas[i['documento_transporte']]["observacao"] += "Carga: "+i['tipo_carga']+",\nQuantidade: "+i['quantidade']+",\nUnidade medida: "+i['unidade_medida']+"\n\n"
                
                hashCargas[i['documento_transporte']]['quantidade'] = float(hashCargas[i['documento_transporte']]['quantidade']) + float(i['quantidade'])
                hashCargas[i['documento_transporte']]['quantidade_atual'] = hashCargas[i['documento_transporte']]['quantidade']
            else:
                hashCargas[i['documento_transporte']] = i

        output = []
        for i in hashCargas:
            output.append(hashCargas[i])
        print("Enviando", len(output), "para a api")
        response = post(os.environ['API_URL']+"/portal/cargas", json={"cargas": output}, verify=False)
        with open("carga.json", "a") as file:
            file.write("\n-----------START----------\n")
            file.write(response.text)
            file.write("\n")
            file.write(json.dumps(output))
            file.write("\n-----------ENDING----------\n")

time.sleep(int(os.environ['PAUSE_MINUTES'])*60)
