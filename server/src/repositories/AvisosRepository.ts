//import database from "../database";
import IModelAvisos from "../models/Avisos";

interface IAvisosRepository{
    index(id: number): Promise<IModelAvisos> ;
    search(): Promise<IModelAvisos[]>;
    update(id: number, dataUpdate: IModelAvisos): Promise<IModelAvisos>;
    delete(id: number): Promise<string>;
};

export class AvisosRepository implements IAvisosRepository {
  async index(id: number): Promise<IModelAvisos> {
    console.log("Index >>>>>", id);

    return {
      id: 1,
      titulo: "Edição feita com sucesso",
      mensagem:
        "Se esta vendo esta mensagem é porque o update foi bem sucedido",
      data_cadastro: "03/10/2022",
      autor: "Moises.castro",
    };
  }

  async search(): Promise<IModelAvisos[]> {
    return [
      {
        id: 1,
        titulo: "Nova atualização do sistema",
        mensagem:
          "Na pagina de cadastro de carga foi implementado uma nova funcionalidade que vai auxiliar no cadastros das cargas, foi adicionado mais uma informação na opção de Detalhes do veiculo.",
        data_cadastro: "03/10/2022",
        autor: "Gabrielle.martins",
      },
      {
        id: 2,
        titulo: "Cache do sistema",
        mensagem:
          "Por favor limpe o cache da sua maquina para que as novas atualizações do concentrador esteja desponível para seu uso, Para limpar o cache clique na tecla Ctrl + F5, após o carregamento da pagina o sistemas sera atualizado.",
        data_cadastro: "03/10/2022",
        autor: "Moises.castro",
      },
    ];
  }

  async update(id: number, dataUpdate: IModelAvisos): Promise<IModelAvisos> {
    console.log("Update Avisos", id, { dataUpdate });

    return {
      id: 2,
      titulo: "Edição feita com sucesso",
      mensagem:
        "Se esta vendo esta mensagem é porque o update foi bem sucedido",
      data_cadastro: "03/10/2022",
      autor: "Moises.castro",
    };
  }

  async delete(id: number): Promise<string> {
    console.log("Delete>>>>", id);

    return "Aviso deletado com sucesso!";
  }
}
