from imap_tools import MailBox, AND
from bs4 import BeautifulSoup
import requests

import json
import unicodedata
import re
import time
import os


def normalize_text(text):
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode("utf-8")

server = 'imap-mail.outlook.com'
user = os.environ['EMAIL_ADDRESS']
imap_pass = os.environ['EMAIL_PASSWORD']

mb = MailBox(server).login(user, imap_pass)
messages = mb.fetch(criteria=AND(text="@solucoesusiminas.com", seen=False),
                        mark_seen=True,
                        bulk=True)

files = []
cargas = []
email_position = 0
for msg in messages:
    FIM_EMAIL = "Aviso Legal - Esta mensagem pode conter informações confidenciais e/ou privilegiadas. Se você não for o destinatário ou a pessoa autorizada a receber esta mensagem, não deve usar, copiar ou divulgar as informações nela contida ou tomar qualquer ação"
    print('Minerando > ', msg.from_, ': ', msg.subject)
    soup = BeautifulSoup(msg.html, "html.parser")
    email = normalize_text(soup.text.split(FIM_EMAIL)[0].split("_________________________")[0])

    quem_mandou = list(set(map(lambda x: x.split("<")[1].split(">")[0], re.findall("De: .+<.+@solucoesusiminas\.com>", email))))
    if len(quem_mandou) == 0:
        print("Este email não foi enviado por ninguém da usiminas devo ignorar")
        print(json.dumps(quem_mandou, indent=4))
        continue

    assunto = re.findall("Assunto: (?![RE|ENC]).+", email)[-1].split("Assunto: ")[1]
    corpo = email.split(assunto)[-1].upper().strip().replace("\r", "")
    print("\n\n\n-------------------------------------\nFile ", email_position, "\n------------------------------------\n")
    lines = [line for line in corpo.split("\n") if len(line) > 0]

    documento_transporte = lines[0].split("DO TRANSPORTE: ")[1]
    local_carregamento = lines[1].split("LOCAL DE CARREGAMENTO: ")[1]
    linha_limites = lines[2].split("ENVIO DO VEICULO:")[1].split(" ")
    data_limite = "-".join(reversed(linha_limites[1].split(".")))
    hora_limite = linha_limites[-1]
    data_entrega = None
    tipo_veiculo = None
    peso = None
    unidade_medida = None
    locais_entrega = []
    multas = None
    observacao = ""

    for index, line in enumerate(lines):
        if data_entrega is None and "DATA DE ENTREGA" in line:
            data_entrega = "-".join(reversed(line.split(" ")[-1].split(".")))
            
        
        if tipo_veiculo is None and "TIPO DE VEICULO" in line:
            tipo_veiculo = line.split("TIPO DE VEICULO: ")[1].split(" - ")[0]
            linha_peso = line.split("PESO CARGA: ")[1].replace(".", "").replace(",", ".")
            [peso, unidade_medida] = linha_peso.split(" ")
            peso = float(peso)
        
        if len(locais_entrega) == 0 and "LOCAL DE ENTREGA" in line:
            cursor = index+1
            while cursor < len(lines) and ":" not in lines[cursor]:
                locais_entrega.append(re.sub("^- ", "", lines[cursor].strip()))
                cursor += 1
        
        if multas is None and "MULTAS:" in line:
            multas = ""
            cursor = index+1
            while cursor < len(lines) and ":" not in lines[cursor]:
                multas += "\n" if len(multas) > 0 else ""
                multas += lines[cursor].strip()
                cursor += 1
        
        if len(observacao) == 0 and "OBSERVACAO" in line:
            cursor = index+1
            while cursor < len(lines) and ":" not in lines[cursor]:
                observacao += "\n" if len(observacao) > 0 else ""
                observacao += lines[cursor].strip()
                cursor += 1
            observacao += f"\nEnviado por: <{quem_mandou[0]}>"

    destino_carga = None
    for i in locais_entrega:
        linha_local = i.split(" - ")[1].replace("\t", " ")
        separadores = re.findall("\d+ ", linha_local)
        if len(separadores) == 0:
            continue
        
        campos_local = linha_local.split(separadores[-1])[-1].split(" ")
        uf_destino = campos_local.pop().strip()
        cidade_destino = " ".join(campos_local).strip()
        destino_carga = f"BRASIL/{uf_destino}/{cidade_destino}"
        break
    
    origem_carga = "BRASIL/MG/SANTA LUZIA"
    filial = 150
    # print("Documento de transporte :> ", documento_transporte)
    # print("Peso :> ", peso)
    # print("Unidade medida :> ", unidade_medida)
    # print("Filial :> ", filial)
    # print("Observação :> ", observacao)
    # print("Origem carga :> ", origem_carga)
    # print("Destino carga :> ", destino_carga)
    # print("Local de carregamento :> ", local_carregamento)
    # print("Tipo veiculo :> ", tipo_veiculo)
    # print("Locais entrega :> ", locais_entrega)
    # print("Data entrega :> ", data_entrega)
    # print("Data limite :> ", data_limite, hora_limite)
    # print("Multas :> ", multas)

    hora_limite = None if hora_limite is None else hora_limite[:5]

    carga = {
        "cliente": "SOLUCOES EM ACO USIMINAS S.A. - 42956441000292 - SANTA LUZIA/MG",
        "documento_transporte": documento_transporte,
        "unidade_medida": unidade_medida,
        "quantidade": peso,
        "quantidade_atual": peso,
        "data_cadastro": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "data_atualizacao": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "fk_filial": filial,
        "observacao": observacao,
        "usuario": "BOT IMPORTACAO PORTAL",
        "responsavel_cadastro": "BOT IMPORTACAO PORTAL",
        "e_lote": False,
        "fk_lote_pai": None,
        "fk_situacao": 1,
        "observacao_gr": None,
        "placa_veiculo": None,
        "janela_coleta": hora_limite,
        "janela_entrega": None,
        "canal_comunicacao": "email",
        "acessorios_requisitos": multas,
        "informacoes_restritivas": tipo_veiculo,
        "ativo": 1,
        "data_entrega": data_entrega,
        "data_coleta": data_limite,
        "tipo_carga": None,
        "origem_carga": origem_carga,
        "destino_carga": destino_carga,
        "locais": [local_carregamento]+locais_entrega
    }
    cargas.append(carga)
    email_position += 1


print(json.dumps(cargas, indent=4))
response = requests.post(os.environ['API_URL']+"/portal/cargas", json={"cargas": cargas}, verify=False)
with open("carga.json", "wb") as f:
    f.write(response.content)

print("Dormindo por", int(os.environ['PAUSE_MINUTES']), "minutos")
time.sleep(int(os.environ['PAUSE_MINUTES'])*60)
