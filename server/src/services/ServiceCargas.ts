import { ICarga } from "../models/ICargas";

export class ServiceCargas {
  cargas: ICarga[] = [];
  async insert(carga: ICarga) {
    // aqui eu preciso inserir no banco de dados
    return carga.id;
  }

  async update(carga: ICarga) {
    // aqui eu preciso inserir no banco de dados, deve ignorar os registros deletados
    return carga;
  }

  async delete(cargaId: string) {
    // marco o campo no banco de dados como excluido
  }

  async index(cargaId: string) {
    // realiza a consulta do banco, deve ignorar os registros deletados
    const carga: ICarga = {
      id: cargaId,
      e_cotado: true,
      cliente: "Andre Alves Leocadio",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      data_entrega: new Date("2021-11-10"),
      data_coleta: new Date("2021-11-09"),
      tipo_carga: "ligacao",
      peso: 12.12,
      solicitante: "Acellor mital",
      canal_comunicacao: "ligacao",
      usuario: "my.jwt.token",
    };

    return carga;
  }
}
