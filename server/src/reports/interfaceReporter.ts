type TtipoLevel = "error" | "warn" | "info" | "debug";

export interface IErrorDefault {
  message: string;
  nameFile: string;
  descricao?: string;
  level?: TtipoLevel;
  id?: string | number;
}

export interface IClassErroReports {
  run(body: IErrorDefault): Promise<string>;
}
