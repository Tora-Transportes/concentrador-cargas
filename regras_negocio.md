# TESTES

## CARGAS

### GERAL
- Não é possível cadastrar carga sem:
    - id
    - e_lote
    - cliente
    - quantidade
    - unidade_medida
- Não é possível cadastrar carga com id repetido
- Não é possível excluir carga sem a permissao CADASTRAR_PRODUTOS
- Não é possivel registrar uma placa sem motorista vinculado

### SITUACAO VEICULO
|ID|DESCRICAO|
|--|--|
|1|AGUARDANDO ALOCACAO DO VEICULO|
|2|AGUARDANDO APROVACAO DO GR|
|3|VEICULO APROVADO|
|4|VEICULO REPROVADO|

- Não é possível atualizar o fk_situacao da carga para 3 ou 2 sem uma placa
- Ao modificar o campo placa do veiculo fk_situacao deve ser movido para 2 caso tenha placa e 1 caso esteja sem a placa
- Não é possível atualizar fk_situacao para 3 ou 4 sem permissao de APROVAR_VEICULOS
- Não é possível atualizar fk_situacao para 3 ou 4 sem preencher observacao_gr
- Não é possível atualizar fk_situacao para 1 com uma placa de veículo cadastrado

### LOTE
- Não é possível atualizar um lote para virar uma carga
- Não é possível atualizar quantidade e unidade de medida de um lote

### DERIVADA
- Não é possível atualizar a unidade de medida de uma carga derivada
- Não é possível cadastrar uma carga derivada com mais quantidade que a quantidade atual do lote

## PRODUTOS
- Não é possível cadastrar produtos em minusculo
- Não é possivel cadastrar produtos com nome repetido
- Não é possível cadastrar/atualizar/desativar produtos sem a permissao CADASTRAR_PRODUTOS

## USUARIOS
- Não é possivel alterar as permissoes do usuario sem a permissao ALTERAR_PERMISSOES