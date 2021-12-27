import { ValidationError } from "yup";
import {
  UseCaseAddCarga,
  IRepositoryAddCarga,
  IRepositoryUpdateCarga,
  UseCaseUpdateCarga,
  IUserRepository,
  UseCaseAddCargaDerivada,
  IServiceSit,
  // UseCaseAddCargaDerivada,
  // UseCaseUpdateCarga,
  // UseCaseViewCargas,
  // UseCaseDeleteCarga,
  // UseCaseImportCarga,
} from "../src/domain/UseCaseCarga/entities";

import { ICarga } from "../src/models/ICargas";
import { IPaginationResult } from "../src/repositories/CargaRepository";
import {
  IVeiculo,
  IVeiculoRepository,
} from "../src/repositories/VeiculoRepository";
import { IEventSocket } from "../src/socketsRoutes";
const jwtToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiJjNGFjOWZkYi1kYWE3LTQ1YjktYmE4Yy05Y2QxYmJmNGVjMzgiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81NmVkYTc0OS1iOTVlLTRhNzQtOTNkZS1mMDFmZDZiMTYxY2MvIiwiaWF0IjoxNjM2NzI2NzY2LCJuYmYiOjE2MzY3MjY3NjYsImV4cCI6MTYzNjczMDY2NiwiYWlvIjoiRTJaZ1lQQ3ZGeE5tTzdXbGgyM3F0YkxKOTlsTmR5MnBEbG5FRy9nK1k1MEUzK3c1TGFjQiIsImFtciI6WyJwd2QiXSwiZmFtaWx5X25hbWUiOiJBbHZlcyBMZW9jYWRpbyIsImdpdmVuX25hbWUiOiJBbmRyZSIsImlwYWRkciI6IjE3Ny4xMDcuMTI4Ljk4IiwibmFtZSI6IkFuZHJlIEFsdmVzIExlb2NhZGlvIiwibm9uY2UiOiIzY2M4YjYxMC02MDUyLTQ4NGItYjBiMi0yODUwY2YwZjlmYjEiLCJvaWQiOiI1ZDU1ZDMwNi0xM2Q2LTQ1ZGQtOWJjNy00ZTY3YjliNzA1ZDUiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjAwNzY0NzM4Ny0xODczMzYzOTg5LTM3NjM5MzQyNDMtMjcyOTIiLCJyaCI6IjAuQVE4QVNhZnRWbDY1ZEVxVDN2QWYxckZoek51ZnJNU24ycmxGdW95YzBidjA3RGdQQU4wLiIsInN1YiI6IlU5VWVZVWQ1QkhqZVM5OEJzZElGZkE4SF9KUEZnY1lyTGVyYXk4UF9CZUkiLCJ0aWQiOiI1NmVkYTc0OS1iOTVlLTRhNzQtOTNkZS1mMDFmZDZiMTYxY2MiLCJ1bmlxdWVfbmFtZSI6ImFuZHJlLmxlb2NhZGlvQHRvcmEuY29tLmJyIiwidXBuIjoiYW5kcmUubGVvY2FkaW9AdG9yYS5jb20uYnIiLCJ1dGkiOiJjNzNNWjNZaDEwaTJKMHZyaFpVbEFBIiwidmVyIjoiMS4wIn0.SEI5b_yM10presTFsEkP2LBi9K8CB50K52ojX76xsZOzlr29hV4SNGgkEZoWekYVKxwk9qduUx-fThQsqBP7Jv2r_Q6pD_p0v8f9NOaF94ai59X_HxqlTd1PA1H5uTdS0Sdc6lR9Ecb_r7Q2JIaoAemuyc7GhR93rQ_1GieLWuBzkYhldaE9vQP--iHEBElEmQaYdhBdcDae5HyWImfVhxtvDyxxwmlC-a14QOHv4tgwr53HvJtU_0xDa4KiChyCKDUVvCWVY-3QW18SKXTSnlSy2nbq1vMpetEBuRKr7ZNKzL8_5ICNc5sjhoeyoljEbRvct6mYKTfqlBpM-lLrAA";

