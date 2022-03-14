import { ValidationError } from "yup";
import {
  UseCaseAddCarga,
  IRepositoryAddCarga,
  IRepositoryUpdateCarga,
  UseCaseUpdateCarga,
  IUserRepository,
  UseCaseAddCargaDerivada,
  IServiceSit,
  IServiceLogTime,
  UseCaseDeleteCarga,
} from "../src/domain/UseCaseCarga/entities";

import chai, { expect, expect } from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

import {
  IVeiculo,
  IVeiculoRepository,
} from "../src/repositories/VeiculoRepository";

import { ICarga } from "../src/models/ICargas";
import { IPaginationResult } from "../src/repositories/CargaRepository";

import { IEventSocket } from "../src/socketsRoutes";
import ECargaStatus from "../src/models/ECargaStatus";
const jwtToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiJjNGFjOWZkYi1kYWE3LTQ1YjktYmE4Yy05Y2QxYmJmNGVjMzgiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81NmVkYTc0OS1iOTVlLTRhNzQtOTNkZS1mMDFmZDZiMTYxY2MvIiwiaWF0IjoxNjM2NzI2NzY2LCJuYmYiOjE2MzY3MjY3NjYsImV4cCI6MTYzNjczMDY2NiwiYWlvIjoiRTJaZ1lQQ3ZGeE5tTzdXbGgyM3F0YkxKOTlsTmR5MnBEbG5FRy9nK1k1MEUzK3c1TGFjQiIsImFtciI6WyJwd2QiXSwiZmFtaWx5X25hbWUiOiJBbHZlcyBMZW9jYWRpbyIsImdpdmVuX25hbWUiOiJBbmRyZSIsImlwYWRkciI6IjE3Ny4xMDcuMTI4Ljk4IiwibmFtZSI6IkFuZHJlIEFsdmVzIExlb2NhZGlvIiwibm9uY2UiOiIzY2M4YjYxMC02MDUyLTQ4NGItYjBiMi0yODUwY2YwZjlmYjEiLCJvaWQiOiI1ZDU1ZDMwNi0xM2Q2LTQ1ZGQtOWJjNy00ZTY3YjliNzA1ZDUiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjAwNzY0NzM4Ny0xODczMzYzOTg5LTM3NjM5MzQyNDMtMjcyOTIiLCJyaCI6IjAuQVE4QVNhZnRWbDY1ZEVxVDN2QWYxckZoek51ZnJNU24ycmxGdW95YzBidjA3RGdQQU4wLiIsInN1YiI6IlU5VWVZVWQ1QkhqZVM5OEJzZElGZkE4SF9KUEZnY1lyTGVyYXk4UF9CZUkiLCJ0aWQiOiI1NmVkYTc0OS1iOTVlLTRhNzQtOTNkZS1mMDFmZDZiMTYxY2MiLCJ1bmlxdWVfbmFtZSI6ImFuZHJlLmxlb2NhZGlvQHRvcmEuY29tLmJyIiwidXBuIjoiYW5kcmUubGVvY2FkaW9AdG9yYS5jb20uYnIiLCJ1dGkiOiJjNzNNWjNZaDEwaTJKMHZyaFpVbEFBIiwidmVyIjoiMS4wIn0.SEI5b_yM10presTFsEkP2LBi9K8CB50K52ojX76xsZOzlr29hV4SNGgkEZoWekYVKxwk9qduUx-fThQsqBP7Jv2r_Q6pD_p0v8f9NOaF94ai59X_HxqlTd1PA1H5uTdS0Sdc6lR9Ecb_r7Q2JIaoAemuyc7GhR93rQ_1GieLWuBzkYhldaE9vQP--iHEBElEmQaYdhBdcDae5HyWImfVhxtvDyxxwmlC-a14QOHv4tgwr53HvJtU_0xDa4KiChyCKDUVvCWVY-3QW18SKXTSnlSy2nbq1vMpetEBuRKr7ZNKzL8_5ICNc5sjhoeyoljEbRvct6mYKTfqlBpM-lLrAA";

