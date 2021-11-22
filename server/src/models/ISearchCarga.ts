export default interface ISearchCarga {
  page?: number;
  order_column?: string;
  order_direction?: string;

  id?: string;
  cliente?: string;
  data_coleta?: string;
  data_cadastro?: string;
  data_entrega?: string;
  e_lote?: number;
  tipo_carga?: string;
  responsavel_cadastro?: string;
}
