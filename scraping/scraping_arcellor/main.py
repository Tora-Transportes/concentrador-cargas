from math import ceil
from requests import Session, post
from time import time, strftime, sleep
from bs4 import BeautifulSoup
import json
import unicodedata
import os

import sys
sys.path.append("..")

from credenciais import Credenciais

def env(key):
    if key not in os.environ:
        raise Exception(f"Key {key} not found in environment variables")
    return os.environ[key]

BASE_URL = "https://loger.belgo.com.br"


def current_time_js():
    return ceil(time()*1000)

def normalize_text(text):
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore')

def login(session: Session, username: str, password: str):
    session.post(f"{BASE_URL}/LOGER_WEB/j_security_check", data={
        "j_username": username,
        "j_password": password
    })
    response = session.get(f"{BASE_URL}/LOGER_WEB/startup.do?method=execute&time={current_time_js()}")
    soup = BeautifulSoup(response.text, "html.parser")
    if soup.find("input", {"id": "username"}) is not None:
        raise Exception("Erro ao fazer login")
    return response.text

def get_centros(html):
    soup = BeautifulSoup(html, "html.parser")
    options = soup.find("select", {"id": "centroSelecionado"}).find_all("option")
    output = []
    for i in options:
        value = str(i["value"]).strip()
        if value != "":
            description = str(i.text).strip()
            output.append({"description": description, "value": value})
    return output

def selecionar_centro(id_centro, session: Session):
    with open("temp.html", "wb") as file:
        response = session.post(f"{BASE_URL}/LOGER_WEB/selecaoCentro.do?method=seleciona", data={
            "centroSelecionado": id_centro
        })
        file.write(response.content)

def gerar_relatorio_cargas(session: Session):
    response = session.get(f"{BASE_URL}/LOGER_WEB/agendamentoPontoCarregamento.do", params={
        "method" : "grid",
        "idTransportadora" : "",
        "mostraFrete" : "true",
        "codigoProduto" : "",
        "mostraProdutos" : "false",
        "mostraRastreado" : "false",
        "mostraTipoMaterial" : "false",
        "transportadoras" : "67671",
        "filtroTransporte" : "",
        "situacao" : "SEMAGENDAMENTO",
        "_search" : "false",
        "nd" : "1646671226753",
        "rows" : "100",
        "page" : "1",
        "sidx" : "TRANSPORTADORA%2C+TRANSPORTE",
        "sord" : "asc"
    })

    colunas_tabela = [
        'transportadora',
        'documento_transporte',
        'data_planejado',
        'quantidade',
        'status',
        'tracking_obrigatorio',
        'agendado',
        'data_chegada',
        'agendado_por',
        'data_agendamento',
        'frete_frota',
        'frete_agregado',
        'frete_terceiro',
        'dedicado',
        'uf',
        'tipo_expedicao',
        'observacao',
        'produto'
    ]
    linha_relatorio = json.loads(normalize_text(response.content.decode("utf-8")))["rows"]
    output = []
    for linha in linha_relatorio:
        tupla = {}
        for i in range(len(colunas_tabela)):
            tupla[colunas_tabela[i]] = linha["cell"][i]
        tupla["unidade_medida"] = "KG"
        output.append(tupla)

    return output

def gerar_detalhes_carga(session: Session, documento_transporte: str):
    url = f"{BASE_URL}/LOGER_WEB/agendamentoPontoCarregamento.do"
    response = session.get(url, params={
        "method": "detail",
        "numeroTransportadora": "67211",
        "numeroTransporte": documento_transporte,
        "agendado": "",
        "centroAgendamento": "9840",
        "tipoMercado": "TR",
        "agendamentoTipoMaterial": False
    })
    html = normalize_text(response.text)
    soup = BeautifulSoup(html, "html.parser")
    fornecimento = json.loads(soup.find("input", {"id": "fornecimentoGridData"})["value"])
    detalhesFornecimento = json.loads(soup.find("input", {"id": "itensFornecimentoGridData"})["value"])

    
    todos_fornecimentos = {}
    for f in fornecimento:
        todos_fornecimentos[f["fornecimento"]] = f
        f["itens"] = []

    for detalhe in detalhesFornecimento:
        todos_fornecimentos[detalhe["fornecimento"]]["itens"].append(detalhe)


    fornecimentosEstruturados = []
    for i in todos_fornecimentos:
        fornecimentosEstruturados.append(todos_fornecimentos[i])

    return fornecimentosEstruturados

def de_para_cliente_pagador(descricao_centro: str):
    de_para = {
        'ARCELORMITTAL PIRACICABA': 'ARCELORMITTAL BRASIL S/A - 17469701004911 - PIRACICABA/SP',
        'ARCELORMITTAL SABARA': 'ARCELORMITTAL BRASIL S/A - 17469701006612 - JOAO MONLEVADE/MG',
        'CL ITAQUAQUECETUBA': 'ARCELORMITTAL BRASIL S/A - 17469701004830 - SAO PAULO/SP',
        'ARCELORMITTAL SAO PAULO': 'ARCELORMITTAL BRASIL S/A - 17469701022731 - ITAQUAQUECETUBA/SP',
        'HUB RIO DAS PEDRAS': 'ARCELORMITTAL BRASIL S/A - 17469701002897 - RIO DAS PEDRAS/SP',
        'ARCELORMITTAL MONLEVADE': 'ARCELORMITTAL BRASIL S/A - 17469701006612 - JOAO MONLEVADE/MG'
    }
    upper_descricao = descricao_centro.upper()
    if upper_descricao not in de_para:
        return None
    
    return de_para[upper_descricao]

