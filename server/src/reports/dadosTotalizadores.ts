import database from "../database";
import xlsx from "xlsx";

export interface IFilter {
  data_inicio?: string;
  data_final?: string;
  fk_filial?: string | null;
}

export class ReportDetalhesTotalizadores {
  factory(key: string) {
    if (key === "portal") {
      return database("con_cargas")
        .where("canal_comunicacao", "portal")
        .where("e_lote", 0)
        .where("ativo", 1);
    }
    if (key === "manual") {
      return database("con_cargas")
        .where("canal_comunicacao", "manual")
        .where("e_lote", 0)
        .where("ativo", 1);
    }
    if (key === "ativas") {
      return database("con_cargas").where("e_lote", 0).where("ativo", 1);
    }
    if (key === "desativadas") {
      return database("con_cargas").where("e_lote", 0).where("ativo", 0);
    }

    if (key === "lotes_ativos") {
      return database("con_cargas").where("e_lote", 1).where("ativo", 1);
    }
    if (key === "lotes_desativados") {
      return database("con_cargas").where("e_lote", 1).where("ativo", 0);
    }
    if (key === "completo") {
      return database("con_cargas").where("e_lote", 0);
    }

    if (key === "email") {
      return database("con_cargas")
        .where("e_lote", 0)
        .where("ativo", 1)
        .where("canal_comunicacao", "email");
    }

    throw new Error("Invalid key");
  }

  async generate(
    key: string,
    { data_inicio, data_final, fk_filial }: IFilter,
    filename: string
  ) {
    const query = this.factory(key)
      .select([
        "con_cargas.id AS Código da carga",
        "con_cargas.cliente AS Cliente",
        database.raw(
          `CASE WHEN "con_cargas"."e_lote" = 0 THEN 'Não' WHEN "con_cargas"."e_lote" = 1 THEN 'Sim' END AS "E lote"`
        ),
        "con_cargas.origem_carga AS Origem Carga",
        "con_cargas.destino_carga AS Destino Carga",
        database.raw(
          `to_char("con_cargas"."data_entrega", 'dd/mm/yyyy') AS "Data Entrega"`
        ),
        database.raw(
          `to_char("con_cargas"."data_coleta", 'dd/mm/yyyy') AS "Data Coleta"`
        ),
        "con_cargas.tipo_carga AS Tipo Material",
        "con_cargas.quantidade AS Quantidade",
        "con_cargas.quantidade_atual AS Quantidade Atual",
        "con_cargas.fk_lote_pai AS Lote Pai",
        "con_situacoes_cargas.descricao AS Situação",
        "con_cargas.unidade_medida AS UN",
        "con_cargas.responsavel_cadastro AS Responsável Cadastro",
        "con_cargas.canal_comunicacao AS Canal AS Comunicação",
        "con_cargas.observacao AS Observação",
        "con_situacoes_cargas.descricao AS Status",
        "con_situacoes_cargas.descricao AS Descrição Filial",
        "con_cargas.fk_filial AS Código Filial",
        "con_cargas.documento_transporte AS Documento de transporte",
        "con_cargas.placa_veiculo AS Placa",
        "con_cargas.placa_carreta AS Placa Carreta",
        "con_cargas.placa_veiculo AS Placa Bitrem",
        "con_cargas.codigo_motorista AS Código motorista",
        "CADASTRO_GERAL.CG_NOME as Nome motorista",
        "con_cargas.observacao_gr AS Observação do GR",
        database.raw(
          `to_char("con_cargas"."data_cadastro", 'dd/mm/yyyy') AS "Data Cadastro"`
        ),
        database.raw(
          `to_char("con_cargas"."data_atualizacao", 'dd/mm/yyyy') AS "Data Atualização"`
        ),
        database.raw(
          `CASE WHEN "con_cargas"."ativo" = 0 THEN 'DESATIVADO' WHEN "con_cargas"."ativo" = 1 THEN 'ATIVO' END AS "Ativo"`
        ),
        "observacao_exclusao AS Observação Exclusão",
        "observacao_cancelamento AS Observação Cancelamento",
      ])
      .join(
        "con_situacoes_cargas",
        "con_situacoes_cargas.id",
        "con_cargas.fk_situacao"
      )
      .leftJoin(
        "CADASTRO_GERAL",
        "CADASTRO_GERAL.CG_COD",
        "con_cargas.codigo_motorista"
      )
      .leftJoin("FILIAL", "FILIAL.FIL_COD", "con_cargas.fk_filial");
    if (data_inicio) {
      query.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') >= ?`, [
        data_inicio,
      ]);
    }
    if (data_final) {
      query.whereRaw(`to_char("data_cadastro", 'yyyy-mm-dd') <= ?`, [
        data_final,
      ]);
    }
    if (fk_filial) {
      query.where("fk_filial", fk_filial);
    }

    const searchResult = await query;

    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(searchResult);

    xlsx.utils.book_append_sheet(workbook, sheet);

    xlsx.writeFile(workbook, filename, {
      bookType: "xlsx",
      type: "binary",
    });
  }
}
