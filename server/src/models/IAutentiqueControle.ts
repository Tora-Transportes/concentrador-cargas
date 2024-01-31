export default interface IAutentiqueControle {
  id_file: string;
  viewed: Date;
  signed: Date;
  file_link_original: string;
  file_link_signed: string;
  updated_at?: Date;
}
