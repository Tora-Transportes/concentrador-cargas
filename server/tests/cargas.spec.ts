import { ValidationError } from "yup";
import {
  UseCaseAddCarga,
  IRepositoryAddCarga,
  IRepositoryUpdateCarga,
  UseCaseUpdateCarga,
  IUserRepository,
  // UseCaseAddCargaDerivada,
  // UseCaseUpdateCarga,
  // UseCaseViewCargas,
  // UseCaseDeleteCarga,
  // UseCaseImportCarga,
} from "../src/domain/UseCaseCarga/entities";

import { ICarga } from "../src/models/ICargas";
import { IPaginationResult } from "../src/repositories/CargaRepository";
import { IEventSocket } from "../src/socketsRoutes";
const jwtToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiJjNGFjOWZkYi1kYWE3LTQ1YjktYmE4Yy05Y2QxYmJmNGVjMzgiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81NmVkYTc0OS1iOTVlLTRhNzQtOTNkZS1mMDFmZDZiMTYxY2MvIiwiaWF0IjoxNjM2NzI2NzY2LCJuYmYiOjE2MzY3MjY3NjYsImV4cCI6MTYzNjczMDY2NiwiYWlvIjoiRTJaZ1lQQ3ZGeE5tTzdXbGgyM3F0YkxKOTlsTmR5MnBEbG5FRy9nK1k1MEUzK3c1TGFjQiIsImFtciI6WyJwd2QiXSwiZmFtaWx5X25hbWUiOiJBbHZlcyBMZW9jYWRpbyIsImdpdmVuX25hbWUiOiJBbmRyZSIsImlwYWRkciI6IjE3Ny4xMDcuMTI4Ljk4IiwibmFtZSI6IkFuZHJlIEFsdmVzIExlb2NhZGlvIiwibm9uY2UiOiIzY2M4YjYxMC02MDUyLTQ4NGItYjBiMi0yODUwY2YwZjlmYjEiLCJvaWQiOiI1ZDU1ZDMwNi0xM2Q2LTQ1ZGQtOWJjNy00ZTY3YjliNzA1ZDUiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjAwNzY0NzM4Ny0xODczMzYzOTg5LTM3NjM5MzQyNDMtMjcyOTIiLCJyaCI6IjAuQVE4QVNhZnRWbDY1ZEVxVDN2QWYxckZoek51ZnJNU24ycmxGdW95YzBidjA3RGdQQU4wLiIsInN1YiI6IlU5VWVZVWQ1QkhqZVM5OEJzZElGZkE4SF9KUEZnY1lyTGVyYXk4UF9CZUkiLCJ0aWQiOiI1NmVkYTc0OS1iOTVlLTRhNzQtOTNkZS1mMDFmZDZiMTYxY2MiLCJ1bmlxdWVfbmFtZSI6ImFuZHJlLmxlb2NhZGlvQHRvcmEuY29tLmJyIiwidXBuIjoiYW5kcmUubGVvY2FkaW9AdG9yYS5jb20uYnIiLCJ1dGkiOiJjNzNNWjNZaDEwaTJKMHZyaFpVbEFBIiwidmVyIjoiMS4wIn0.SEI5b_yM10presTFsEkP2LBi9K8CB50K52ojX76xsZOzlr29hV4SNGgkEZoWekYVKxwk9qduUx-fThQsqBP7Jv2r_Q6pD_p0v8f9NOaF94ai59X_HxqlTd1PA1H5uTdS0Sdc6lR9Ecb_r7Q2JIaoAemuyc7GhR93rQ_1GieLWuBzkYhldaE9vQP--iHEBElEmQaYdhBdcDae5HyWImfVhxtvDyxxwmlC-a14QOHv4tgwr53HvJtU_0xDa4KiChyCKDUVvCWVY-3QW18SKXTSnlSy2nbq1vMpetEBuRKr7ZNKzL8_5ICNc5sjhoeyoljEbRvct6mYKTfqlBpM-lLrAA";

function mockNotifyAll(event: IEventSocket) {
  return;
}

class MockRepositoryCarga
  implements IRepositoryAddCarga, IRepositoryUpdateCarga
{
  async update(id: string, carga: ICarga): Promise<ICarga> {
    this.cargas = this.cargas.map((i) => {
      return i.id === id ? carga : i;
    });
    return carga;
  }
  private cargas: ICarga[] = [];
  async create(carga: ICarga): Promise<ICarga> {
    this.cargas.push(carga);
    return carga;
  }
  async index(id: string): Promise<ICarga | undefined> {
    return this.cargas.find((i) => String(i.id) === id);
  }
  async search(
    query: Record<string, any>,
    page?: number,
    pageSize?: number
  ): Promise<IPaginationResult<ICarga>> {
    throw new Error("Method not implemented.");
  }
  async bulkCreate(cargas: ICarga[]): Promise<any> {
    for (const i of cargas) {
      this.cargas.push(i);
    }
  }
}

