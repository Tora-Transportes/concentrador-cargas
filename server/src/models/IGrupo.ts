export default interface IGrupo {
  id: number;
  nome: string;
  created_at: Date;
  cod_usu_create: string;
  updated_at: Date;
  cod_usu_update: string;
  pdf_data: Buffer;
}
