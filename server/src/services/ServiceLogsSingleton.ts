import database from "../database";
import jwt_decode from "jwt-decode";

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
    const timestamp = new Date().getTime();
    await database("con_logs").insert({ ...message, timestamp, oid });
  }
}

export default new ServiceLogsSingleton();
