from imap_tools import MailBox, AND, OR
from bs4 import BeautifulSoup
import requests

import json
import unicodedata
import time
from os import environ

def formatar_data(data):
    if not data:
        return data
    campos = data.split(" ")
    dia_formatado = "-".join(reversed(campos[0].split("/")))
    if len(campos) > 1:
        return dia_formatado+"T"+campos[1]

    return dia_formatado

def agrupar_descricoes(chaves, objeto):
    return "\n".join([f"{chave}: {objeto[chave]}" for chave in chaves if chave in objeto])

def normalize_text(text):
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode("utf-8")


def de_para_cliente_pagador(chave_cliente_pagador):
    chave = chave_cliente_pagador.upper().strip()
    de_para = {
        "CKD": "FCA FIAT CHRYSLER AUTOMOVEIS BRASIL LTDA - 16701716001713 - BETIM/MG",
        "FPT FIRE": "FCA FIAT CHRYSLER AUTOMOVEIS BRASIL LTDA - 16701716003333 - BETIM/MG",
        "FIASA": "FCA FIAT CHRYSLER AUTOMOVEIS BRASIL LTDA - 16701716000156 - BETIM/MG",
        "FIAPE": "FCA FIAT CHRYSLER AUTOMOVEIS BRASIL LTDA - 16701716003686 - GOIANA/PE"
    }
    if chave not in de_para:
        return None
    return de_para[chave]

def escrever(name, content):
    with open(name, "w") as f:
        f.write(content)

def minerar_paragrafo(html_paragrafo):
    linha = str(html_paragrafo).replace("\r", "").replace("\n", "")
    linha = linha.replace("<b>", "\n").replace("</b>", "")
    linha = BeautifulSoup(linha, "html.parser").text
    linhas = [i for i in linha.split("\n") if len(i) > 0]
    output = {}
    for i in linhas:
        [chave, valor] = normalize_text(i).split(": ")
        chave = chave.replace("- ", "").replace("/", "_").strip().lower().replace(" ", "_")
        output[chave] = valor.strip().upper()
    return output

server = 'imap-mail.outlook.com'
user = environ['EMAIL_ADDRESS']
imap_pass = environ['EMAIL_PASSWORD']

mb = MailBox(server).login(user, imap_pass)
messages = mb.fetch(criteria=AND(OR(text="stellantis.com", seen=False), OR(text="fcagroup.com", seen=False), AND(subject="Ativacao")),
                        mark_seen=True,
                        bulk=True)

