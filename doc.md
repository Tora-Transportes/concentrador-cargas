# Projeto concentrador de cargas

## Funcionalidades

- Crud cargas
- Crud lotes
- Crud produtos
- Registro de rotas pendentes
- Aprovação/Reprovação do GR
- Visualização das coordenadas atuais do veículo
  - Calculo de distancia do ponto atual do veículo até sua ultima viagem emitida
  - Vincular observação à uma placa específica
  - Vincular um funcionário à placa específica
- Relatórios das cargas criadas na plataforma
- Visualização da produção dos veículos no ano
- Pesquisa de veículos em um raio específico

## Fluxo da aplicação
- Recebe a requisição HTTP
- Passa pelos Middlewares
  - Salva o log da requisicao no banco de dados
  - Verifica se esta autenticado
- Encontra a rota específica
- Chama o controller
  - Valida os campos recebidos
  - Instancia os repositórios/servicos/domain
  - coleta o resultado do repositórios/servicos/domain
    - caso seja uma alteração na carga é emitido um evento no websocket
  - envia o resultado para o usuario