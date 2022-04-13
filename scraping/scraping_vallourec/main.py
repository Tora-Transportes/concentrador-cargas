from os import environ
from requests import Session, post, get, put
import time
import json
import unicodedata


import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

import sys
sys.path.append("..")

from credenciais import Credenciais

BASE_URL = "https://www.vallourec.com.br/logistica-externa/rest/"

session = Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"
})

def normalize_text(text):
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore')

def login(session: Session, username:str, password:str):
    response = session.post(f"{BASE_URL}/autenticacao/login", json={
        "login": username,
        "password": password
    })
    return response

def emitir_relatorio(session: Session, data: str, display_length: int = 1):
    response = session.post(f"{BASE_URL}/programacaoPorCarregamento/dataTable", json=[
        {
            "name": "sEcho",
            "value": 1
        },
        {
            "name": "iColumns",
            "value": 14
        },
        {
            "name": "sColumns",
            "value": ",,,,,,,,,,,,,"
        },
        {
            "name": "iDisplayStart",
            "value": 0
        },
        {
            "name": "iDisplayLength",
            "value": display_length
        },
        {
            "name": "mDataProp_0",
            "value": "id"
        },
        {
            "name": "sSearch_0",
            "value": ""
        },
        {
            "name": "bRegex_0",
            "value": False
        },
        {
            "name": "bSearchable_0",
            "value": True
        },
        {
            "name": "bSortable_0",
            "value": False
        },
        {
            "name": "mDataProp_1",
            "value": "info"
        },
        {
            "name": "sSearch_1",
            "value": ""
        },
        {
            "name": "bRegex_1",
            "value": False
        },
        {
            "name": "bSearchable_1",
            "value": True
        },
        {
            "name": "bSortable_1",
            "value": False
        },
        {
            "name": "mDataProp_2",
            "value": "depositoJanela"
        },
        {
            "name": "sSearch_2",
            "value": ""
        },
        {
            "name": "bRegex_2",
            "value": False
        },
        {
            "name": "bSearchable_2",
            "value": True
        },
        {
            "name": "bSortable_2",
            "value": True
        },
        {
            "name": "mDataProp_3",
            "value": "carregamento"
        },
        {
            "name": "sSearch_3",
            "value": ""
        },
        {
            "name": "bRegex_3",
            "value": False
        },
        {
            "name": "bSearchable_3",
            "value": True
        },
        {
            "name": "bSortable_3",
            "value": True
        },
        {
            "name": "mDataProp_4",
            "value": "transportadora"
        },
        {
            "name": "sSearch_4",
            "value": ""
        },
        {
            "name": "bRegex_4",
            "value": False
        },
        {
            "name": "bSearchable_4",
            "value": True
        },
        {
            "name": "bSortable_4",
            "value": True
        },
        {
            "name": "mDataProp_5",
            "value": "mapaCargaNF"
        },
        {
            "name": "sSearch_5",
            "value": ""
        },
        {
            "name": "bRegex_5",
            "value": False
        },
        {
            "name": "bSearchable_5",
            "value": True
        },
        {
            "name": "bSortable_5",
            "value": True
        },
        {
            "name": "mDataProp_6",
            "value": "status"
        },
        {
            "name": "sSearch_6",
            "value": ""
        },
        {
            "name": "bRegex_6",
            "value": False
        },
        {
            "name": "bSearchable_6",
            "value": True
        },
        {
            "name": "bSortable_6",
            "value": True
        },
        {
            "name": "mDataProp_7",
            "value": None
        },
        {
            "name": "sSearch_7",
            "value": ""
        },
        {
            "name": "bRegex_7",
            "value": False
        },
        {
            "name": "bSearchable_7",
            "value": True
        },
        {
            "name": "bSortable_7",
            "value": False
        },
        {
            "name": "mDataProp_8",
            "value": None
        },
        {
            "name": "sSearch_8",
            "value": ""
        },
        {
            "name": "bRegex_8",
            "value": False
        },
        {
            "name": "bSearchable_8",
            "value": True
        },
        {
            "name": "bSortable_8",
            "value": False
        },
        {
            "name": "mDataProp_9",
            "value": "numeroJanelas"
        },
        {
            "name": "sSearch_9",
            "value": ""
        },
        {
            "name": "bRegex_9",
            "value": False
        },
        {
            "name": "bSearchable_9",
            "value": True
        },
        {
            "name": "bSortable_9",
            "value": True
        },
        {
            "name": "mDataProp_10",
            "value": "numeroClientes"
        },
        {
            "name": "sSearch_10",
            "value": ""
        },
        {
            "name": "bRegex_10",
            "value": False
        },
        {
            "name": "bSearchable_10",
            "value": True
        },
        {
            "name": "bSortable_10",
            "value": True
        },
        {
            "name": "mDataProp_11",
            "value": "faturamentoId"
        },
        {
            "name": "sSearch_11",
            "value": ""
        },
        {
            "name": "bRegex_11",
            "value": False
        },
        {
            "name": "bSearchable_11",
            "value": True
        },
        {
            "name": "bSortable_11",
            "value": True
        },
        {
            "name": "mDataProp_12",
            "value": "statusId"
        },
        {
            "name": "sSearch_12",
            "value": ""
        },
        {
            "name": "bRegex_12",
            "value": False
        },
        {
            "name": "bSearchable_12",
            "value": True
        },
        {
            "name": "bSortable_12",
            "value": True
        },
        {
            "name": "mDataProp_13",
            "value": "idTransportadora"
        },
        {
            "name": "sSearch_13",
            "value": ""
        },
        {
            "name": "bRegex_13",
            "value": False
        },
        {
            "name": "bSearchable_13",
            "value": True
        },
        {
            "name": "bSortable_13",
            "value": True
        },
        {
            "name": "sSearch",
            "value": ""
        },
        {
            "name": "bRegex",
            "value": False
        },
        {
            "name": "iSortCol_0",
            "value": 0
        },
        {
            "name": "sSortDir_0",
            "value": "asc"
        },
        {
            "name": "iSortingCols",
            "value": 1
        },
        {
            "name": "dataFiltro",
            "value": data
        },
        {
            "name": "transportadoraFiltro",
            "value": "8"
        }
    ])
    return response

