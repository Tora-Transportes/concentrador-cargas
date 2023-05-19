import IEngate from "../../models/Engate";
import dataBase from "../../database";
import fs from "fs";

interface IEngateRepository {
  create(dados: Omit<IEngate, "ID">, path: string): Promise<void>;
  searchAll(): Promise<IEngate[]>;
  searchIndex(ID: number): Promise<IEngate>;
  update(dados: IEngate, ID: number): Promise<void>;
}

export class EngateRepository implements IEngateRepository {
  async create(dados: Omit<IEngate, "ID">, path: string): Promise<void> {
    await dataBase("con_engate").insert(dados);
    fs.unlinkSync(path);
  }

  async searchAll(): Promise<IEngate[]> {
    return await dataBase("con_engate").select("*").orderBy("ID", "DSC");
  }

  async searchIndex(ID: number): Promise<IEngate> {
    return await dataBase("con_engate").select("*").first().where({ ID });
  }

  async update(dados: IEngate, ID: number): Promise<void> {
    await dataBase("con_engate").update(dados).where({ ID });
  }
}