def de_para_origem(cod_filial):
    de_para = {
        '31' : 'BRASIL/MG/JUIZ DE FORA', # JUIZ DE FORA
        '69' : 'BRASIL/SP/PIRACICABA', # PIRACICABA
        '144': 'BRASIL/RJ/RESENDE', # RESENDE
        '0'  : 'BRASIL/MG/CONTAGEM', # CONTAGEM
        '124': 'BRASIL/SP/ITAQUAQUECETUBA', # ITAQUA
        '53' : 'BRASIL/SP/SAO PAULO', # SAO PAULO
        '130': 'BRASIL/MS/TRES LAGOAS', # TRES LAGOAS
        '28' : 'BRASIL/MG/JOAO MONLEVADE' # JOAO MONLEVADE
    }

    if cod_filial not in de_para:
        return None
    return de_para[cod_filial]



def de_para_filial(descricao_centro: str):
    de_para = {
        'ARCELORMITTAL JUIZ DE FORA' : '31', # JUIZ DE FORA
        'ARCELORMITTAL PIRACICABA' : '69', # PIRACICABA
        'ARCELORMITTAL RESENDE' : '144', # RESENDE
        'ARCELORMITTAL SABARA' : '0', # CONTAGEM
        'CL ITAQUAQUECETUBA' : '124', # ITAQUA
        'ARCELORMITTAL SAO PAULO' : '53', # SAO PAULO
        'SITREL - TRES LAGOAS' : '130', # TRES LAGOAS
        'HUB RIO DAS PEDRAS' : '69', # PIRACICABA
        'ARCELORMITTAL MONLEVADE' : '28' # JOAO MONLEVADE
    }
    upper_descricao = descricao_centro.upper()
    if upper_descricao not in de_para:
        return None
    return de_para[upper_descricao]

def formatar_data(data):
    if not data:
        return None
    
    [d, h] = data.split(" ")
    return "-".join(reversed(d.split("/"))) + "T" + h + ":00"

def formatar_valor_monetario(valor):
    if not valor:
        return None
    return valor.replace(".", "").replace(",", ".")


# print("ESTOU FUNCIONANDO")
# while True:
storage_credenciais = Credenciais()
url_api_credenciais = f"{env('API_URL')}/credenciais/{env('PORTAL')}/{env('LOGIN')}"
credenciais = storage_credenciais.buscar_credenciais_login(url_api_credenciais, env("API_TOKEN"))
if credenciais["errored"]:
    print("Credencial invalida na api")
    print("Esperando 30 minutos antes de finalizar processo")
    sleep(1800)
    exit(1)

session = Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
})

html_logado = None
try:
    html_logado = login(session, credenciais['user'], credenciais['password'])
except Exception as error:
    storage_credenciais.emitir_erro_login(credenciais, url_api_credenciais)
    print(error)
    print("Esperando 30 minutos antes de finalizar processo")
    sleep(1800)
    exit(1)

storage_credenciais.incrementar_sucesso_login(credenciais, url_api_credenciais)
centros = get_centros(html_logado)
print(json.dumps(centros, indent=4))
for centro in centros:
    descricao_centro = centro["description"].split(" - ")[1].upper()
    selecionar_centro(centro["value"], session)
    dados = gerar_relatorio_cargas(session)
    cargas_formatadas = []
    for i in dados:
        detalhes_carga = gerar_detalhes_carga(session, i["documento_transporte"])
        carga = {
            "cliente": de_para_cliente_pagador(descricao_centro),
            "documento_transporte": i["documento_transporte"],
            "unidade_medida": "KG",
            "quantidade": formatar_valor_monetario(i["quantidade"]),
            "quantidade_atual": formatar_valor_monetario(i["quantidade"]),
            "data_cadastro": strftime("%Y-%m-%dT%H:%M:%S"),
            "data_atualizacao": strftime("%Y-%m-%dT%H:%M:%S"),
            "fk_filial": de_para_filial(descricao_centro),
            "observacao": i["observacao"],
            "usuario": "BOT IMPORTACAO PORTAL",
            "responsavel_cadastro": "BOT IMPORTACAO PORTAL",
            "e_lote": False,
            "fk_lote_pai": None,
            "fk_situacao": 1,
            "observacao_gr": None,
            "placa_veiculo": None,
            "janela_coleta": None,
            "janela_entrega": None,
            "canal_comunicacao": "portal",
            "acessorios_requisitos": None,
            "informacoes_restritivas": None,
            "ativo": 1,
            "data_entrega": None,
            "data_coleta": None,
            "tipo_carga": None,
            "origem_carga": de_para_origem(de_para_filial(descricao_centro)),
            "destino_carga": f"BRASIL/{i['uf']}",
            "locais": [descricao_centro]+list(map(lambda x: x["endereco"], detalhes_carga))
        }
        # print(json.dumps(detalhes_carga, indent=4))
        # i["data_agendamento"] = formatar_data(i["data_agendamento"])
        # i["data_chegada"] = formatar_data(i["data_chegada"])
        # i["data_planejado"] = formatar_data(i["data_planejado"])

        # i["frete_agregado"] = formatar_valor_monetario(i["frete_agregado"])
        # i["frete_frota"] = formatar_valor_monetario(i["frete_frota"])
        # i["frete_terceiro"] = formatar_valor_monetario(i["frete_terceiro"])

        cargas_formatadas.append(carga)

    print(centro["description"], json.dumps(cargas_formatadas, indent=4, sort_keys=True))
    if len(cargas_formatadas) > 0:
        print("Enviando", len(cargas_formatadas), "cargas para o servidor")
        response = post(env("API_URL")+"/portal/cargas", json={"cargas": cargas_formatadas}, verify=False)
        with open("temp.json", "wb") as file:
            file.write(response.content)
    
print(f"Dormindo por {env('PAUSE_MINUTES')} minutos")
sleep(int(env("PAUSE_MINUTES"))*60)