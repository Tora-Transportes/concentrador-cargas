import json
from requests import Session, post
from bs4 import BeautifulSoup
import data
import time
import unicodedata
from os import environ

import sys
sys.path.append("..")

from credenciais import Credenciais


session = Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"
})

def env(key: str):
    return environ[key]

def normalize(text):
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')

def extract_inputs(html: BeautifulSoup):
    values = {}
    for i  in html.find_all("input"):
        try:
            values[i["name"]] = ""
            values[i["name"]] = i["value"]
        except:
            pass
    for i  in html.find_all("select"):
        try:
            values[i["name"]] = ""
            values[i["name"]] = i["value"]
        except:
            pass
    return values

def extract_session_values(html):
    action = html.find(attrs={"id": "sap.client.SsrClient.form"})["action"]
    return {
        "sap-wd-secure-id": extract_inputs(html)["sap-wd-secure-id"],
        "url_action": f"https://ebusiness.rhi-ag.com{action}"

    }

def login(session: Session, login: str, password: str):
    url = "https://ebusiness.rhi-ag.com/sap/bc/webdynpro/sap/zvtr_wd_transportation"
    response = session.get(url)

    soup = BeautifulSoup(response.text, "html.parser")
    inputs = extract_inputs(soup)
    inputs.update({
        "sap-user": login,
        "sap-language": "EN",
        "sap-password": password
    })
    response = session.post(url, data=inputs)
    return response

def report(session: Session, html_page: str, data_atual: str):
    page = BeautifulSoup(html_page, "html.parser")


    inputs = {
        "sap-charset": "utf-8",
        "fesrAppName": "ZVTR_WD_TRANSPORTATION",
        "SAPEVENTQUEUE": "ClientInspector_Notify~E002Id~E004WD01~E005Data~E004ClientWidth~003A1536px~003BClientHeight~003A754px~003BScreenWidth~003A1536px~003BScreenHeight~003A864px~003BScreenOrientation~003Alandscape~003BThemedFormLayoutRowHeight~003A27px~003BThemedSvgLibUrls~003A~007B~007D~003BThemeTags~003AUiGuidelines_2~003BDeviceType~003ADESKTOP~E003~E002ResponseData~E004delta~E005EnqueueCardinality~E004single~E003~E002~E003~E001LoadingPlaceHolder_Load~E002Id~E004_loadingPlaceholder_~E003~E002ResponseData~E004delta~E005ClientAction~E004submit~E003~E002~E003",
        "sap-wd-secure-id": extract_inputs(page)["sap-wd-secure-id"]
    }
    action = page.find(attrs={"id": "sap.client.SsrClient.form"})["action"]
    url = f"https://ebusiness.rhi-ag.com{action}"
    response = session.post(url, data=inputs)

    inputs = {
        "sap-charset": "utf-8",
        "fesrAppName": "ZVTR_WD_TRANSPORTATION",
        "SAPEVENTQUEUE": f"InputField_Change~E002Id~E004WDD9~E005Value~E004{data_atual}~E003~E002ResponseData~E004delta~E005EnqueueCardinality~E004single~E005Delay~E004full~E003~E002~E003~E001InputField_Change~E002Id~E004WDDD~E005Value~E004{data_atual}~E003~E002ResponseData~E004delta~E005EnqueueCardinality~E004single~E005Delay~E004full~E003~E002~E003~E001Button_Press~E002Id~E004WD010E~E003~E002ResponseData~E004delta~E005ClientAction~E004submit~E003~E002~E003",
        "sap-wd-secure-id": extract_inputs(page)["sap-wd-secure-id"]
    }
    action = page.find(attrs={"id": "sap.client.SsrClient.form"})["action"]
    url = f"https://ebusiness.rhi-ag.com{action}"
    response = session.post(url, data=inputs)
    return response


