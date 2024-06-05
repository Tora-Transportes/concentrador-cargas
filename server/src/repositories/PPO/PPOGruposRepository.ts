import { mssqlPPO, mssqlPPOView } from "../../database";
import IGrupo from "../../models/IGrupo";
import AppError from "../../models/AppError";
import TokenAd from "../../models/TokenAd";
import { dateAtualMoment } from "../../Utils/formatData";
import { compareValues } from "../../Utils/utlis";
import fs from "fs";

interface IPPOGruposRepository {
  findByName(nome: string): Promise<IGrupo | undefined>;
  create(grupo: IGrupo, fileBuffer: any, user: string): Promise<any>;
  update(
    id: number,
    grupo: IGrupo,
    existeFile: boolean,
    fileBuffer: any,
    user: string
  ): Promise<any>;
  index(id: string): Promise<IGrupo | undefined>;
  search(filter: Record<string, any>): Promise<any[]>;
  delete(id: number): Promise<void>;
  termos(filtro: Record<string, any>): Promise<any>;
}

export class PPOGruposRepository implements IPPOGruposRepository {
  async index(id: string): Promise<IGrupo | undefined> {
    return await mssqlPPO("dbo.ppo_grupos").first().where("id", id);
  }

  async create(grupo: IGrupo, fileBuffer: any, user: string) {
    const gp = await this.findByName(grupo.nome);
    grupo.cod_usu_create = TokenAd.getClaims(user).name;
    grupo.pdf_data = fileBuffer;
    if (gp != undefined) {
      throw new AppError("Esse nome já se encontra em uso", 400);
    } else {
      return mssqlPPO("dbo.ppo_grupos").insert(grupo);
    }
  }

  async update(
    id: number,
    grupo: IGrupo,
    existeFile: boolean,
    fileBuffer: any,
    user: string
  ) {
    const gp = await this.findByName(grupo.nome);
    grupo.cod_usu_update = TokenAd.getClaims(user).name;
    grupo.updated_at = new Date(dateAtualMoment());
    if (existeFile) grupo.pdf_data = fileBuffer;
    if (gp != undefined && gp.id != id) {
      throw new AppError("Esse nome já se encontra em uso", 400);
    } else {
      return mssqlPPO("dbo.ppo_grupos").update(grupo).where("id", id);
    }
  }

  async delete(id: number): Promise<void> {
    const params = await mssqlPPO("dbo.ppo_parametros_grupo")
      .count("* as qtd_parms")
      .where("grupo_id", id);
    if (compareValues(params[0].qtd_parms, 0)) {
      throw new AppError(
        "Não foi possivel deletar esse grupo pois possuem parâmetros atrelados a ele",
        400
      );
    } else {
      await mssqlPPO("dbo.ppo_grupos").delete().where({ id });
    }
  }

  async findByName(nome: string): Promise<IGrupo | undefined> {
    return mssqlPPO("dbo.ppo_grupos").select("*").where("nome", nome).first();
  }

  async search(filter: Record<string, any>) {
    const query = mssqlPPO("dbo.ppo_grupos").select("*").orderBy("nome", "asc");
    for (const i in filter) {
      if (filter[i] !== undefined && filter[i] !== null) {
        query.where(i, filter[i]);
      }
    }
    const results = await query;

    const resultsWithBase64 = results.map((row) => {
      if (row["pdf_data"] instanceof Buffer) {
        row["pdf_data"] = row["pdf_data"].toString("base64");
      }
      return row;
    });

    return resultsWithBase64;
  }
  async termos(filtro: Record<string, any>) {
    let cpf = undefined;
    for (const i in filtro) {
      if (i == "cpf") {
        cpf = filtro[i];
      }
    }
    if (cpf.length == 11) {
      const numericCPF = cpf.replace(/\D/g, "");
      const formattedCPF = numericCPF.replace(
        /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
        "$1.$2.$3-$4"
      );
      cpf = formattedCPF;
    }

    if (cpf == undefined) {
      throw new AppError("query string (cpf) requerida!", 400);
    }
    const filial =
      await mssqlPPOView.raw(`SELECT M0_FILIAL as filial FROM dbo.VW_DADO_MOTORISTA_PPO
       WHERE RA_CIC LIKE '%${cpf}%'`);

    if (filial.length == 0) {
      throw new AppError("Motorista não existe ou cpf errado", 400);
    }

    const query = await mssqlPPO("dbo.ppo_grupos")
      .select(["id", "pdf_data"])
      .where("filial", filial[0]["filial"]);

    const resultsWithBase64 = query.map((row) => {
      if (row["pdf_data"] instanceof Buffer) {
        row["pdf_data"] = row["pdf_data"].toString("base64");
      }
      return row;
    });

    if (query.length == 0) {
      throw new AppError("filial não existe ou foi cadastrada errada", 400);
    }

    if (resultsWithBase64[0]["pdf_data"] == null) {
      throw new AppError("Termo não cadastrado no grupo da filial", 400);
    }

    const pdfBuffer = Buffer.from(resultsWithBase64[0]["pdf_data"], "base64");
    await fs.promises.writeFile(
      `static/termo${resultsWithBase64[0]["id"]}.pdf`,
      pdfBuffer
    );

    return {
      link: `static/termo${resultsWithBase64[0]["id"]}.pdf`,
    };
  }
}
