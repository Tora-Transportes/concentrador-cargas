import database from "../database";

export class VeiculoRepository {
  async search(placa: string) {
    const query = database("TIPO_VEICULO")
      .select([
        "VEICULO.VEI_COD as id_veiculo",
        "TIPO_VEICULO.TV_COD as id_tipo_veiculo",
        "TIPO_VEICULO.TV_DSC as descricao",
        "VEICULO.VEI_PLACA as placa",
        "VEICULO.VEI_ANO as ano",
        "VEICULO.VEI_CHASSIS as chassis",
        "CARRETA.VEI_PLACA as placa_carreta",
      ])
      .join("VEICULO", "VEICULO.TV_COD", "TIPO_VEICULO.TV_COD")
      .leftJoin(
        database("VEICULO").as("CARRETA"),
        "CARRETA.VEI_COD",
        "VEICULO.COD_CARRETA"
      )
      .where("VEICULO.VEI_PLACA", placa)
      .first();
    return query;
  }
}