function mockNotifyAll(event: IEventSocket) {
  return;
}

class MockRepositoryCarga
  implements IRepositoryAddCarga, IRepositoryUpdateCarga
{
  private id = 1;
  async nextId(): Promise<number> {
    return this.id++;
  }
  async update(id: number, carga: ICarga): Promise<ICarga> {
    this.cargas = this.cargas.map((i) => {
      return i.id === id ? carga : i;
    });
    return carga;
  }
  public cargas: ICarga[] = [];
  async create(carga: ICarga): Promise<ICarga> {
    this.cargas.push(carga);
    return carga;
  }
  async index(id: number): Promise<ICarga | undefined> {
    return this.cargas.find((i) => i.id === id);
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

class MockUserRepository implements IUserRepository {
  private permissions: string[] = ["APROVAR_VEICULOS", "VINCULAR_PLACA"];
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
describe("Add carga", () => {
  let cargaRepository: MockRepositoryCarga;
  let userRepository: MockUserRepository;
  beforeEach(() => {
    cargaRepository = new MockRepositoryCarga();
    userRepository = new MockUserRepository();
  });

  it("Não é possível gerar carga sem campos obrigatorios", async () => {
    /**
     - Não é possível cadastrar carga sem:
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
      userRepository
    );
    try {
      await useCase.run({
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
      });
      throw new Error("Carga criada com parametros invalidos");
    } catch (error) {
      expect(error).to.be.instanceOf(ValidationError);
    }
  });

  it("Não é possível cadastrar carga com id repetido", async () => {
    const useCase = new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    );
    const carga1 = await useCase.run({
      id: 1,
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
    });
    const carga2 = await useCase.run({
      id: 1,
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
    });

    expect(carga1.id).to.be.not.eq(carga2.id);
  });

  it("Não é possível cadastrar placa sem motorista vinculado", async () => {
    await expect(
      new UseCaseAddCarga(cargaRepository, mockNotifyAll, userRepository).run({
        e_lote: false,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "RN",
        quantidade: 13,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
        placa_veiculo: "ABC1234",
      })
    ).to.be.rejected;
  });
});

class MockServiceSit implements IServiceSit {
  async cancelar(cargas: ICarga[]): Promise<any> {
    return;
  }
  async migrar(cargas: ICarga[]): Promise<any> {
    return;
  }
}
class MockServiceLogTime implements IServiceLogTime {
  async create(obj: Record<string, any>): Promise<any> {
    return obj;
  }
}
describe("Situação do veículo", () => {
  let cargaRepository: MockRepositoryCarga;
  let userRepository: MockUserRepository;
  let serviceSit: MockServiceSit;
  let serviceLogTime: MockServiceLogTime;
  beforeEach(() => {
    cargaRepository = new MockRepositoryCarga();
    userRepository = new MockUserRepository();
    serviceSit = new MockServiceSit();
    serviceLogTime = new MockServiceLogTime();
  });

  it("Após a carga ser cancelada não deve ser possível movimentar nenhum de seus status", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );

    userRepository.setPermissions(["DELETAR_CARGAS"]);

    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      fk_filial: 157,
    });

    expect((await cargaRepository.index(cargaInicial.id))?.fk_situacao).to.eq(
      1
    );

    await useCase.run(
      {
        id: cargaInicial.id,
        e_lote: true,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "UN",
        quantidade: 12,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
        fk_situacao: 5,
        observacao_cancelamento: "meu teste",
      },
      "OID"
    );

    expect((await cargaRepository.index(cargaInicial.id))?.fk_situacao).to.eq(
      5
    );

    await expect(
      useCase.run(
        {
          id: cargaInicial.id,
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
      )
    ).to.be.rejected;

    expect(!!(await cargaRepository.index(cargaInicial.id))?.placa_veiculo).to
      .be.false;
  });

  it("Após a carga ser APROVADA PELO GR so deve ser possível ser cancelada ou ter seu documento emitido", async () => {
    const addUseCase = new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    );
    const cargaCadastrada = await addUseCase.run({
      e_lote: true,
      cliente: "ARCELLOR MITTAL - 128309128390812 - BETIM/MG",
      origem_carga: "BRASIL/MG/BETIM",
      destino_carga: "BRASIL/MG/BETIM",
      unidade_medida: "UN",
      quantidade: 12,
      fk_filial: 157,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      placa_veiculo: "ABC1234",
      codigo_motorista: 12,
    });

    const updateUseCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );

    const cargaAtualizada = await updateUseCase.run(
      {
        ...cargaCadastrada,
        fk_situacao: ECargaStatus.APROVADO_PELO_GR,
        observacao_gr: "Observacao",
      },
      "OID"
    );

    expect(
      updateUseCase.run(
        {
          ...cargaAtualizada,
          fk_situacao: ECargaStatus.VEICULO_REPROVADO,
        },
        "OID"
      )
    ).to.be.rejected;
    expect(
      updateUseCase.run(
        {
          ...cargaAtualizada,
          fk_situacao: ECargaStatus.AGUARDANDO_GR,
        },
        "OID"
      )
    ).to.be.rejected;
  });

  it("O usuário deve possuir a permissao DELETAR_CARGAS para realizar o cancelamento da carga", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );

    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
    });

    expect((await cargaRepository.index(cargaInicial.id))?.fk_situacao).to.eq(
      1
    );

    await expect(
      useCase.run(
        {
          id: cargaInicial.id,
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
      )
    ).to.be.rejected;
  });

  it("O usuário deve ter a permissao VINCULAR_PLACA para colocar uma placa na carga", async () => {
    const useCaseAdd = new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    );
    const carga = await useCaseAdd.run({
      e_lote: false,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 0,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
    });
    userRepository.setPermissions([]);

    const useCaseUpdate = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );

    await expect(
      useCaseUpdate.run(
        {
          ...carga,
          placa_veiculo: "ABC1234",
          codigo_motorista: 12,
        },
        "OID"
      )
    ).to.be.rejected;
  });

  it("Não é possível registrar uma carga com quantidade vazia ou negativa", async () => {
    const useCaseAdd = new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    );
    await expect(
      useCaseAdd.run({
        e_lote: false,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "UN",
        quantidade: -1,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
        fk_situacao: 2,
      })
    ).to.be.rejected;
  });

  it("Para deletar uma carga é necessário preencher observacao_exclusao", async () => {
    const useCaseAdd = new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    );
    const cargaCadastrada = await useCaseAdd.run({
      e_lote: false,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      fk_situacao: 2,
    });
    const useCaseDelete = new UseCaseDeleteCarga(
      cargaRepository,
      mockNotifyAll
    );
    await expect(useCaseDelete.run(cargaCadastrada.id, "Andre Alves Leocadio"))
      .to.be.rejected;

    const observacaoExclusao = "Minha observação";
    await useCaseDelete.run(
      cargaCadastrada.id,
      "Andre Alves Leocadio",
      observacaoExclusao
    );

    expect(
      (await cargaRepository.index(cargaCadastrada.id))?.observacao_exclusao
    ).to.eq(observacaoExclusao);
  });

  it("Não é possível atualizar a situacao da carga para qualquer valor tirando 'AGUARDANDO ALOCACAO DO VEICULO' sem atribuir uma placa a carga", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );

    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      fk_situacao: 2,
      fk_filial: 157,
    });

    const carga = await useCase.run(
      {
        id: cargaInicial.id,
        e_lote: true,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "UN",
        quantidade: 12,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
        fk_filial: 157,
        fk_situacao: 2,
      },
      "OID"
    );
    expect(carga?.fk_situacao).to.eq(1);
  });

  it('Ao modificar o campo placa do veiculo a situacao deve ser resetada para "AGUARDANDO ALOCACAO DO VEICULO" se não tiver placa e "AGUARDANDO APROVACAO DO GR" caso tenha placa', async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );

    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      fk_filial: 157,
      responsavel_cadastro: "Andre Alves Leocadio",
    });

    const cargaComPlaca = await useCase.run(
      {
        id: cargaInicial.id,
        e_lote: true,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        fk_filial: 157,
        destino_carga: "ops-final",
        unidade_medida: "UN",
        quantidade: 12,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
        placa_veiculo: "BWC8809",
        codigo_motorista: 12,
      },
      "OID"
    );
    expect(cargaComPlaca?.fk_situacao).to.eq(2);

    const cargaSemPlaca = await useCase.run(
      {
        id: cargaInicial.id,
        e_lote: true,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "UN",
        fk_filial: 157,
        quantidade: 12,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
      },
      "OID"
    );

    expect(cargaSemPlaca?.fk_situacao).to.eq(1);
  });

  it('Não é possível atualizar a situacao para "AGUARDANDO ALOCACAO DO VEICULO" com uma placa de veículo cadastrado', async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );

    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      placa_veiculo: "ABC1234",
      codigo_motorista: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      fk_filial: 157,
    });

    const cargaAtualizada = await useCase.run(
      {
        ...cargaInicial,
        fk_situacao: ECargaStatus.AGUARDANDO_ALOCACAO,
      },
      "OID"
    );
    expect(cargaAtualizada.placa_veiculo).to.not.be.undefined;
    expect(cargaAtualizada.codigo_motorista).to.not.be.undefined;
    expect(cargaAtualizada.fk_situacao).to.be.eq(ECargaStatus.AGUARDANDO_GR);
  });

  it(
    "Ao cadastrar carga que não possui rota entre origem_carga e destino_carga deve ser colocado na tela de pendencias para ser revisado"
  );

  it("Não é possível atualizar um lote para virar uma carga", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );

    const loteInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      placa_veiculo: "BWC8809",
      codigo_motorista: 12,
    });

    await expect(
      useCase.run(
        {
          ...loteInicial,
          e_lote: false,
        },
        "OID"
      )
    ).to.be.rejected;
  });
  it("Não é possível atualizar quantidade e unidade de medida de um lote", async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );

    const loteInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      placa_veiculo: "BWC8809",
      fk_filial: 157,
      codigo_motorista: 12,
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

    expect(cargaAtualizada?.quantidade).to.eq(12);
    expect(cargaAtualizada?.quantidade_atual).to.eq(11);
    expect(cargaAtualizada?.unidade_medida).to.eq("UN");

    const cargaAtualizadaSemQuantidade = await useCase.run(
      {
        ...cargaAtualizada,
        quantidade: 11,
        unidade_medida: "RN",
        quantidade_atual: undefined,
      },
      "OID"
    );
    expect(cargaAtualizadaSemQuantidade?.quantidade_atual).to.eq(11);
  });
  it("Ao gerar uma carga derivada de um lote a quantidade do lote deve ser subtraida", async () => {
    const lote = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
      e_lote: false,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "RN",
      quantidade: 13,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
    });

    const derivada = await new UseCaseAddCargaDerivada(
      cargaRepository,
      mockNotifyAll
    ).run({ ...lote, e_lote: false, fk_lote_pai: lote.id });

    expect(lote.quantidade_atual).to.eq(derivada.quantidade);
    expect(lote.quantidade_atual).to.eq(derivada.quantidade);
    expect((await cargaRepository.index(lote.id))?.quantidade_atual).to.eq(0);
  });
  it("Não é possível alterar a unidade de medida de uma carga derivada em relação ao lote pai", async () => {
    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
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
      mockNotifyAll
    ).run({
      e_lote: false,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "RN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      fk_lote_pai: cargaInicial.id,
    });

    expect(cargaDerivada.unidade_medida).to.eq("UN");
  });

  it("Não é possível cadastrar uma carga derivada com mais quantidade que a quantidade atual do lote", async () => {
    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
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
      new UseCaseAddCargaDerivada(cargaRepository, mockNotifyAll).run({
        e_lote: false,
        cliente: "ARCELLOR MITTAL",
        origem_carga: "ops-inicio",
        destino_carga: "ops-final",
        unidade_medida: "RN",
        quantidade: 13,
        canal_comunicacao: "manual",
        responsavel_cadastro: "Andre Alves Leocadio",
        fk_lote_pai: cargaInicial.id,
      })
    ).to.be.rejected;
  });

  it(
    "Não é possível modificar o vinculo de um programador com uma placa sem a permissão VINCULAR_PLACA"
  );

  it('Não é possível atualizar a situacao para "VEICULO APROVADO" ou "VEICULO REPROVADO" sem a permissao de "APROVAR_VEICULOS"', async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );
    userRepository.setPermissions([]);

    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
      e_lote: false,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      placa_veiculo: "BWC8809",
      fk_filial: 157,
      codigo_motorista: 12,
    });

    await expect(
      useCase.run(
        {
          ...cargaInicial,
          fk_situacao: ECargaStatus.VEICULO_REPROVADO,
        },
        "OID"
      )
    ).to.be.rejected;
  });
  it('Não é possível atualizar para "VEICULO APROVADO" ou "VEICULO REPROVADO" sem preencher observacao_gr', async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );

    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "ops-inicio",
      destino_carga: "ops-final",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      placa_veiculo: "BWC8809",
      fk_filial: 157,
      codigo_motorista: 12,
    });
    expect(cargaInicial.fk_situacao).to.eq(2);

    const cargaComPlaca = await useCase.run(
      {
        ...cargaInicial,
        fk_situacao: 1,
      },
      "OID"
    );
    expect(cargaComPlaca?.fk_situacao).to.eq(2);
  });

  it('Não é possível atualizar a situacao para "VEICULO APROVADO" sem preencher a filial', async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );

    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "BRASIL/MG/CONTAGEM",
      destino_carga: "BRASIL/MG/BETIM",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      placa_veiculo: "BWC8809",
      codigo_motorista: 12,
    });

    await expect(
      useCase.run(
        {
          ...cargaInicial,
          fk_situacao: ECargaStatus.APROVADO_PELO_GR,
          observacao_gr: "cole",
          fk_filial: undefined,
        },
        "OID"
      )
    ).to.be.rejected;
  });

  it('Não é possível atualizar a situacao da carga para "VEICULO_APROVADO" se a origem e/ou destino da carga nao estiver no formato "PAIS/UF/CIDADE"', async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );

    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
      e_lote: true,
      cliente: "ARCELLOR MITTAL",
      origem_carga: "BRASIL/",
      destino_carga: "BRASIL/MG/BETIM",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      placa_veiculo: "BWC8809",
      codigo_motorista: 12,
    });

    await expect(
      useCase.run(
        {
          ...cargaInicial,
          fk_situacao: ECargaStatus.APROVADO_PELO_GR,
          observacao_gr: "cole",
          fk_filial: 157,
        },
        "OID"
      )
    ).to.be.rejected;
  });
  it('Não é possível atualizar a situacao da carga para "VEICULO_APROVADO" se o cliente nao estiver no formato correto "NOME - CNPJ - UF/CIDADE"', async () => {
    const useCase = new UseCaseUpdateCarga(
      cargaRepository,
      userRepository,
      mockNotifyAll,
      serviceSit,
      serviceLogTime
    );

    const cargaInicial = await new UseCaseAddCarga(
      cargaRepository,
      mockNotifyAll,
      userRepository
    ).run({
      e_lote: true,
      cliente: "NOME EM FORMATO INCORRETO",
      origem_carga: "BRASIL/MG/CONTAGEM",
      destino_carga: "BRASIL/MG/BETIM",
      unidade_medida: "UN",
      quantidade: 12,
      canal_comunicacao: "manual",
      responsavel_cadastro: "Andre Alves Leocadio",
      placa_veiculo: "BWC8809",
      codigo_motorista: 12,
    });

    await expect(
      useCase.run(
        {
          ...cargaInicial,
          fk_situacao: ECargaStatus.APROVADO_PELO_GR,
          observacao_gr: "cole",
          fk_filial: 157,
        },
        "OID"
      )
    ).to.be.rejected;
  });
});
