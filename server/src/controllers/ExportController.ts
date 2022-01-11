import { Request, Response } from "express";
import xlsx from "xlsx";
import fs from "fs";
import os from "os";
import path from "path";
import {
  CargaRepository,
  IPaginationResult,
} from "../repositories/CargaRepository";
import { ICarga } from "../models/ICargas";

class ExportController {
  async generateReportFromCargasInScreen(req: Request, res: Response) {
    const filename = path.resolve(
      os.tmpdir(),
      `RELATORIO_CARGAS-${new Date().getTime()}.xlsx`
    );

    const searchResult: IPaginationResult<ICarga> =
      await new CargaRepository().search(
        { ...req.query, ativo: 1 },
        1,
        1200000
      );

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
    ];

    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(
      searchResult.results.map((carga: Record<string, any>) => {
        const tmp: Record<string, any> = {};
        for (const i in carga) {
          const titulo = columns.find((j) => j.name === i)?.description;
          if (titulo) {
            tmp[titulo] = carga[i];
            if (i === "e_lote") {
              tmp[titulo] = carga[i] ? "SIM" : "NÃO";
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

    const stream = fs.createReadStream(filename);
    stream.pipe(res);
    fs.unlinkSync(filename);
    return res;
  }
}

export default new ExportController();