def emitir_detalhes_carga(session: Session, id: str):
    response = session.post(f"{BASE_URL}/carregamento/detalhes", data=id, 
    headers={'Content-Type': 'application/json; charset=UTF-8'})
    return response

def format_date(date):
    if date is None:
        return None
    return  "-".join(reversed(date.split(" ")[0].split('/')))+"T00:00:00"
    

def converter_carga_para_concentrador(carga_portal):
    origem = None
    destino = None
    for i in carga_portal["clientes"]:
        if i["descricaoTipoCliente"].lower() == "origem":
            origem = i["clienteFormatado"]
            if origem is not None:
                origem = "BRASIL/" + "/".join(reversed(origem.split(' - ')[-1].strip().upper().split('/')))

        if i["descricaoTipoCliente"].lower() == "destino final":
            destino = i["clienteFormatado"]
            if destino is not None:
                destino = "BRASIL/" + "/".join(reversed(destino.split(' - ')[-1].strip().upper().split('/')))

    quantidade = float(carga_portal["pesoPrevisto"].replace('.', '').replace(',', '.')) * 1000

    carga_concentrador = {
        "e_lote": 0,
        "ativo": 1,
        "fk_lote_pai": None,
        "placa_veiculo": None,
        "fk_situacao": 1,
        "observacao_cancelamento": None,
        "observacao_exclusao": None,
        "observacao_gr": None,
        "placa_carreta": None,
        "placa_bitrem": None,
        "codigo_motorista": None,
        "nome_motorista": None,
        "usuario": "BOT IMPORTACAO PORTAL",
        "responsavel_cadastro": "BOT IMPORTACAO PORTAL",
        "canal_comunicacao": "portal",
        "unidade_medida": "KG",
        "cliente": "VALLOUREC SOLUCOES TUBULARES BRASIL S A - 08689024000292 - JECEABA/MG",
        "fk_filial": 8, # FILIAL DE MANNESMANN

        "documento_transporte": carga_portal["id"],
        "quantidade": quantidade,
        "quantidade_atual": quantidade,
        "data_coleta": format_date(carga_portal["dataHoraCarregamentoFormatada"]),
        "janela_coleta": str(carga_portal["dataHoraCarregamentoFormatada"]).split(' ')[1],
        "data_entrega": format_date(carga_portal["dataHoraAcordadaFormatada"]),
        "janela_entrega": str(carga_portal["dataHoraAcordadaFormatada"]).split(' ')[1],
        "tipo_carga": None,
        "origem_carga": origem,
        "destino_carga": destino,
        "locais": list( map(lambda x: f"{x['descricaoTipoCliente']} : {x['clienteFormatado']}", carga_portal["clientes"]) ),
        "informacoes_restritivas": f"descricaoTipoVeiculo: {carga_portal['descricaoTipoVeiculo']}\ndescricaoCapacidadeVeiculo: {carga_portal['descricaoCapacidadeVeiculo']}\ndescricaoComprimentoVeiculo: {carga_portal['descricaoComprimentoVeiculo']}\n",
        "acessorios_requisitos": carga_portal["descricaoItemCarregamento"],
        "observacao": "OBSERVACOES_INDICACOES: " + str(carga_portal["observacoesIndicacoes"]) + "\nTIPO CONTRATO: " + str(carga_portal["tipoContrato"]) + "\nMATERIAL: " + str(carga_portal["material"])
    }
    return carga_concentrador


