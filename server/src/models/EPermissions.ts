enum EPermissions {
  DELETAR_CARGAS = "DELETAR_CARGAS",
  CADASTRAR_PRODUTOS = "CADASTRAR_PRODUTOS",
  ALTERAR_PERMISSOES = "ALTERAR_PERMISSOES",
}

export function isValidPermission(permission: string) {
  return (
    permission === EPermissions.DELETAR_CARGAS ||
    permission === EPermissions.CADASTRAR_PRODUTOS ||
    permission === EPermissions.ALTERAR_PERMISSOES
  );
}

export default EPermissions;
