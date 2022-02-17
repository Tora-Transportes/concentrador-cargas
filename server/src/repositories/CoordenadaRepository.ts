import database from "../database";

export class CoordenadaRepository {
  async list(filter: Record<string, any>, pageSize = 10) {
    const { order_column, order_direction, page } = filter;
    const {
      placa,
      mct,
      codigo_veiculo,
      cidade_atual,
      ultima_viagem_origem,
      ultima_viagem_destino,
      documento,
      tipo_documento,
      categoria_veiculo,
      setor_veiculo,
      tipo_cavalo,
      tipo_carreta,
      telefone_motorista,
      nome_motorista,
    } = filter;
    const currentPage = Number(page ?? 1) < 1 ? 1 : Number(page ?? 1);
    const query = database("con_coordenadas_veiculos").select([
      "con_coordenadas_veiculos.*",
      "distancia_ate_destino",
      "con_veiculos_distancia.data_atualizacao as data_calculo",
    ]);
    const total = database("con_coordenadas_veiculos")
      .count("placa as total")
      .first();
    query.leftJoin(
      "con_veiculos_distancia",
      "con_veiculos_distancia.fk_placa",
      "con_coordenadas_veiculos.placa"
    );
    for (const [key, value] of Object.entries({
      placa,
      mct,
      codigo_veiculo,
      cidade_atual,
      ultima_viagem_origem,
      ultima_viagem_destino,
      documento,
      tipo_documento,
      categoria_veiculo,
      setor_veiculo,
      tipo_cavalo,
      tipo_carreta,
      telefone_motorista,
      nome_motorista,
    })) {
      if (value !== undefined && key) {
        query.where(key, "like", `%${value.toUpperCase()}%`);
        total.where(key, "like", `%${value.toUpperCase()}%`);
      }
    }

    if (order_column) {
      query.orderBy(String(order_column), String(order_direction));
    }
    query.orderBy("mct");
    query.limit(pageSize);
    query.offset((currentPage - 1) * pageSize);

    const totalRegisters = Number((await total)?.total) || 0;
    const totalPages = Math.ceil(totalRegisters / pageSize);
    return {
      page: currentPage,
      total_registers: totalRegisters,
      total_pages: totalPages,
      results: await query,
    };
  }
}
