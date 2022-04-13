import json
import re
from bs4 import BeautifulSoup
import unicodedata
from requests import get

def normalize(text):
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')

def get_deliveries(soup: BeautifulSoup):
    deliveries_table = None
    for i in soup.find_all("table", {"class": "urST3BdBrd urST3Bd urFontStd"}):
        if "delivery note" in i.text:
            deliveries_table = i
            break

    deliveries_rows = deliveries_table.find_all("tr")
    deliveries_header = None
    deliveries_data = []
    for i in deliveries_rows:
        if i.has_attr("rt") and not i.has_attr("rr"):
            deliveries_header = [j.text.strip() for j in i.find_all("th")]

        if i.has_attr("rr"):
            deliveries_data.append(
                [j.text.strip() for j in i.find_all("td")]
            )

    deliveries = []
    for row in deliveries_data:
        delivery_object = {}
        for index in range(len(deliveries_header)):
            key = normalize(str(deliveries_header[index]).strip().lower()).replace("-", "_").replace(".", "_").replace(" ", "_")
            while "__" in key:
                key = key.replace("__", "_")

            if len(key) == 0:
                continue

            delivery_object[key] = normalize(str(row[index])).strip()
        deliveries.append(delivery_object)
    return deliveries

def get_dates(soup: BeautifulSoup):
    
    dates_section = None
    for i in soup.find_all(attrs={"class": "urTrcWhlHdr lsPanel"}):
        if "dates and data" in i.text:
            dates_section = i
            break

    inputs = []
    for i in dates_section.find_all("input"):
        value = ""
        try:
            value = i["value"]
        except:
            pass
        inputs.append(value)

    return {
        "loading_date": f"{inputs[0]} {inputs[1]}".strip(),
        "latest_pickup": inputs[2].strip(),
        "plan_date_arrival": f"{inputs[3]} {inputs[4]}".strip(),
        "actual_date_arrival": f"{inputs[5]} {inputs[6]}".strip(),
    }

def get_general_data(soup: BeautifulSoup):
    general = {}
    general_container = None
    for i in soup.find_all(attrs={"class":"urTrcWhlHdr lsPanel"}):
        if "general shipmen" in i.text:
            general_container = i
            break
    
    general_container = general_container.find_all("tbody")[4]
    values = BeautifulSoup(normalize(str(general_container).replace(">", ">\n")), "html.parser").text
    while "\n\n" in values:
        values = values.replace("\n\n", "\n").strip()

    values = values.split("\n")
    for i in range(0, len(values), 2):
        try:
            key = str(values[i]).lower().strip().replace(" ", "_")
            general[key] = ""
            general[key] = values[i+1]
        except:
            pass
    return general

def get_freigth_data(soup: BeautifulSoup):
    general = {}
    general_container = None
    for i in soup.find_all(attrs={"class":"urTrcWhlHdr lsPanel"}):
        if "general shipment" in i.text:
            general_container = i
            break
    general_container = general_container.find_all("tbody")[13]

    values = BeautifulSoup(normalize(str(general_container).replace(">", ">\n")), "html.parser").text
    while "\n\n" in values:
        values = values.replace("\n\n", "\n").strip()

    values = values.split("\n")
    for i in range(0, len(values), 3):
        try:
            key = str(values[i]).lower().strip().replace(" ", "_").replace(".", "")
            general[key] = ""
            general[key] = values[i+1]
            general[key] += f" {values[i+2]}"
        except:
            pass
    return general


def formatar_data(data):
    if not data:
        return None
    [d, h] = data.split(" ")
    return "-".join(reversed(d.split("."))) + "T" + h + ":00"


def buscar_cep(cep:str):
    return get(f"https://brasilapi.com.br/api/cep/v1/{cep}").json()

def extrair_carga(html):
    content = html.strip().split("CDATA")[1].split("]]")[0]
    soup = BeautifulSoup(content, "html.parser")

    deliveries = get_deliveries(soup)
    # print(json.dumps(deliveries, indent=4))

    dates = get_dates(soup)
    # print(json.dumps(dates, indent=4))

    general = get_general_data(soup)
    # print(json.dumps(general, indent=4))

    freigth = get_freigth_data(soup)
    # print(json.dumps(freigth, indent=4))

    locais = [
        "ORIGEM: " + general["from"],
        "DESTINO: " + general["to"]
    ] + list(map(lambda x: f"Nota: {x['delivery_note']} | Data.Car.: {x['loading_date']} | Peso.Fre.: {x['freight_weight'].replace('.', '').replace(',','.')} {x['unit']}", deliveries))

    cep_origem = re.findall(r'\d{4,5}-?\d{2,3}', general["from"])
    cep_destino = re.findall(r'\d{4,5}-?\d{2,3}', general["to"])
    endereco_destino = None
    endereco_origem = None
    if len(cep_destino) > 0:
        endereco_destino = buscar_cep(cep_destino[0])
    if len(cep_origem) > 0:
        endereco_origem = buscar_cep(cep_origem[0])

    [quantidade, unidade_medida] = freigth["plan_weight"].replace(".", "").replace(",", ".").split(" ")

    carga = {
        "e_lote": 0,
        "responsavel_cadastro": "BOT IMPORTACAO PORTAL",
        "usuario": "BOT IMPORTACAO PORTAL",
        "placa_veiculo": None,
        "placa_bitrem": None,
        "placa_carreta": None,
        "canal_comunicacao": "portal",
        "codigo_motorista": None,
        "ativo": 1,
        "observacao_cancelamento": None,
        "observacao_exclusao": None,
        "observacao_gr": None,
        "fk_lote_pai": None,
        "fk_situacao": 1,
        "tipo_carga": None,
        "janela_coleta": None,
        "janela_entrega": None,
        "acessorios_requisitos": None,
        "fk_filial": 0,
        "cliente": "MAGNESITA REFRATARIOS S.A. - 08684547001560 - CONTAGEM/MG",
        
        "documento_transporte": general["shipment_number"],
        "locais": locais,
        "data_coleta": formatar_data(dates['loading_date']),
        "data_entrega": formatar_data(dates['plan_date_arrival']),
        "informacoes_restritivas": f"Meios de transporte: {general['means_of_shipment']}\nTipos de transporte: {general['shipping_type']})",
        "observacao": general["contact"],
        "origem_carga": normalize(f"BRASIL/{endereco_origem['state']}/{endereco_origem['city']}".upper().strip()),
        "destino_carga": normalize(f"BRASIL/{endereco_destino['state']}/{endereco_destino['city']}".upper().strip()),
    
        "quantidade_atual": quantidade,
        "quantidade": quantidade,
        "unidade_medida": unidade_medida.strip().upper()
    }

    # print(json.dumps(carga, indent=4))
    return carga