# Concentrador de cargas 🚛

## Rodando o projeto 💿

- Parametrizando o ambiente

```bash
git clone git@github.com:Tora-Transportes/concentrador-cargas.git
cd concentrador-cargas/client
cp .env.example .env
# Adicione os tokens do Active Directory no arquivo .env
```

- Iniciando o projeto

```bash
# Define para o react usar ssl e aponta os certificados
HTTPS=true SSL_CRT_FILE="../server/certificates/server.cert" SSL_KEY_FILE="../server/certificates/server.key" yarn start
```
