export default interface ILogConcentradorApp {
  id?: number;
  metodo?: string;
  status?: string;
  json_envio?: string;
  json_retorno?: string;
  erro?: number;
  created_at?: Date;
  cod_usu_create?: string;
  fk_filial?: string | number;
}
