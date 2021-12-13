import database from "../database";

export class VeiculoRepository {
  async search(placa: string) {
    const query = database("TIPO_VEICULO")
      .select([
        "VEICULO.VEI_COD as id_veiculo",
        "TIPO_VEICULO.TV_COD as id_tipo_veiculo",
        "TIPO_VEICULO.TV_DSC as descricao",
        "VEI_PLACA as placa",
        "VEI_ANO as ano",
        "VEI_CHASSIS as chassis",
      ])
      .join("VEICULO", "VEICULO.TV_COD", "TIPO_VEICULO.TV_COD")
      .where("VEI_PLACA", placa)
      .first();
    return query;
  }
}
