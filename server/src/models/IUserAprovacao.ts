export default interface IUsersAprovacao {
  users: IUsers;
  permissao: IPermissao;
}

export interface IUsers {
  value: string;
  label: string;
  email: string;
}

export interface IPermissao {
  value: number;
  label: string;
}
