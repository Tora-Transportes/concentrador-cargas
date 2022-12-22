import database from "../database";
import jwt_decode from "jwt-decode";
import DateUtils from "../Utils/date";

export interface IMessageLog {
  token: string;
  url: string;
  corpo: string;
  metodo: string;
}

interface IOidProp {
  oid: string;
}

class ServiceLogsSingleton {
  async write(message: IMessageLog) {
    let oid;
    try {
      oid = jwt_decode<IOidProp>(message.token).oid;
    } catch (error) {
      oid = null;
    }
    const url = message.url;
    const statusCsn = url.indexOf("/csn/") != -1;

    const timestamp = DateUtils.getCurrentDate().getTime();
    if (!statusCsn) {
      await database("con_logs").insert({ ...message, timestamp, oid });
    } else {
      await database("con_logs_csn").insert({ ...message, timestamp, oid });
    }
  }
}

export default new ServiceLogsSingleton();
