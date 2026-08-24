import { Request, Response } from "express";
import xlsx from "xlsx";
import os from "os";
import path from "path";
import fs from "fs";

import {
  IppaBlockedDrivers,
  IppaReport,
  PPARepository,
} from "../../repositories/PPA/PPARepository";

interface IPPAController {
  list_reports(req: Request, res: Response): Promise<Response>;

  export_reports(req: Request, res: Response): Promise<Response>;

  export_blocked_drivers(req: Request, res: Response): Promise<Response>;

  list_blocked_drivers(req: Request, res: Response): Promise<Response>;

  list_blocked_drivers_summary(req: Request, res: Response): Promise<Response>;
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
    const ppaRepository = new PPARepository();

    const reports = await ppaRepository.export_reports({
      ...req.query,
    });

    const excelRows = reports.map((report: IppaReport) => ({
      "Data de inclusão": report.data_inclusao
        ? new Date(report.data_inclusao)
        : null,

      Motorista: report.motorista.toUpperCase,
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
}

export default new PPAController();
