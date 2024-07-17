export default interface ICalculador {
  id: number;
  tipo: number;
  mes: string;
  ano: string;
  status: number;
  qtd_processada: number;
  qtd_final: number;
  tipo_reprocessamento: string;
  autentique_delete: number;
  clausula: string;
  observacao: string;
  created_at: Date;
  cod_usu_create: string;
  updated_at: Date;
  cod_usu_update: string;
}

export default interface IDTOCalculador {
  id: number;
  tipo: number;
  mes: string;
  ano: string;
  status: number;
  qtd_processada: number;
  qtd_final: number;
  tipo_reprocessamento: string;
  autentique_delete: number;
  cpfs: Cpf[] | string;
  grupos: Grupo[] | string;
  observacao: string;
  created_at: Date;
  cod_usu_create: string;
  updated_at: Date;
  cod_usu_update: string;
}

interface Cpf {
  value: string;
  label: string;
}

interface Grupo {
  value: number;
  label: string;
}
