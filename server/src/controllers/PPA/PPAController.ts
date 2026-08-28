import { Request, Response } from "express";
import xlsx from "xlsx";
import os from "os";
import path from "path";
import fs from "fs";

import {
  IppaBlockedDrivers,
  IppaBlockedDriversHistory,
  IppaReport,
  PPARepository,
} from "../../repositories/PPA/PPARepository";
import AppError from "../../models/AppError";

const normalizeExportDate = (value: unknown, fieldName: string): string => {
  const normalized = String(value ?? "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new AppError(`${fieldName} deve estar no formato YYYY-MM-DD.`, 400);
  }

  const [year, month, day] = normalized.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new AppError(`${fieldName} inválida.`, 400);
  }

  return normalized;
};

interface IPPAController {
  list_reports(req: Request, res: Response): Promise<Response>;

  export_reports(req: Request, res: Response): Promise<Response>;

  export_blocked_drivers(req: Request, res: Response): Promise<Response>;

  list_blocked_drivers(req: Request, res: Response): Promise<Response>;

  list_blocked_drivers_summary(req: Request, res: Response): Promise<Response>;

  export_blocked_drivers_history(
    req: Request,
    res: Response
  ): Promise<Response>;

  remove_blocked_driver_points(req: Request, res: Response): Promise<Response>;
}

class PPAController implements IPPAController {
  async list_reports(req: Request, res: Response): Promise<Response> {
    const ppaRepository = new PPARepository();

    const result = await ppaRepository.list_reports(
      { ...req.query },
      Number(req.query.page),
      Number(req.query.limit) || 10
    );

    return res.json({
      data: result,
    });
  }

