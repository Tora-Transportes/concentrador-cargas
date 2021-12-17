enum EPermissions {
  DELETAR_CARGAS = "DELETAR_CARGAS",
  CADASTRAR_PRODUTOS = "CADASTRAR_PRODUTOS",
  ALTERAR_PERMISSOES = "ALTERAR_PERMISSOES",
  APROVAR_VEICULOS = "APROVAR_VEICULOS",
}

export function isValidPermission(permission: string) {
  return (
    permission === EPermissions.DELETAR_CARGAS ||
    permission === EPermissions.CADASTRAR_PRODUTOS ||
    permission === EPermissions.ALTERAR_PERMISSOES ||
    permission === EPermissions.APROVAR_VEICULOS
  );
}

export default EPermissions;
