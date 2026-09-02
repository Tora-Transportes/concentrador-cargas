import { Knex } from "knex";
import { mssqlPpa } from "../../database";
import { IPagination } from "../../Utils/IPaginattion";
import { isValidField } from "../../Utils/utlis";
import AppError from "../../models/AppError";

export interface IppaReport {
	data_inclusao: string | Date;
	motorista: string;
	cpf_motorista: string;
	placa_veiculo: string;
	area_producao: string;
	vel_aferida: number;
	vel_permitida: number;
	pontuacao: number;
	tipo_veiculo: string;
	placa_carreta: string;
	cidade_origem: string;
	cidade_destino: string;
	referencia_posicao: string;
}

export interface IppaBlockedDrivers {
	cpf: string;
	motorista: string;
	placa_veiculo: string;
	periodo_inicial: string;
	periodo_final: string;
	total_pontos: number;
}

export interface IppaBlockedDriversHistory {
	cpf: string;
	motorista: string;
	total_pontos: number;
	total_bloqueio: number;
}

interface IppaBlockedDriverRemovalSource {
	id: number;
	cpf: string;
	motorista: string;
	periodo_inicial: string | Date;
	periodo_final: string | Date;
	total_pontos: number | string;
}

interface IppaBlockedDriverHistory {
	id: number;
	total_pontos: number | string;
	total_bloqueio: number | string;
}

export interface IppaBlockedDriverRemovalResult {
	cpf: string;
	motorista: string;
	periodo_inicial: string | Date;
	periodo_final: string | Date;
	total_pontos_removidos: number;
	historico_total_pontos: number;
	historico_total_bloqueio: number;
	registros_report_removidos: number;
	registros_bloqueio_removidos: number;
}

interface IPPARepository {
	list_reports(
		query: Record<string, any>,
		page: number,
		pageSize: number
	): Promise<any | undefined>;

	export_reports(query: Record<string, any>): Promise<IppaReport[]>;

	list_blocked_drivers(
		query: Record<string, any>,
		page: number,
		pageSize: number
	): Promise<any | undefined>;

	export_blocked_drivers(
		query: Record<string, any>
	): Promise<IppaBlockedDrivers[]>;

	list_blocked_drivers_summary(
		query: Record<string, any>,
		page: number,
		pageSize: number
	): Promise<any | undefined>;

	export_blocked_drivers_history(
		query: Record<string, any>
	): Promise<IppaBlockedDriversHistory[]>;

	remove_blocked_driver_points(
		cpf: string,
		periodoInicial: string,
		periodoFinal: string,
		concentradorUserId: string
	): Promise<IppaBlockedDriverRemovalResult>;
}

export class PPARepository implements IPPARepository {
	async list_reports(
		queryRecord: Record<string, any>,
		page = 1,
		pageSize = 10
	): Promise<IPagination<IppaReport>> {
		const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

		const orderField = queryRecord?.order_column ?? "data_inclusao";
		const order = queryRecord?.order_direction ?? "desc";

		const realPageSize =
			isNaN(Number(pageSize)) || Number(pageSize) < 1 ? 10 : Number(pageSize);

		const filter = this.reportFilter(queryRecord);

		const totalQuery = mssqlPpa("report")
			.count<{ total: string | number }[]>("id as total")
			.modify(filter)
			.first();

		const resultsQuery = mssqlPpa("report")
			.select(this.reportSelect())
			.modify(filter)
			.orderBy(orderField, order)
			.limit(realPageSize)
			.offset((realPage - 1) * realPageSize);

		const totalResult = (await totalQuery) as
			| { total?: string | number }
			| undefined;

		const totalRegisters = Number(totalResult?.total) || 0;

		const results = (await resultsQuery) as IppaReport[];

		return {
			page: realPage,
			total_pages: Math.ceil(totalRegisters / realPageSize),
			total_registers: totalRegisters,
			results,
		};
	}

	async list_blocked_drivers(
		queryRecord: Record<string, any>,
		page = 1,
		pageSize = 10
	): Promise<IPagination<IppaBlockedDrivers>> {
		const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);
		const realPageSize =
			isNaN(Number(pageSize)) || Number(pageSize) < 1 ? 10 : Number(pageSize);

		const orderField = queryRecord?.order_column ?? "motorista";
		const order = queryRecord?.order_direction ?? "asc";
		const filter = this.blockedDriversFilter(queryRecord);

		const totalQuery = mssqlPpa("motoristas_pra_bloqueio")
			.count<{ total: string | number }[]>("id as total")
			.modify(filter)
			.first();