describe("Add carga", () => {
  let cargaRepository: MockRepositoryCarga;
  beforeEach(() => {
    cargaRepository = new MockRepositoryCarga();
  });
  it("Não é possível gerar carga sem campos obrigatorios", async () => {
    /**
     - Não é possível cadastrar carga sem:
        - id
        - e_lote
        - cliente
        - quantidade
        - unidade_medida 
        - canal_comunicacao
        - responsavel_cadastro
    */
    const useCase = new UseCaseAddCarga(cargaRepository, mockNotifyAll);
    try {
      await useCase.run({
        id: "M-12",
        // e_lote: true,
        // cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        // unidade_medida: "UN",
        // quantidade: 12,
        // canal_comunicacao: "manual",
        // responsavel_cadastro: "Andre Alves Leocadio",
      });
      expect(true).toBeFalsy(); // se não lancar o try catch da erro
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
    }
  });

  it("Não é possível cadastrar carga com id repetido", async () => {
    const useCase = new UseCaseAddCarga(cargaRepository, mockNotifyAll);
    try {
      await useCase.run({
        id: "M-12",
        e_lote: true,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "UN",
        quantidade: 12,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
      });

      await useCase.run({
        id: "M-12",
        e_lote: true,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "UN",
        quantidade: 12,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
      });
      expect(true).toBeFalsy(); // se não lancar o try catch da erro
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it("Não é possível cadastrar carga com id repetido", async () => {
    const useCase = new UseCaseAddCarga(cargaRepository, mockNotifyAll);
    try {
      await useCase.run({
        id: "M-12",
        e_lote: true,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "UN",
        quantidade: 12,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
      });

      await useCase.run({
        id: "M-12",
        e_lote: true,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "UN",
        quantidade: 12,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
      });
      expect(true).toBeFalsy(); // se não lancar o try catch da erro
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

class MockUserRepository implements IUserRepository {
  async index(oid: string): Promise<any> {
    return {
      oid: oid,
      nome: "Andre Alves Leocadio",
      email: "andre.leocadio@tora.com.br",
      permissoes: ["APROVAR_VEICULOS"],
    };
  }
}
describe("Update carga", () => {
  let cargaRepository: MockRepositoryCarga;
  let userRepository: MockUserRepository;
  beforeEach(() => {
    cargaRepository = new MockRepositoryCarga();
    userRepository = new MockUserRepository();
  });

  it("Não é possível atualizar o fk_situacao da carga para 3 ou 2 sem uma placa", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll
    );

    await new UseCaseAddCarga(cargaRepository, mockNotifyAll).run({
      id: "M-12",
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      fk_situacao: 2,
    });

    const carga = await useCase.run(
      {
        id: "M-12",
        e_lote: true,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "UN",
        quantidade: 12,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
        fk_situacao: 2,
      },
      "OID"
    );
    expect(carga.fk_situacao).toBe(1);
  });

  it("Ao modificar o campo placa do veiculo fk_situacao deve ser movido para 2 caso tenha placa e 1 caso esteja sem a placa", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll
    );

    await new UseCaseAddCarga(cargaRepository, mockNotifyAll).run({
      id: "M-12",
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
    });

    const cargaComPlaca = await useCase.run(
      {
        id: "M-12",
        e_lote: true,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "UN",
        quantidade: 12,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
        placa_veiculo: "ABE3215",
      },
      "OID"
    );
    expect(cargaComPlaca.fk_situacao).toBe(2);

    const cargaSemPlaca = await useCase.run(
      {
        id: "M-12",
        e_lote: true,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "UN",
        quantidade: 12,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
      },
      "OID"
    );

    expect(cargaSemPlaca.fk_situacao).toBe(1);
  });

  it("Não é possível atualizar fk_situacao para 3 ou 4 sem preencher observacao_gr", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll
    );

    await new UseCaseAddCarga(cargaRepository, mockNotifyAll).run({
      id: "M-12",
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
    });

    const cargaComPlaca = await useCase.run(
      {
        id: "M-12",
        e_lote: true,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "UN",
        quantidade: 12,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
        placa_veiculo: "ABE3215",
        fk_situacao: 3,
      },
      "OID"
    );
    expect(cargaComPlaca.fk_situacao).toBe(2);

    const cargaAprovada = async () => {
      await useCase.run(
        {
          id: "M-12",
          e_lote: true,
          cliente: "ARCELLOR MITTAL",
          origem_carga: "ops-inicio",
          destino_carga: "ops-final",
          unidade_medida: "UN",
          quantidade: 12,
          canal_comunicacao: "manual",
          responsavel_cadastro: "Andre Alves Leocadio",
          placa_veiculo: "ABE3215",
          fk_situacao: 3,
        },
        "OID"
      );
    };
    expect(cargaAprovada).rejects.toThrow();
  });

  it("Não é possível atualizar fk_situacao para 3 ou 4 sem preencher observacao_gr", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll
    );

    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll
    ).run({
      id: "M-12",
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      placa_veiculo: "ASD1231",
    });
    expect(cargaInicial.fk_situacao).toBe(2);

    const cargaComPlaca = await useCase.run(
      {
        ...cargaInicial,
        fk_situacao: 1,
      },
      "OID"
    );
    expect(cargaComPlaca.fk_situacao).toBe(2);
  });
});