def detalhes_carga(session:Session, session_values, event_key: str):
    event = f"Link_Activate~E002Id~E004{event_key}~E005Ctrl~E004false~E005Shift~E004false~E003~E002ResponseData~E004delta~E005ClientAction~E004submit~E003~E002~E003"
    # event = f"SapTable_ClientRowSelect~E002Id~E004WD0134~E005RowIndex~E0041~E005RowUserData~E004~E005CellUserData~E004~E005AccessType~E004STANDARD~E005TriggerCellId~E004WD019F~E003~E002ResponseData~E004delta~E003~E002~E003~E001Link_Activate~E002Id~E004{event_key}~E005Ctrl~E004false~E005Shift~E004false~E003~E002ResponseData~E004delta~E005ClientAction~E004submit~E003~E002~E003"
    inputs = {
        "sap-charset": "utf-8",
        "fesrAppName": "ZVTR_WD_TRANSPORTATION",
        "SAPEVENTQUEUE": event,
        "sap-wd-secure-id": session_values["sap-wd-secure-id"]
    }
    
    url = session_values["url_action"]

    print("Requisitando")
    print(url)
    print("COM", inputs)

    details_page = session.post(url, data=inputs)

    soup_details = BeautifulSoup(details_page.text.split("CDATA")[1].split("]]")[0], "html.parser")
    button_back_id = soup_details.find_all("tbody",attrs={"class": "urLinStd"})[1].find_all(attrs={"ct": "B"})[0]["id"]
    print("Id pra voltar", button_back_id)

    inputs_back = {
        "SAPEVENTQUEUE": f"Button_Press~E002Id~E004{button_back_id}~E003~E002ResponseData~E004delta~E005ClientAction~E004submit~E003~E002~E003",
        "sap-charset": "utf-8",
        "fesrAppName": "ZVTR_WD_TRANSPORTATION",
        "sap-wd-secure-id": session_values["sap-wd-secure-id"]
    }
    back = session.post(url, data=inputs_back)

    return {"details": details_page, "main_page": back}


data_atual = time.strftime("%d.%m.%Y")
# data_atual = "29.03.2022"
print("Data pesquisa: ", data_atual)
storage_credenciais = Credenciais()
url_api_credenciais = f"{env('API_URL')}/credenciais/{env('PORTAL')}/{env('LOGIN')}"
credenciais = storage_credenciais.buscar_credenciais_login(url_api_credenciais, env("API_TOKEN"))
if credenciais["errored"]:
    print("Credencial invalida na api")
    print("Esperando 30 minutos antes de finalizar processo")
    time.sleep(1800)
    exit(1)

main_page = login(session, env('LOGIN'), credenciais['password'])
if "fesrAppName" not in main_page.text:
    storage_credenciais.emitir_erro_login(credenciais, url_api_credenciais)
    print("Esperando 30 minutos antes de finalizar processo")
    time.sleep(1800)
    raise Exception("Erro de login")
    

storage_credenciais.incrementar_sucesso_login(credenciais, url_api_credenciais)


report_response = report(session, main_page.text, data_atual)
with open("report_response.html", "wb") as file:
    file.write(report_response.content)

soup_main_page = BeautifulSoup(main_page.text, "html.parser")
session_values = extract_session_values(soup_main_page)
sap_secure_id = session_values["sap-wd-secure-id"]
url_action = session_values["url_action"]

total_linhas_processadas = 0
soup = BeautifulSoup(report_response.text.split("CDATA")[1].split("]]")[0], "html.parser")
quantidade_registros = len(soup.find_all("tr"))


cargas = []
for n in range(quantidade_registros):
    linha_relatorio = soup.find_all("tr")[n]
    
    if linha_relatorio.has_attr("rr"):
        cols = [normalize(j.text.strip()) for j in linha_relatorio.find_all("td")]
        if cols[1] == "There were no shipments found for these selection parameters":
            print("Rows not found")
            break
        print("RELATORIO", cols[1])
        id_link_detalhes = linha_relatorio.find_all("td")[1].find_all("a")[0]["id"]
        print(id_link_detalhes)
        response = detalhes_carga(session, session_values, id_link_detalhes)
        soup = BeautifulSoup(response["main_page"].text.split("CDATA")[1].split("]]")[0], "html.parser")
        
        with open(f"{cols[1]}.html", "wb") as ff:
            ff.write(response["details"].content)
        print(cols[1])
        carga = data.extrair_carga(response["details"].text)
        cargas.append(carga)
        total_linhas_processadas+=1
print("Feito com ", total_linhas_processadas)

if len(cargas) > 0:
    print("Enviando", len(cargas), "cargas para o servidor")
    response = post(env("API_URL")+"/portal/cargas", json={"cargas": cargas}, verify=False)
    with open("temp.json", "wb") as file:
        file.write(response.content)

print(f"Dormindo por {environ['PAUSE_MINUTES']} minutos")
time.sleep(int(environ['PAUSE_MINUTES'])*60)