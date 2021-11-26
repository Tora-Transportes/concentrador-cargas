export default interface IProduto {
  id?: number;
  nome: string;
  ativo: number;
  observacao?: string | null;
  usuario: string;
}