function mockNotifyAll(event: IEventSocket) {
  return;
}

class MockVeiculoRepository implements IVeiculoRepository {
  async search(placa: string): Promise<IVeiculo | undefined> {
    return {
      id_veiculo: 1287001,
      id_tipo_veiculo: 4,
      descricao: "CARRETA CARGA SECA (03 EIXOS)",
      placa: placa,
      ano: 2006,
      chassis: "9ADG124367M240546",
      placa_carreta: "BWC8809",
      placa_bitrem: null,
      nome_motorista: "Nome do motorista de teste",
    };
  }
  async hasDriver(placa: string): Promise<boolean> {
    return true;
  }
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
  let veiculoRepository: MockVeiculoRepository;
  beforeEach(() => {
    cargaRepository = new MockRepositoryCarga();
    veiculoRepository = new MockVeiculoRepository();
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
    const useCase = new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
    );
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
    const useCase = new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
    );
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
    const useCase = new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
    );
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
  private permissions: string[] = ["APROVAR_VEICULOS"];
  async setPermissions(permissions: string[]) {
    this.permissions = permissions;
  }
  async index(oid: string): Promise<any> {
    return {
      oid: oid,
      nome: "Andre Alves Leocadio",
      email: "andre.leocadio@tora.com.br",
      permissoes: [...this.permissions],
    };
  }
}
class MockServiceSit implements IServiceSit {
  async cancelar(cargas: ICarga[]): Promise<any> {
    return;
  }
  async migrar(cargas: ICarga[]): Promise<any> {
    return;
  }
}
describe("Update carga", () => {
  let cargaRepository: MockRepositoryCarga;
  let userRepository: MockUserRepository;
  let serviceSit: MockServiceSit;
  let veiculoRepository: MockVeiculoRepository;
  beforeEach(() => {
    cargaRepository = new MockRepositoryCarga();
    userRepository = new MockUserRepository();
    serviceSit = new MockServiceSit();
    veiculoRepository = new MockVeiculoRepository();
  });

  it("Não é possível atualizar o fk_situacao da carga para 3 ou 2 sem uma placa", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      veiculoRepository
    );

    await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
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
    expect(carga?.fk_situacao).toBe(1);
  });

  it("Ao modificar o campo placa do veiculo fk_situacao deve ser movido para 2 caso tenha placa e 1 caso esteja sem a placa", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      veiculoRepository
    );

    await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
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
        placa_veiculo: "BWC8809",
      },
      "OID"
    );
    expect(cargaComPlaca?.fk_situacao).toBe(2);

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

    expect(cargaSemPlaca?.fk_situacao).toBe(1);
  });

  it("Não é possível atualizar fk_situacao para 3 ou 4 sem preencher observacao_gr", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      veiculoRepository
    );

    await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
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
        placa_veiculo: "BWC8809",
        fk_situacao: 3,
      },
      "OID"
    );
    expect(cargaComPlaca?.fk_situacao).toBe(2);

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
          placa_veiculo: "BWC8809",
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
      mockNotifyAll,
      serviceSit,
      veiculoRepository
    );

    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
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
      placa_veiculo: "BWC8809",
    });
    expect(cargaInicial.fk_situacao).toBe(2);

    const cargaComPlaca = await useCase.run(
      {
        ...cargaInicial,
        fk_situacao: 1,
      },
      "OID"
    );
    expect(cargaComPlaca?.fk_situacao).toBe(2);
  });

  it("Não é possível atualizar um lote para virar uma carga", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      veiculoRepository
    );

    const loteInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
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
      placa_veiculo: "BWC8809",
    });

    await expect(
      async () =>
        await useCase.run(
          {
            ...loteInicial,
            e_lote: false,
          },
          "OID"
        )
    ).rejects.toThrow();
  });

  it("Não é possível atualizar quantidade e unidade de medida de um lote", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      veiculoRepository
    );

    const loteInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
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
      placa_veiculo: "BWC8809",
    });

    const cargaAtualizada = await useCase.run(
      {
        ...loteInicial,
        quantidade: 11,
        unidade_medida: "RN",
        quantidade_atual: 11,
      },
      "OID"
    );

    expect(cargaAtualizada?.quantidade).toBe(12);
    expect(cargaAtualizada?.quantidade_atual).toBe(11);
    expect(cargaAtualizada?.unidade_medida).toMatch("UN");

    const cargaAtualizadaSemQuantidade = await useCase.run(
      {
        ...cargaAtualizada,
        quantidade: 11,
        unidade_medida: "RN",
        quantidade_atual: undefined,
      },
      "OID"
    );
    expect(cargaAtualizadaSemQuantidade?.quantidade_atual).toBe(11);
  });

  it("Não é possível atualizar a unidade de medida de uma carga derivada", async () => {
    await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
    ).run({
      id: "M-1",
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
    });

    const cargaDerivada = await new UseCaseAddCargaDerivada(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
    ).run({
      id: "M-2",
      e_lote: false,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "RN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      fk_lote_pai: "M-1",
    });

    expect(cargaDerivada.unidade_medida).toMatch("UN");
  });

  it("Não é possível cadastrar uma carga derivada com mais quantidade que a quantidade atual do lote", async () => {
    await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
    ).run({
      id: "M-1",
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
    });

    await expect(
      async () =>
        await new UseCaseAddCargaDerivada(
          cargaRepository,
          mockNotifyAll,
          veiculoRepository
        ).run({
          id: "M-2",
          e_lote: false,
          cliente: "ARCELLOR MITTAL",
          origem_carga: "ops-inicio",
          destino_carga: "ops-final",
          unidade_medida: "RN",
          quantidade: 13,
          canal_comunicacao: "manual",
          responsavel_cadastro: "Andre Alves Leocadio",
          fk_lote_pai: "M-1",
        })
    ).rejects.toThrow();
  });

  it("O unico movimento que a carga pode fazer apos ser aprovada pelo gr é ser cancelada", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      veiculoRepository
    );

    userRepository.setPermissions(["DELETAR_CARGAS", "APROVAR_VEICULOS"]);

    await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
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
      placa_veiculo: "BWC8809",
    });

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
        placa_veiculo: "BWC8809",
        fk_situacao: 3,
        observacao_gr: "TESTE",
      },
      "OID"
    );

    expect((await cargaRepository.index("M-12"))?.fk_situacao).toBe(3);

    await expect(async () => {
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
          placa_veiculo: "ASD1234", // MUDANCA DE PLACA
          observacao_gr: "TESTE",
        },
        "OID"
      );
    }).rejects.toThrow();

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
        placa_veiculo: "BWC8809",
        fk_situacao: 5,
      },
      "OID"
    );

    expect((await cargaRepository.index("M-12"))?.fk_situacao).toBe(5);
  });

  it("Após a carga ser cancelada não deve ser possível movimentar nenhum de seus status", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      veiculoRepository
    );

    userRepository.setPermissions(["DELETAR_CARGAS"]);

    await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
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
    });

    expect((await cargaRepository.index("M-12"))?.fk_situacao).toBe(1);

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
        fk_situacao: 5,
      },
      "OID"
    );

    expect((await cargaRepository.index("M-12"))?.fk_situacao).toBe(5);

    await expect(async () => {
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
          placa_veiculo: "ASD1234", // MUDANCA DE PLACA
          observacao_gr: "TESTE",
        },
        "OID"
      );
    }).rejects.toThrow();

    expect((await cargaRepository.index("M-12"))?.placa_veiculo).toBeFalsy();
  });

  it("Para a carga ser cancelada o usuario deve possuir a permissão de DELETAR_CARGAS", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      veiculoRepository
    );

    await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      veiculoRepository
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
    });

    expect((await cargaRepository.index("M-12"))?.fk_situacao).toBe(1);

    await expect(async () => {
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
          fk_situacao: 5,
        },
        "OID"
      );
    }).rejects.toThrow();
  });
});
