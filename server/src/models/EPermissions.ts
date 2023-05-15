enum EPermissions {
  DELETAR_CARGAS = "DELETAR_CARGAS",
  CADASTRAR_PRODUTOS = "CADASTRAR_PRODUTOS",
  ALTERAR_PERMISSOES = "ALTERAR_PERMISSOES",
  APROVAR_VEICULOS = "APROVAR_VEICULOS",
  APROVAR_VIAGEM = "APROVAR_VIAGEM",
  VINCULAR_PLACA = "VINCULAR_PLACA",
  REGISTRAR_JUSTIFICATIVA = "REGISTRAR_JUSTIFICATIVA",
  CARGAS_CSN = "CARGAS_CSN",
  CARGAS_PADRAO = "CARGAS_PADRAO",
  FINALIZAR_CARGAS_CSN = "FINALIZAR_CARGAS_CSN",
  MANUTENCAO_TRAJETO_FINALIZADO = "MANUTENCAO_TRAJETO-FINALIZADO",
  ENVIAR_CARGA_APP = "ENVIAR_CARGA_APP",
  GERENCIAR_AVISOS = "GERENCIAR_AVISOS",
  ALTERACAO_PARCIAL = "ALTERACAO_PARCIAL",
  EXPURGAR_CARGA = "EXPURGAR_CARGA",
  HISTORICO_VEICULOS_2 = "HISTORICO_VEICULOS_2",
  ENGATE_DESENGATE_CCA = "ENGATE/DESENGATE_CCA",
  ENGATE_DESENGATE_CCA_ADIMIN = "ENGATE/DESENGATE_CCA_ADIMIN",
}

export function isValidPermission(permission: string) {
  return (
    permission === EPermissions.DELETAR_CARGAS ||
    permission === EPermissions.CADASTRAR_PRODUTOS ||
    permission === EPermissions.ALTERAR_PERMISSOES ||
    permission === EPermissions.APROVAR_VEICULOS ||
    permission === EPermissions.APROVAR_VIAGEM ||
    permission === EPermissions.REGISTRAR_JUSTIFICATIVA ||
    permission === EPermissions.VINCULAR_PLACA ||
    permission === EPermissions.CARGAS_CSN ||
    permission === EPermissions.CARGAS_PADRAO ||
    permission === EPermissions.FINALIZAR_CARGAS_CSN ||
    permission === EPermissions.MANUTENCAO_TRAJETO_FINALIZADO ||
    permission === EPermissions.ENVIAR_CARGA_APP ||
    permission === EPermissions.GERENCIAR_AVISOS ||
    permission === EPermissions.ALTERACAO_PARCIAL ||
    permission === EPermissions.EXPURGAR_CARGA ||
    permission === EPermissions.HISTORICO_VEICULOS_2 ||
    permission === EPermissions.ENGATE_DESENGATE_CCA ||
    permission === EPermissions.ENGATE_DESENGATE_CCA_ADIMIN
  );
}

export default EPermissions;