cargas = []
for msg in messages:
    FIM_EMAIL = "To unsubscribe from this group and stop receiving emails from it, send an email to"
    print('Minerando > ', msg.from_, ': ', msg.subject)
    soup = BeautifulSoup(msg.html, "html.parser")
    texto_email = normalize_text(soup.text.split(FIM_EMAIL)[0]).replace("\r", "")
    html_email = normalize_text(str(soup.html))

    # escrever("1.html", html_email)

    # if "1145391" not in msg.subject:
    #     continue

    # print(re.findall("Assunto: (?![RE|ENC]).+", texto_email))
    # assunto = re.findall("Assunto: (?![RE|ENC]).+", texto_email)[-1].split("Assunto: ")[1]
    
    origem_carga = None
    destino_carga = None

    chaves_email = {}
    blocos = [chaves_email]
    for p in soup.find_all("p"):
        if "____________________" in p.text:
            chaves_email = {}
            blocos.append(chaves_email)

        if ":" not in p.text:
            continue

        valores_paragrafo = minerar_paragrafo(str(p))
        if not "locais" in chaves_email and "fornecedor" in chaves_email:
            chaves_email["locais"] = []
            
        if "cidade_uf" in valores_paragrafo:
            chaves_email['locais'].append(valores_paragrafo['cidade_uf'])
            if origem_carga is None:
                origem_carga = valores_paragrafo['cidade_uf']
            destino_carga = valores_paragrafo['cidade_uf']
            del valores_paragrafo['cidade_uf']

        chaves_email.update(valores_paragrafo)


    # print(blocos)
    origem_carga = "BRASIL/" + "/".join(reversed(origem_carga.split("/")))
    destino_carga = "BRASIL/" + "/".join(reversed(destino_carga.split("/")))

    # print(json.dumps(blocos, indent=4))
    chave_cliente_pagador = blocos[-1]['fonte_pagadora'].split(" (")[0].strip()
    cliente_pagador = de_para_cliente_pagador(chave_cliente_pagador)
    ativacao = blocos[0]['ativacao']

    blocos_descritivos = {}
    blocos_descritivos.update(blocos[0])
    blocos_descritivos.update(blocos[-1])
    observacao = agrupar_descricoes([
        "codigo_rota",
        "tipo_de_viagem",
        "tipo_de_fluxo",
        "solicitado_por",
        "km_total",
        "custo_total_do_material_transportado",
        "pedagio"
    ], blocos_descritivos)

    restricao_veiculo = agrupar_descricoes([
        "veiculo_a_ser_utilizado",
        "motorista",
        "hazmat",
        "escolta",
        "recoleta",
        "dois_motoristas",
        "troca_motorista"
    ], blocos_descritivos)

    generalidades = blocos[-1]['generalidades']

    data_minima_entrega = None
    locais = []
    for b in blocos:
        if "locais" not in b:
            continue
        texto = f"COLETA: {b['fornecedor']} - {b['horario_programado_coleta']} - {b['local_de_coleta']} - {b['locais'][0]}"
        locais.append(texto)

        texto = f"ENTREGA: {b['fornecedor']} - {b['horario_programado_chegada']} - {b['endereco_destino_dos_materiais']} - {b['locais'][1]}"
        locais.append(texto)

        if data_minima_entrega is None:
            data_minima_entrega = formatar_data(b['horario_programado_chegada'])
        elif data_minima_entrega > formatar_data(b['horario_programado_chegada']):
            data_minima_entrega = formatar_data(b['horario_programado_chegada'])

    locais.sort(key=lambda x: formatar_data(x.split(" - ")[1]))

    data_coleta = formatar_data(blocos[0]['data_coleta'])


    filial = None
    if "BRASIL/PR" in origem_carga:
        filial = 21
    else:
        for i in ["BALDIM","BARAO DE COCAIS","BELO HORIZONTE","BELO VALE","BETIM","BOM JESUS DO AMPARO","BONFIM","BRUMADINHO","CAETE","CAPIM BRANCO","CONFINS","CONTAGEM","ESMERALDAS","FLORESTAL","FORTUNA DE MINAS","FUNILANDIA","IBIRITE","IGARAPE","INHAUMA","ITABIRITO","ITAGUARA","ITATIAIUCU","ITAUNA","JABOTICATUBAS","JUATUBA","LAGOA SANTA","MARIO CAMPOS","MATEUS LEME","MATOZINHOS","MOEDA","NOVA LIMA","NOVA UNIAO","PARA DE MINAS","PEDRO LEOPOLDO","PRUDENTE DE MORAIS"]:
            if i in origem_carga:
                filial = 153
                break
        if filial is None:
            filial = 77


    

    carga = {
        "usuario": "BOT IMPORTACAO PORTAL",
        "responsavel_cadastro": "BOT IMPORTACAO PORTAL",
        "e_lote": False,
        "fk_lote_pai": None,
        "fk_situacao": 1,
        "observacao_gr": None,
        "placa_veiculo": None,
        "ativo": 1,
        "unidade_medida": "VIAGEM",
        "quantidade": 1,
        "quantidade_atual": 1,
        "data_cadastro": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "data_atualizacao": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "canal_comunicacao": "email",
        "tipo_carga": None,

        "cliente": cliente_pagador,
        "documento_transporte": ativacao,
        "fk_filial": filial,
        "origem_carga": origem_carga,
        "destino_carga": destino_carga,
        "observacao": observacao,
        "informacoes_restritivas": restricao_veiculo,
        "acessorios_requisitos": generalidades,


        "janela_coleta": None,
        "janela_entrega": None,

        "data_entrega": data_minima_entrega.split("T")[0],
        "data_coleta": data_coleta,
        "locais": locais
    }

    cargas.append(carga)
escrever("cargas.json", json.dumps(cargas, indent=4))
response = requests.post(f"{environ['API_URL']}/portal/cargas", json={"cargas": cargas}, verify=False)
escrever("api.json", response.text)

print("Dormindo por", int(environ['PAUSE_MINUTES']), "minutos")
time.sleep(int(environ['PAUSE_MINUTES'])*60)