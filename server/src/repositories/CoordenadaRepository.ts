import database from "../database";

export class CoordenadaRepository {
  async list(filter: Record<string, any>, pageSize = 10) {
    const traducaoNomeColuna = new Map();
    traducaoNomeColuna.set("responsavel_placa", "responsavel_placa");
    traducaoNomeColuna.set("responsavel_placa_nome", "con_usuarios.nome");
    traducaoNomeColuna.set("responsavel_placa_email", "con_usuarios.email");
    traducaoNomeColuna.set("cpf_motorista", "CG_IDENTIFICACAO.CGI_NUM");
    traducaoNomeColuna.set("apelido_carreta", "APV.AV_DSC");

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
      observacao,
      responsavel_placa,
      responsavel_placa_nome,
      responsavel_placa_email,
      apelido_carreta,
      cpf_motorista,
    } = filter;

    const currentPage = Number(page ?? 1) < 1 ? 1 : Number(page ?? 1);
    const query = database("con_coordenadas_veiculos").select([
      "con_coordenadas_veiculos.*",
      "distancia_ate_destino",
      "con_veiculos_distancia.data_atualizacao as data_calculo",
      "con_dados_coordenadas.observacao",
      "con_dados_coordenadas.data_janela",
      "con_dados_coordenadas.responsavel_placa",
      "con_usuarios.nome as responsavel_placa_nome",
      "con_usuarios.email as responsavel_placa_email",
      // "con_cargas.placa_carreta",
      // "con_cargas.placa_bitrem",
      // "con_cargas.id",
      "CG_IDENTIFICACAO.CGI_NUM as cpf_motorista",
      "APV.AV_DSC as apelido_carreta",
    ]);
    const total = database("con_coordenadas_veiculos")
      .count("placa as total")
      .first();

    query.leftJoin(
      "con_veiculos_distancia",
      "con_veiculos_distancia.fk_placa",
      "con_coordenadas_veiculos.placa"
    );

    total.leftJoin(
      "con_veiculos_distancia",
      "con_veiculos_distancia.fk_placa",
      "con_coordenadas_veiculos.placa"
    );

    query.leftJoin(
      "con_dados_coordenadas",
      "con_dados_coordenadas.fk_placa",
      "con_coordenadas_veiculos.placa"
    );
    total.leftJoin(
      "con_dados_coordenadas",
      "con_dados_coordenadas.fk_placa",
      "con_coordenadas_veiculos.placa"
    );

    query.leftJoin(
      "con_usuarios",
      "con_usuarios.oid",
      "con_dados_coordenadas.responsavel_placa"
    );
    total.leftJoin(
      "con_usuarios",
      "con_usuarios.oid",
      "con_dados_coordenadas.responsavel_placa"
    );

    // query.modify(function (con_coordenadas_veiculos) {
    //   if (date_execel_inicio && date_execel_fim) {
    //     con_coordenadas_veiculos.andWhereBetween(
    //       "con_coordenadas_veiculos.data_emissao_documento",
    //       [
    //         new Date(date_execel_inicio + "T00:00:00"),
    //         new Date(date_execel_fim + "T23:59:59"),
    //       ]
    //     );
    //   }
    // });

    query.leftJoin(
      "VEICULO as VEI",
      "VEI.VEI_COD",
      "con_coordenadas_veiculos.codigo_veiculo"
    );

    total.leftJoin(
      "VEICULO as VEI",
      "VEI.VEI_COD",
      "con_coordenadas_veiculos.codigo_veiculo"
    );

    query.leftJoin("APELIDO_VEICULO as APV", "APV.AV_SEQ", "VEI.AV_SEQ");
    total.leftJoin("APELIDO_VEICULO as APV", "APV.AV_SEQ", "VEI.AV_SEQ");

    query.leftJoin("CADASTRO_GERAL AS CAG", "CAG.CG_COD", "VEI.CG_MOT");
    total.leftJoin("CADASTRO_GERAL AS CAG", "CAG.CG_COD", "VEI.CG_MOT");

    query
      .innerJoin("CG_IDENTIFICACAO", function () {
        this.on("CG_IDENTIFICACAO.LOC_COD", "CAG.LOC_COD").andOn(
          "CG_IDENTIFICACAO.CG_COD",
          "CAG.CG_COD"
        );
      })
      .where("CG_IDENTIFICACAO.TI_COD", 2);

    total
      .innerJoin("CG_IDENTIFICACAO", function () {
        this.on("CG_IDENTIFICACAO.LOC_COD", "CAG.LOC_COD").andOn(
          "CG_IDENTIFICACAO.CG_COD",
          "CAG.CG_COD"
        );
      })
      .where("CG_IDENTIFICACAO.TI_COD", 2);

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
      observacao,
      responsavel_placa,
      responsavel_placa_nome,
      responsavel_placa_email,
      // id,
      // placa_bitrem,
      // placa_carreta,
      cpf_motorista,
      apelido_carreta,
    })) {
      if (value !== undefined && key) {
        const columnName = traducaoNomeColuna.get(key) ?? key;
        if (traducaoNomeColuna.get(key)) {
          const validationValue: string =
            key === "apelido_carreta" ? value.toUpperCase() : value;
          query.where(columnName, "like", `%${validationValue}%`);
          total.where(columnName, "like", `%${validationValue}%`);
        } else {
          query.where(columnName, "like", `%${value.toUpperCase()}%`);
          total.where(columnName, "like", `%${value.toUpperCase()}%`);
        }
      }
    }

    if (order_column) {
      const columnName =
        traducaoNomeColuna.get(String(order_column)) ?? String(order_column);

      query.orderBy(columnName, String(order_direction));
    }
    query.orderBy("mct");
    query.limit(pageSize);
    query.offset((currentPage - 1) * pageSize);

    //console.log(query.toSQL().toNative());

    const totalRegisters = Number((await total)?.total) || 0;
    const totalPages = Math.ceil(totalRegisters / pageSize);
    return {
      page: currentPage,
      total_registers: totalRegisters,
      total_pages: totalPages,
      results: await query,
    };
  }

  async update(placa: string, dados: Record<string, any>) {
    const dadosParaAtualizar = { ...dados };
    if (dadosParaAtualizar.observacao) {
      dadosParaAtualizar.observacao =
        dadosParaAtualizar?.observacao?.toUpperCase();
    }
    return await database("con_dados_coordenadas")
      .update(dadosParaAtualizar)
      .where("fk_placa", placa);
  }
}
