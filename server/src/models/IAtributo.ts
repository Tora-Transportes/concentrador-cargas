export default interface IAtributo {
  tabela: string;
  colunas: IAtributoItem[];
}

interface IAtributoItem {
  coluna: string;
}
