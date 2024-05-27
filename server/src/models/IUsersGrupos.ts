export default interface IUsersGrupos {
  users: Users;
  grupos: Grupo[];
}

export interface Users {
  value: string;
  label: string;
  email: string;
}

export interface Grupo {
  value: number;
  label: string;
}

export interface IGrupos {
  grupos: Grupo[];
}
