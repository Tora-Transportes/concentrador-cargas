export default interface ICalculador {
  id: number;
  tipo: number;
  mes: string;
  ano: string;
  status: number;
  qtd_processada: number;
  qtd_final: number;
  observacao: string;
  created_at: Date;
  cod_usu_create: string;
  updated_at: Date;
  cod_usu_update: string;
}
