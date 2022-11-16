enum EPermissions {
  DELETAR_CARGAS = "DELETAR_CARGAS",
  CADASTRAR_PRODUTOS = "CADASTRAR_PRODUTOS",
  ALTERAR_PERMISSOES = "ALTERAR_PERMISSOES",
  APROVAR_VEICULOS = "APROVAR_VEICULOS",
  APROVAR_VIAGEM = "APROVAR_VIAGEM",
  VINCULAR_PLACA = "VINCULAR_PLACA",
  REGISTRAR_JUSTIFICATIVA = "REGISTRAR_JUSTIFICATIVA",
  CARGAS_CSN = "CARGAS_CSN",
}

export function isValidPermission(permission: string) {
  return (
    permission === EPermissions.DELETAR_CARGAS ||
    permission === EPermissions.CADASTRAR_PRODUTOS ||
    permission === EPermissions.ALTERAR_PERMISSOES ||
    permission === EPermissions.APROVAR_VEICULOS ||
    permission === EPermissions.APROVAR_VIAGEM ||
    permission === EPermissions.REGISTRAR_JUSTIFICATIVA ||
    permission === EPermissions.VINCULAR_PLACA||
    permission === EPermissions.CARGAS_CSN
  );
}

export default EPermissions;