		const resultsQuery = mssqlPpa("motoristas_pra_bloqueio")
			.select(this.blockedDriversSelect())
			.modify(filter)
			.orderBy(orderField, order)
			.limit(realPageSize)
			.offset((realPage - 1) * realPageSize);

		const totalResult = (await totalQuery) as
			| { total?: string | number }
			| undefined;
		const totalRegisters = Number(totalResult?.total) || 0;

		const results = (await resultsQuery) as IppaBlockedDrivers[];

		return {
			page: realPage,
			total_pages: Math.ceil(totalRegisters / realPageSize),
			total_registers: totalRegisters,
			results,
		};
	}

	async export_blocked_drivers(
		queryRecord: Record<string, any>
	): Promise<IppaBlockedDrivers[]> {
		const orderField = queryRecord?.order_column ?? "motorista";
		const order = queryRecord?.order_direction ?? "asc";

		const results = await mssqlPpa("motoristas_pra_bloqueio")
			.select(this.blockedDriversSelect())
			.modify(this.blockedDriversFilter(queryRecord))
			.orderBy(orderField, order);

		return results as IppaBlockedDrivers[];
	}

	async export_reports(
		queryRecord: Record<string, any>
	): Promise<IppaReport[]> {
		const results = await mssqlPpa("report")
			.select(this.reportSelect())
			.modify(this.reportFilter(queryRecord))
			.orderBy("data_inclusao", "desc");

		return results as IppaReport[];
	}

	private reportFilter(queryRecord: Record<string, any>) {
		return (qb: Knex.QueryBuilder) => {
			const hasExportStartDate = isValidField(queryRecord?.date_execel_inicio);
			const hasExportEndDate = isValidField(queryRecord?.date_execel_fim);

			/*
			 * Na exportação do relatório PPA o usuário escolhe um intervalo de
			 * datas. O limite final é exclusivo no próximo dia para garantir que
			 * todas as horas/minutos/segundos da data final sejam consideradas.
			 *
			 * Ex.: 08/07 a 10/07 equivale a:
			 * data_inclusao >= 08/07 00:00:00
			 * data_inclusao <  11/07 00:00:00
			 */
			if (hasExportStartDate && hasExportEndDate) {
				qb.andWhereRaw(
					"data_inclusao >= CAST(? AS date) AND data_inclusao < DATEADD(day, 1, CAST(? AS date))",
					[queryRecord.date_execel_inicio, queryRecord.date_execel_fim]
				);
			} else if (queryRecord?.data_inclusao) {
				/* Mantém compatibilidade com chamadas antigas do endpoint de consulta. */
				qb.andWhereRaw("CAST(data_inclusao AS DATE) = ?", [
					queryRecord.data_inclusao,
				]);
			}

			if (isValidField(queryRecord?.motorista)) {
				qb.andWhere("motorista", "like", `%${queryRecord.motorista}%`);
			}

			if (isValidField(queryRecord?.cpf)) {
				qb.andWhere("cpf_motorista", "like", `%${queryRecord.cpf}%`);
			}

			if (isValidField(queryRecord?.placa_veiculo)) {
				qb.andWhere("placa_veiculo", "like", `%${queryRecord.placa_veiculo}%`);
			}

			if (isValidField(queryRecord?.area_producao)) {
				qb.andWhere("area_producao", "like", `%${queryRecord.area_producao}%`);
			}
		};
	}

	private reportSelect(): string[] {
		return [
			"data_inclusao",
			"motorista",
			"cpf_motorista",
			"placa_veiculo",
			"area_producao",
			"vel_aferida",
			"vel_permitida",
			"pontuacao",
			"tipo_veiculo",
			"placa_carreta",
			"cidade_origem",
			"cidade_destino",
			"referencia_posicao",
		];
	}
	private blockedDriversFilter(queryRecord: Record<string, any>) {
		return (qb: Knex.QueryBuilder) => {
			const hasPeriodoInicial = isValidField(queryRecord?.periodo_inicial);
			const hasPeriodoFinal = isValidField(queryRecord?.periodo_final);

			if (hasPeriodoInicial && hasPeriodoFinal) {
				qb.andWhereRaw(
					"CAST(periodo_inicial AS DATE) >= ? AND CAST(periodo_final AS DATE) <= ?",
					[queryRecord.periodo_inicial, queryRecord.periodo_final]
				);
			} else if (hasPeriodoInicial) {
				qb.andWhereRaw("CAST(periodo_inicial AS DATE) = ?", [
					queryRecord.periodo_inicial,
				]);
			} else if (hasPeriodoFinal) {
				qb.andWhereRaw("CAST(periodo_final AS DATE) = ?", [
					queryRecord.periodo_final,
				]);
			}

			if (isValidField(queryRecord?.motorista)) {
				qb.andWhere("motorista", "like", `%${queryRecord.motorista}%`);
			}

			if (isValidField(queryRecord?.cpf)) {
				qb.andWhere("cpf", "like", `%${queryRecord.cpf}%`);
			}

			if (isValidField(queryRecord?.placa_veiculo)) {
				qb.andWhere("placa_veiculo", "like", `%${queryRecord.placa_veiculo}%`);
			}
		};
	}

	private blockedDriversSelect(): string[] {
		return [
			"cpf",
			"motorista",
			"placa_veiculo",
			"periodo_inicial",
			"periodo_final",
			"total_pontos",
		];
	}

	async list_blocked_drivers_summary(
		queryRecord: Record<string, any>,
		page = 1,
		pageSize = 10
	): Promise<IPagination<IppaBlockedDriversHistory>> {
		const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

		const realPageSize =
			isNaN(Number(pageSize)) || Number(pageSize) < 1 ? 10 : Number(pageSize);

		const allowedOrderFields = [
			"cpf",
			"motorista",
			"total_pontos",
			"total_bloqueio",
		];

		const requestedOrderField = queryRecord?.order_column ?? "total_pontos";

		const orderField = allowedOrderFields.includes(requestedOrderField)
			? requestedOrderField
			: "total_pontos";

		const order = queryRecord?.order_direction === "asc" ? "asc" : "desc";

		const filter = this.blockedDriversHistoryFilter(queryRecord);

		/*
		 * O histórico já possui um único registro consolidado por CPF.
		 * Portanto, não há mais necessidade de GROUP BY, SUM ou COUNT
		 * sobre motoristas_pra_bloqueio.
		 */
		const totalQuery = mssqlPpa("motoristas_bloqueio_historico")
			.count<{ total: string | number }[]>("id as total")
			.modify(filter)
			.first();

		const resultsQuery = mssqlPpa("motoristas_bloqueio_historico")
			.select(["cpf", "motorista", "total_pontos", "total_bloqueio"])
			.modify(filter)
			.orderBy(orderField, order)
			.limit(realPageSize)
			.offset((realPage - 1) * realPageSize);

		const totalResult = (await totalQuery) as
			| { total?: string | number }
			| undefined;

		const totalRegisters = Number(totalResult?.total) || 0;
		const results = (await resultsQuery) as IppaBlockedDriversHistory[];

		return {
			page: realPage,
			total_pages: Math.ceil(totalRegisters / realPageSize),
			total_registers: totalRegisters,
			results,
		};
	}

	async export_blocked_drivers_history(
		queryRecord: Record<string, any>
	): Promise<IppaBlockedDriversHistory[]> {
		const allowedOrderFields = [
			"cpf",
			"motorista",
			"total_pontos",
			"total_bloqueio",
		];

		const requestedOrderField = queryRecord?.order_column ?? "total_pontos";
		const orderField = allowedOrderFields.includes(requestedOrderField)
			? requestedOrderField
			: "total_pontos";

		const order = queryRecord?.order_direction === "asc" ? "asc" : "desc";

		const results = await mssqlPpa("motoristas_bloqueio_historico")
			.select(["cpf", "motorista", "total_pontos", "total_bloqueio"])
			.modify(this.blockedDriversHistoryFilter(queryRecord))
			.orderBy(orderField, order);

		return results as IppaBlockedDriversHistory[];
	}

	private blockedDriversHistoryFilter(queryRecord: Record<string, any>) {
		return (qb: Knex.QueryBuilder) => {
			if (isValidField(queryRecord?.motorista)) {
				qb.andWhere("motorista", "like", `%${queryRecord.motorista}%`);
			}

			if (isValidField(queryRecord?.cpf)) {
				qb.andWhere("cpf", "like", `%${queryRecord.cpf}%`);
			}
		};
	}

	private normalizeDateTimeForSql(value: string, fieldName: string): string {
		const normalized = String(value || "")
			.trim()
			.replace(" ", "T")
			.replace(/Z$/i, "")
			.replace(/([+-]\d{2}:\d{2})$/, "");

		if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,7})?$/.test(normalized)) {
			throw new AppError(`${fieldName} inválido.`, 400);
		}

		return normalized;
	}

	async remove_blocked_driver_points(
		cpf: string,
		periodoInicial: string,
		periodoFinal: string,
		concentradorUserId: string
	): Promise<IppaBlockedDriverRemovalResult> {
		const periodoInicialSql = this.normalizeDateTimeForSql(
			periodoInicial,
			"Período inicial"
		);
		const periodoFinalSql = this.normalizeDateTimeForSql(
			periodoFinal,
			"Período final"
		);

		if (periodoInicialSql > periodoFinalSql) {
			throw new AppError(
				"O período inicial não pode ser maior que o período final.",
				400
			);
		}

		return mssqlPpa.transaction(async (trx) => {
			/*
			 * Localiza EXATAMENTE a linha selecionada em Motoristas para bloqueio.
			 * O CPF sozinho não é suficiente porque o mesmo motorista pode possuir
			 * vários bloqueios em períodos diferentes.
			 */
			const blockedDriver = (await trx("motoristas_pra_bloqueio")
				.select([
					"id",
					"cpf",
					"motorista",
					"periodo_inicial",
					"periodo_final",
					"total_pontos",
				])
				.where("cpf", cpf)
				.andWhereRaw("periodo_inicial = CAST(? AS datetime2)", [
					periodoInicialSql,
				])
				.andWhereRaw("periodo_final = CAST(? AS datetime2)", [periodoFinalSql])
				.first()) as IppaBlockedDriverRemovalSource | undefined;

			if (!blockedDriver) {
				throw new AppError(
					"Registro de bloqueio não encontrado para o CPF e período informados.",
					404
				);
			}

			const totalPontosRemovidos = Number(blockedDriver.total_pontos || 0);

			/*
			 * O histórico possui apenas um registro consolidado por CPF.
			 * Se já existir, somamos os pontos desta linha e incrementamos em 1
			 * a quantidade de bloqueios removidos.
			 */
			const history = (await trx("motoristas_bloqueio_historico")
				.select(["id", "total_pontos", "total_bloqueio"])
				.where("cpf", cpf)
				.first()) as IppaBlockedDriverHistory | undefined;

			let historicoTotalPontos: number;
			let historicoTotalBloqueio: number;

			if (history) {
				historicoTotalPontos =
					Number(history.total_pontos || 0) + totalPontosRemovidos;
				historicoTotalBloqueio = Number(history.total_bloqueio || 0) + 1;

				await trx("motoristas_bloqueio_historico")
					.where("id", history.id)
					.update({
						motorista: blockedDriver.motorista,
						total_pontos: historicoTotalPontos,
						total_bloqueio: historicoTotalBloqueio,
						concentrador_user_id: concentradorUserId,
					});
			} else {
				historicoTotalPontos = totalPontosRemovidos;
				historicoTotalBloqueio = 1;

				await trx("motoristas_bloqueio_historico").insert({
					cpf: blockedDriver.cpf,
					motorista: blockedDriver.motorista,
					total_pontos: historicoTotalPontos,
					total_bloqueio: historicoTotalBloqueio,
					concentrador_user_id: concentradorUserId,
				});
			}

			/*
			 * Remove somente as pontuações deste CPF que pertencem ao intervalo
			 * EXATO do bloqueio selecionado, incluindo hora/minuto/segundo.
			 * O BETWEEN do SQL Server é inclusivo nas duas extremidades.
			 */
			const registrosReportRemovidos = await trx("report")
				.where("cpf_motorista", cpf)
				.andWhereRaw(
					"data_inclusao BETWEEN CAST(? AS datetime2) AND CAST(? AS datetime2)",
					[periodoInicialSql, periodoFinalSql]
				)
				.del();

			if (Number(registrosReportRemovidos) === 0) {
				throw new AppError(
					"Nenhuma pontuação foi encontrada na tabela report para o CPF e período informados.",
					404
				);
			}

			/*
			 * Remove somente a linha de motoristas_pra_bloqueio que originou
			 * esta ação. Usamos o ID recuperado pela combinação CPF + períodos
			 * para não atingir outro bloqueio do mesmo motorista.
			 */
			const registrosBloqueioRemovidos = await trx("motoristas_pra_bloqueio")
				.where("id", blockedDriver.id)
				.del();

			return {
				cpf: blockedDriver.cpf,
				motorista: blockedDriver.motorista,
				periodo_inicial: blockedDriver.periodo_inicial,
				periodo_final: blockedDriver.periodo_final,
				total_pontos_removidos: totalPontosRemovidos,
				historico_total_pontos: historicoTotalPontos,
				historico_total_bloqueio: historicoTotalBloqueio,
				registros_report_removidos: Number(registrosReportRemovidos) || 0,
				registros_bloqueio_removidos: Number(registrosBloqueioRemovidos) || 0,
			};
		});
	}
}