  async export_reports(req: Request, res: Response): Promise<Response> {
    const rawDateExcelInicio = String(
      req.query.date_execel_inicio ?? ""
    ).trim();
    const rawDateExcelFim = String(req.query.date_execel_fim ?? "").trim();

    const hasDateExcelInicio = rawDateExcelInicio.length > 0;
    const hasDateExcelFim = rawDateExcelFim.length > 0;

    /*
     * O período da exportação é opcional.
     * Porém, se o usuário informar uma das datas, as duas passam a ser
     * obrigatórias para que o intervalo fique bem definido.
     */
    if (hasDateExcelInicio !== hasDateExcelFim) {
      throw new AppError(
        "Para filtrar por período, informe a data inicial e a data final.",
        400
      );
    }

    let dateExcelInicio: string | undefined;
    let dateExcelFim: string | undefined;

    if (hasDateExcelInicio && hasDateExcelFim) {
      dateExcelInicio = normalizeExportDate(rawDateExcelInicio, "Data inicial");
      dateExcelFim = normalizeExportDate(rawDateExcelFim, "Data final");

      if (dateExcelInicio > dateExcelFim) {
        throw new AppError(
          "A data inicial não pode ser maior que a data final.",
          400
        );
      }
    }

    const ppaRepository = new PPARepository();
    const exportQuery: Record<string, any> = { ...req.query };

    if (dateExcelInicio && dateExcelFim) {
      exportQuery.date_execel_inicio = dateExcelInicio;
      exportQuery.date_execel_fim = dateExcelFim;
    } else {
      delete exportQuery.date_execel_inicio;
      delete exportQuery.date_execel_fim;
    }

    const reports = await ppaRepository.export_reports(exportQuery);

    const excelRows = reports.map((report: IppaReport) => ({
      "Data de inclusão": report.data_inclusao
        ? new Date(report.data_inclusao)
        : null,

      Motorista: report.motorista ? report.motorista.toUpperCase() : "",
      CPF: report.cpf_motorista,
      "Placa do veículo": report.placa_veiculo,
      "Área de produção": report.area_producao,
      "Velocidade aferida": report.vel_aferida,
      "Velocidade permitida": report.vel_permitida,
      Pontuacao: report.pontuacao,
      "Tipo de veículo": report.tipo_veiculo,
      "Placa da carreta": report.placa_carreta,
      "Cidade de origem": report.cidade_origem,
      "Cidade de destino": report.cidade_destino,
    }));

    const fileName = `RELATORIO_PPA-${Date.now()}.xlsx`;

    const filePath = path.resolve(os.tmpdir(), fileName);

    const workbook = xlsx.utils.book_new();

    const sheet = xlsx.utils.json_to_sheet(excelRows, {
      cellDates: true,
      dateNF: "DD/MM/YYYY HH:mm:ss",
    });

    xlsx.utils.book_append_sheet(workbook, sheet, "Relatório PPA");

    xlsx.writeFile(workbook, filePath, {
      bookType: "xlsx",
      type: "binary",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    const stream = fs.createReadStream(filePath);

    const removeTemporaryFile = () => {
      if (!fs.existsSync(filePath)) {
        return;
      }

      fs.unlink(filePath, (error) => {
        if (error) {
          console.error("Erro ao excluir o Excel temporário:", error);
        }
      });
    };

    stream.once("close", removeTemporaryFile);
    stream.once("error", removeTemporaryFile);

    stream.pipe(res);

    return res;
  }

  async export_blocked_drivers(req: Request, res: Response): Promise<Response> {
    const ppaRepository = new PPARepository();

    const blockedDrivers = await ppaRepository.export_blocked_drivers({
      ...req.query,
    });

    const excelRows = blockedDrivers.map((driver: IppaBlockedDrivers) => ({
      CPF: driver.cpf,
      Motorista: driver.motorista.toUpperCase(),
      "Placa do veículo": driver.placa_veiculo,
      "Período inicial": driver.periodo_inicial
        ? new Date(driver.periodo_inicial)
        : null,
      "Período final": driver.periodo_final
        ? new Date(driver.periodo_final)
        : null,
      "Total de pontos": driver.total_pontos,
    }));

    const fileName = `MOTORISTAS_PARA_BLOQUEIO-${Date.now()}.xlsx`;
    const filePath = path.resolve(os.tmpdir(), fileName);
    const workbook = xlsx.utils.book_new();

    const sheet = xlsx.utils.json_to_sheet(excelRows, {
      cellDates: true,
      dateNF: "DD/MM/YYYY HH:mm:ss",
    });

    xlsx.utils.book_append_sheet(workbook, sheet, "Motoristas para bloqueio");

    xlsx.writeFile(workbook, filePath, {
      bookType: "xlsx",
      type: "binary",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    const stream = fs.createReadStream(filePath);

    const removeTemporaryFile = () => {
      if (!fs.existsSync(filePath)) {
        return;
      }

      fs.unlink(filePath, (error) => {
        if (error) {
          console.error("Erro ao excluir o Excel temporário:", error);
        }
      });
    };

    stream.once("close", removeTemporaryFile);
    stream.once("error", removeTemporaryFile);
    stream.pipe(res);

    return res;
  }

  async export_blocked_drivers_history(
    req: Request,
    res: Response
  ): Promise<Response> {
    const ppaRepository = new PPARepository();

    const history = await ppaRepository.export_blocked_drivers_history({
      ...req.query,
    });

    const excelRows = history.map((driver: IppaBlockedDriversHistory) => ({
      CPF: driver.cpf,
      Motorista: String(driver.motorista ?? "").toUpperCase(),
      "Total de pontos removidos": driver.total_pontos,
      "Total de bloqueios removidos": driver.total_bloqueio,
    }));

    const fileName = `HISTORICO_BLOQUEIOS_PPA-${Date.now()}.xlsx`;
    const filePath = path.resolve(os.tmpdir(), fileName);
    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(excelRows);

    xlsx.utils.book_append_sheet(workbook, sheet, "Histórico de bloqueios");

    xlsx.writeFile(workbook, filePath, {
      bookType: "xlsx",
      type: "binary",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    const stream = fs.createReadStream(filePath);

    const removeTemporaryFile = () => {
      if (!fs.existsSync(filePath)) {
        return;
      }

      fs.unlink(filePath, (error) => {
        if (error) {
          console.error("Erro ao excluir o Excel temporário:", error);
        }
      });
    };

    stream.once("close", removeTemporaryFile);
    stream.once("error", removeTemporaryFile);
    stream.pipe(res);

    return res;
  }

  async list_blocked_drivers(req: Request, res: Response): Promise<Response> {
    const ppaRepository = new PPARepository();

    const result = await ppaRepository.list_blocked_drivers(
      { ...req.query },
      Number(req.query.page),
      Number(req.query.limit) || 10
    );

    return res.json({
      data: result,
    });
  }

  async list_blocked_drivers_summary(
    req: Request,
    res: Response
  ): Promise<Response> {
    const ppaRepository = new PPARepository();

    const result = await ppaRepository.list_blocked_drivers_summary(
      { ...req.query },
      Number(req.query.page),
      Number(req.query.limit) || 10
    );

    return res.json({
      data: result,
    });
  }

  async remove_blocked_driver_points(
    req: Request,
    res: Response
  ): Promise<Response> {
    const cpf = String(req.params.cpf || "").trim();

    const { periodo_inicial, periodo_final, concentrador_user_id } =
      req.body ?? {};

    if (!cpf) {
      throw new AppError("CPF do motorista não informado.", 400);
    }

    if (!periodo_inicial || !periodo_final) {
      throw new AppError(
        "Período inicial e período final são obrigatórios para remover a pontuação.",
        400
      );
    }

    if (!concentrador_user_id) {
      throw new AppError(
        "Identificador do usuário do Concentrador não informado.",
        400
      );
    }

    const ppaRepository = new PPARepository();

    const result = await ppaRepository.remove_blocked_driver_points(
      cpf,
      String(periodo_inicial),
      String(periodo_final),
      String(concentrador_user_id)
    );

    return res.json({
      data: result,
    });
  }
}

export default new PPAController();
