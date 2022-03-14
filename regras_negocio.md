# REGRAS DE NEGOCIO DA APLICACAO

## GERAL
- Não é possível cadastrar carga sem:
    - e_lote
    - cliente
    - **quantidade**
    - unidade_medida
    - canal_comunicacao
    - responsavel_cadastro
- Não é possível excluir carga sem a permissao DELETAR_CARGAS.
- Não é possivel registrar uma placa sem motorista vinculado.
- Carga nao pode ser movimentada apos ser cancelada.
- Os unicos movimentos que a carga pode fazer apos ser aprovada pelo gr é ser cancelada ou ter o documento emitido.
- O usuário deve possuir a permissao DELETAR_CARGAS para realizar o cancelamento da carga.
- O usuário deve possuir a permissao VINCULAR_PLACA para vincular a placa na carga.
- Não é possível registrar uma carga com quantidade vazia ou negativa.
- Para deletar uma carga é necessário preencher observacao_exclusao

## SITUACAO VEICULO
|ID|DESCRICAO|
|--|--|
|1|AGUARDANDO ALOCACAO DO VEICULO|
|2|AGUARDANDO APROVACAO DO GR|
|3|VEICULO APROVADO|
|4|VEICULO REPROVADO|
|5|CARGA CANCELADA|
|6|DOCUMENTO EMITIDO|

- Não é possível atualizar a situacao da carga para qualquer valor tirando "AGUARDANDO ALOCACAO DO VEICULO" sem atribuir uma placa a carga.
- Ao modificar o campo placa do veiculo a situacao deve ser resetada para "AGUARDANDO ALOCACAO DO VEICULO" se não tiver placa e "AGUARDANDO APROVACAO DO GR" caso tenha placa.
- Não é possível atualizar a situacao para "AGUARDANDO ALOCACAO DO VEICULO" com uma placa de veículo cadastrado.
- Ao cadastrar carga que não possui rota entre origem_carga e destino_carga deve ser colocado na tela de pendencias para ser revisado.

## LOTE
- Não é possível atualizar um lote para virar uma carga.
- Não é possível atualizar quantidade e unidade de medida de um lote.
- Ao gerar uma carga derivada de um lote a quantidade do lote deve ser subtraida.

## CARGA DERIVADA
- Não é possível alterar a unidade de medida de uma carga derivada em relação ao lote pai.
- Não é possível cadastrar uma carga derivada com mais quantidade que a quantidade atual do lote.

## PRODUTOS
- Não é possível cadastrar produtos em minusculo.
- Não é possivel cadastrar produtos com nome repetido.
- Não é possível cadastrar/atualizar/desativar produtos sem a permissao CADASTRAR_PRODUTOS.
- Não é possível atualizar produto para um nome em minusculo.
- Não é possível atualizar produto para um nome que ja existe.

## USUARIOS
- Não é possivel alterar as permissoes do usuario sem a permissao ALTERAR_PERMISSOES.

## COORDENADAS
- Não é possível modificar o vinculo de um programador com uma placa sem a permissão VINCULAR_PLACA.

## MONITORAMENTO
- Não é possível atualizar a situacao para "VEICULO APROVADO" ou "VEICULO REPROVADO" sem a permissao de "APROVAR_VEICULOS".
- Não é possível atualizar para "VEICULO APROVADO" ou "VEICULO REPROVADO" sem preencher observacao_gr.
- Não é possível atualizar a situacao para "VEICULO APROVADO" sem preencher a filial.
- Não é possível atualizar a situacao da carga para "VEICULO_APROVADO" se a origem e/ou destino da carga nao estiver no formato "PAIS/UF/CIDADE".
- Não é possível atualizar a situacao da carga para "VEICULO_APROVADO" se o cliente nao estiver no formato correto "NOME - CNPJ - UF/CIDADE".