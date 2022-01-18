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

    throw new Error("Invalid key");
  }

  async generate(
    key: string,
    { data_inicio, data_final, fk_filial }: IFilter,
    filename: string
  ) {
    const query = this.factory(key)
      .select([
        "con_cargas.*",
        "con_situacoes_cargas.descricao as situacao.descricao",
        "con_situacoes_cargas.cor as situacao.cor",
        "FILIAL.FIL_DSC as filial.descricao",
      ])
      .join(
        "con_situacoes_cargas",
        "con_situacoes_cargas.id",
        "con_cargas.fk_situacao"
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

    const columns = [
      { name: "id", description: "Código da carga", type: "string" },
      { name: "cliente", description: "Cliente", type: "string" },
      { name: "e_lote", description: "E Lote ?", type: "bool" },
      { name: "origem_carga", description: "Origem Carga", type: "string" },
      { name: "destino_carga", description: "Destino Carga", type: "string" },
      { name: "data_entrega", description: "Data Entrega", type: "date" },
      { name: "data_coleta", description: "Data Coleta", type: "date" },
      { name: "tipo_carga", description: "Tipo Material", type: "string" },
      { name: "quantidade", description: "Quantidade", type: "number" },
      {
        name: "quantidade_atual",
        description: "Quantidade Atual",
        type: "number",
      },
      {
        name: "fk_lote_pai",
        description: "Lote Pai",
        type: "string",
      },
      {
        name: "situacao.descricao",
        description: "Situação",
        type: "string",
      },
      { name: "unidade_medida", description: "UN", type: "string" },
      {
        name: "responsavel_cadastro",
        description: "Responsável Cadastro",
        type: "string",
      },
      {
        name: "canal_comunicacao",
        description: "Canal Comunicação",
        type: "string",
      },
      { name: "observacao", description: "Observação", type: "string" },
      { name: "situacao.descricao", description: "Status", type: "string" },
      {
        name: "filial.descricao",
        description: "Descrição Filial",
        type: "string",
      },
      { name: "fk_filial", description: "Código Filial", type: "number" },
      {
        name: "documento_transporte",
        description: "Documento de transporte",
        type: "string",
      },
      { name: "placa_veiculo", description: "Placa", type: "string" },
      {
        name: "observacao_gr",
        description: "Observação do GR",
        type: "string",
      },
      { name: "data_cadastro", description: "Data Cadastro", type: "date" },
      {
        name: "data_atualizacao",
        description: "Data Atualização",
        type: "date",
      },
      { name: "ativo", description: "Ativo", type: "string" },
    ];

    const searchResult = await query;

    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(
      searchResult.map((carga: Record<string, any>) => {
        const tmp: Record<string, any> = {};
        for (const i in carga) {
          const titulo = columns.find((j) => j.name === i)?.description;
          if (titulo) {
            tmp[titulo] = carga[i];
            if (i === "e_lote") {
              tmp[titulo] = carga[i] ? "SIM" : "NÃO";
            }
            if (i === "ativo") {
              tmp[titulo] = +carga[i] === 1 ? "ATIVO" : "DESATIVADO";
            }
            if (["data_coleta", "data_entrega"].includes(i)) {
              tmp[titulo] = carga[i]
                ?.toISOString()
                ?.split("T")[0]
                ?.split("-")
                .reverse()
                .join("/");
            }
          }
        }
        return tmp;
      })
    );

    xlsx.utils.book_append_sheet(workbook, sheet);

    xlsx.writeFile(workbook, filename, {
      bookType: "xlsx",
      type: "binary",
    });
  }
}
