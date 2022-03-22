import { Request, Response } from "express";
import AppError from "../models/AppError";
import fs from "fs";
import path from "path";
import { notifyAll } from "../socketsRoutes";

export interface ICredential {
  user: string;
  portal: string;
  password: string | null;
  successfulAttempts: number;
  errored: boolean;
}

export interface ICredentialStorage {
  list(): Promise<ICredential[]>;
  save(credentials: ICredential[]): Promise<void>;
}

class Credenciais implements ICredentialStorage {
  static instance: Credenciais;
  static instanciate() {
    if (!Credenciais.instance) {
      Credenciais.instance = new Credenciais();
    }
    return Credenciais.instance;
  }

  private filename = "";
  private constructor() {
    this.filename = path.join(__dirname, "..", "..", "credenciais.json");
  }

  async list(): Promise<ICredential[]> {
    if (fs.existsSync(this.filename)) {
      return JSON.parse(fs.readFileSync(this.filename).toString());
    }
    return [];
  }
  async save(credentials: ICredential[]): Promise<void> {
    fs.writeFileSync(this.filename, JSON.stringify(credentials));
  }
}

class CredenciaisController {
  async get(request: Request, response: Response) {
    const authParams = String(request.headers.authorization).split("TOKEN ");
    const canSeePassword =
      authParams.length >= 2 && authParams[1] === process.env.API_KEY_BOT;
    const domain = Credenciais.instanciate();
    return response.json(
      (await domain.list()).map((i) => ({
        ...i,
        password: canSeePassword ? i.password : null,
      }))
    );
  }
  async post(request: Request, response: Response) {
    const { user, password, portal } = request.body;
    if (!user || !password || !portal) {
      throw new AppError(
        "Dados invalidos para cadastrar a credencial do portal",
        400
      );
    }
    const domain = Credenciais.instanciate();
    const credentials = await domain.list();
    for (const i of credentials) {
      if (i.portal === portal && i.user === user) {
        throw new AppError(
          "Essa credencial ja foi cadastrada, caso necessario atualize a mesma",
          400
        );
      }
    }
    const credential: ICredential = {
      user,
      portal,
      password,
      successfulAttempts: 0,
      errored: false,
    };
    credentials.push(credential);
    await domain.save(credentials);
    console.log("ENVIANDO EVENTO");
    notifyAll({
      name: "@credenciais-create",
      details: [{ ...credential, password: null }],
    });
    return response.send();
  }
  async put(request: Request, response: Response) {
    const { password, successfulAttempts, errored } = request.body;
    const { user, portal } = request.params;
    if (!user || !password || !portal) {
      throw new AppError("informações incompletas", 400);
    }

    const domain = Credenciais.instanciate();
    const credentials = await domain.list();

    for (const i of credentials) {
      if (i.user === user && i.portal === portal) {
        i.password = password;
        i.errored = errored === undefined ? i.errored : errored;
        i.successfulAttempts =
          successfulAttempts === undefined
            ? i.successfulAttempts
            : successfulAttempts;
        notifyAll({
          name: "@credenciais-update",
          details: [{ ...i, password: null }],
        });
        await domain.save(credentials);
        return response.send();
      }
    }

    throw new AppError(
      "Não foi possivel encontrar o usuario especificado",
      400
    );
  }

  async index(request: Request, response: Response) {
    const { user, portal } = request.params;
    if (!user || !portal) {
      throw new AppError("informações incompletas", 400);
    }
    const authParams = String(request.headers.authorization).split("TOKEN ");
    const canSeePassword =
      authParams.length >= 2 && authParams[1] === process.env.API_KEY_BOT;

    if (!canSeePassword) {
      throw new AppError("API_KEY_TOKEN incorreto", 401);
    }
    const domain = Credenciais.instanciate();
    const credentials = await domain.list();

    for (const i of credentials) {
      if (i.user === user && i.portal === portal) {
        return response.json(i);
      }
    }

    throw new AppError(
      "Não foi possivel encontrar o usuario especificado",
      400
    );
  }
  async delete(request: Request, response: Response) {
    const { user, portal } = request.params;
    if (!user || !portal) {
      throw new AppError("informações incompletas", 400);
    }
    const domain = Credenciais.instanciate();
    const credentials = (await domain.list()).filter(
      (i) => !(i.portal === portal && i.user === user)
    );
    notifyAll({
      name: "@credenciais-delete",
      details: [{ user, portal }],
    });
    await domain.save(credentials);
    response.send();
  }
}

export default new CredenciaisController();
