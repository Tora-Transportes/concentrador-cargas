import database from "../database";
import { IServiceLogTime } from "../domain/UseCaseCarga/entities";

class ServiceLogTime implements IServiceLogTime {
  async create(obj: Record<string, any>): Promise<any> {
    return database("con_cargas_logs_aprovacao").insert(obj);
  }
}

export default new ServiceLogTime();
