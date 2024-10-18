import { mssqlProtheus } from "../../database";
import AppError from "../../models/AppError";

interface ISqedRepository {
  index(limit: number, status: number): Promise<any>;
  update(users: string[]): Promise<void>;
  delete(users: string[]): Promise<void>;
}

export class SqedRepository implements ISqedRepository {
  async index(limit: number, status: number): Promise<any> {
    try {
      const integrationUsers = await mssqlProtheus
        .select("*")
        .from("ZK010")
        .where("Z0K_INTEGR", status)
        .limit(limit);

      return integrationUsers;
    } catch (error) {
      console.error(error);
      throw new AppError(String(error), 500);
    }
  }

  async update(users: string[]): Promise<void> {
    try {
      await mssqlProtheus("ZK010")
        .whereIn("Z0K_CPF", users)
        .update({ Z0K_INTEGR: 4 });
    } catch (error) {
      console.error(error);
      throw new AppError(String(error), 500);
    }
  }

  async delete(users: string[]): Promise<void> {
    try {
      await mssqlProtheus("ZK010").whereIn("Z0K_CPF", users).del();
    } catch (error) {
      console.error(error);
      throw new AppError(String(error), 500);
    }
  }
}