def enviar_para_concentrador(cargas):
    return post(environ["API_URL"]+"/portal/cargas", json={"cargas": cargas}, verify=False)


# while True:
data_atual = time.strftime("%Y-%m-%d")
credenciais_storage = Credenciais()
url_api_credenciais = f"{environ['API_URL']}/credenciais/{environ['PORTAL']}/{environ['LOGIN']}"
credenciais = credenciais_storage.buscar_credenciais_login(url_api_credenciais, environ['API_TOKEN'])
credenciais_storage.incrementar_sucesso_login(credenciais, url_api_credenciais)
# print("Realizando login")
# credenciais = buscar_credenciais_login()
# if credenciais["errored"]:
#     raise Exception(f"Não é possível continuar pois a credencial de acesso ao portal {environ['PORTAL']} esta incorreta")
# print(json.dumps(credenciais, indent=4))

# login_response = login(session, environ["LOGIN"], credenciais["password"])
# if login_response.status_code != 200:
#     emitir_erro_login(credenciais)
#     raise Exception("Login incorreto")

# incrementar_sucesso_login(credenciais)
# exit(0)
print("Emitindo relatorio")
relatorio_response = emitir_relatorio(session, data_atual, display_length=1)
total_records = json.loads(relatorio_response.text)["recordsTotal"]
print("Total de", total_records, "encontrados")
relatorio_response = emitir_relatorio(session, data_atual, display_length=int(total_records))

with open(f"detalhes.json", "wb") as file:
    file.write(relatorio_response.content)

relatorio = json.loads(relatorio_response.text)
cargas = []
for registro in relatorio["data"]:
    id_carga = str(registro["id"])
    print("Emitindo detalhes carga ", id_carga)
    response_detalhes = emitir_detalhes_carga(session, id_carga)
    with open(f"detalhes-{id_carga}.json", "wb") as file:
        file.write(response_detalhes.content)

    if response_detalhes.status_code != 200:
        print("Erro")
        exit(1)
    
    print("convertendo carga ", id_carga)
    carga = converter_carga_para_concentrador(json.loads(normalize_text(response_detalhes.text)))
    cargas.append(carga)

print("Enviando cargas para API")
print(json.dumps(cargas, indent=4))
response = enviar_para_concentrador(cargas)
with open("output.json", "wb") as file:
    file.write(response.content)

# print("Dormindo por", int(environ["PAUSE_MINUTES"]), "minutos")
time.sleep(int(environ["PAUSE_MINUTES"]) * 60)