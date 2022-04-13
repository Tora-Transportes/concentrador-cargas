from requests import put, get

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class Credenciais:
    def __init__(self):
        pass
    def incrementar_sucesso_login(self, credenciais, api_url):
        credenciais["successful_attempts"] += 1
        return put(api_url, json=credenciais, verify=False)

    def emitir_erro_login(self, credenciais, api_url):
        credenciais["errored"] = True
        return put(api_url, json=credenciais, verify=False)

    def buscar_credenciais_login(self, api_url, api_token):
        return get(api_url, headers={
            "Authorization": f"TOKEN {api_token}"
        }, verify=False).json()
    
    def listar_credenciais(self, api_url, api_token):
        return get(api_url, headers={
            "Authorization": f"TOKEN {api_token}"
        }, verify=False).json()
    