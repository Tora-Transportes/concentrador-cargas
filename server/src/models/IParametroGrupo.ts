export default interface IParametroGrupo {
  id: number;
  grupo_id: number;
  parametro_id: number;
  parametro_nome: string;
  operador_logico_primario: string;
  valor_primario: string;
  operador_logico_secundaria: string;
  valor_secundario: string;
  premio: number;
  tabela: string;
  campo: string;
  faixa_valores: number;
  ativo: number;
  created_at: Date;
  cod_usu_create: string;
  updated_at: Date;
  cod_usu_update: string;
}
