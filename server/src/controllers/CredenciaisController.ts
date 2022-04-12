import { Request, Response } from "express";
import AppError from "../models/AppError";
import fs from "fs";
import database from "../database";
import { notifyAll } from "../socketsRoutes";
import Encrypt from "../services/Encrypt";

export interface ICredential {
  user: string;
  portal: string;
  password: string | null;
  successful_attempts: number;
  errored: boolean;
}

export interface ICredentialStorage {
  list(): Promise<ICredential[]>;
  index(portal: string, user: string): Promise<ICredential | null>;
  update(credencial: ICredential): Promise<void>;
  delete(portal: string, user: string): Promise<void>;
  save(credentials: ICredential): Promise<void>;
}

class Credenciais implements ICredentialStorage {
  async index(portal: string, user: string): Promise<ICredential | null> {
    return (
      (await database("con_credenciais")
        .select("*")
        .first()
        .where("portal", portal)
        .where("user", user)) ?? null
    );
  }
  async update(credencial: ICredential): Promise<void> {
    const { portal, user } = credencial;
    await database("con_credenciais")
      .update(credencial)
      .where("portal", portal)
      .where("user", user);
    return;
  }
  async delete(portal: string, user: string): Promise<void> {
    await database("con_credenciais")
      .delete()
      .where("portal", portal)
      .where("user", user);
    return;
  }
  static instance: Credenciais;
  static instanciate() {
    if (!Credenciais.instance) {
      Credenciais.instance = new Credenciais();
    }
    return Credenciais.instance;
  }

  async list(): Promise<ICredential[]> {
    return database("con_credenciais").select("*");
  }
  async save(credentials: ICredential): Promise<void> {
    return await database("con_credenciais").insert(credentials);
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
        password: !canSeePassword
          ? null
          : i.password
          ? Encrypt.decrypt(String(i.password))
          : null,
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
    if ((await domain.index(portal, user)) !== null) {
      throw new AppError("Esta credencial ja existe", 400);
    }
    const credential: ICredential = {
      user,
      portal,
      password: Encrypt.encrypt(String(password)),
      successful_attempts: 0,
      errored: false,
    };
    await domain.save(credential);
    console.log("ENVIANDO EVENTO");
    notifyAll({
      name: "@credenciais-create",
      details: [{ ...credential, password: null }],
    });
    return response.send();
  }
  async put(request: Request, response: Response) {
    const { password, successful_attempts, errored } = request.body;
    const { user, portal } = request.params;
    if (!user || !password || !portal) {
      throw new AppError("informações incompletas", 400);
    }

    const domain = Credenciais.instanciate();
    const credential = await domain.index(portal, user);

    if (!credential) {
      throw new AppError("A credencial informada não existe", 404);
    }

    credential.password = Encrypt.encrypt(String(password));
    credential.errored = errored === undefined ? credential.errored : errored;
    credential.successful_attempts =
      successful_attempts === undefined
        ? credential.successful_attempts
        : successful_attempts;
    notifyAll({
      name: "@credenciais-update",
      details: [{ ...credential, password: null }],
    });
    await domain.update(credential);
    return response.send();
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
    const credential = await domain.index(portal, user);

    if (credential) {
      return response.json({
        ...credential,
        password: Encrypt.decrypt(String(credential.password)),
      });
    }

    throw new AppError(
      "Não foi possivel encontrar o usuario especificado",
      404
    );
  }
  async delete(request: Request, response: Response) {
    const { user, portal } = request.params;
    if (!user || !portal) {
      throw new AppError("informações incompletas", 400);
    }
    const domain = Credenciais.instanciate();
    await domain.delete(portal, user);
    notifyAll({
      name: "@credenciais-delete",
      details: [{ user, portal }],
    });
    response.send();
  }
}

export default new CredenciaisController();
