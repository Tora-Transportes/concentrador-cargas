import { Knex } from "knex";
import { mssqlPpa } from "../../database";
import { IPagination } from "../../Utils/IPaginattion";
import { isValidField } from "../../Utils/utlis";

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
}

export interface IppaBlockedDrivers {
	cpf: string;
	motorista: string;
	placa_veiculo: string;
	periodo_inicial: string;
	periodo_final: string;
	total_pontos: number;
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
			if (queryRecord?.data_inclusao) {
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
				qb.andWhere("motorista", "like", `%${queryRecord.motorista}%0`);
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
}
