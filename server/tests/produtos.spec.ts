import {
  IRepositoryUpdadeProduto,
  UseCaseAddProduto,
  UseCaseUpdateProduto,
} from "../src/domain/UseCaseProduto/entities";
import { IRepositoryAddProduto } from "../src/domain/UseCaseProduto/entities";
import IProduto from "../src/models/IProduto";

const jwtToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiJjNGFjOWZkYi1kYWE3LTQ1YjktYmE4Yy05Y2QxYmJmNGVjMzgiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81NmVkYTc0OS1iOTVlLTRhNzQtOTNkZS1mMDFmZDZiMTYxY2MvIiwiaWF0IjoxNjM2NzI2NzY2LCJuYmYiOjE2MzY3MjY3NjYsImV4cCI6MTYzNjczMDY2NiwiYWlvIjoiRTJaZ1lQQ3ZGeE5tTzdXbGgyM3F0YkxKOTlsTmR5MnBEbG5FRy9nK1k1MEUzK3c1TGFjQiIsImFtciI6WyJwd2QiXSwiZmFtaWx5X25hbWUiOiJBbHZlcyBMZW9jYWRpbyIsImdpdmVuX25hbWUiOiJBbmRyZSIsImlwYWRkciI6IjE3Ny4xMDcuMTI4Ljk4IiwibmFtZSI6IkFuZHJlIEFsdmVzIExlb2NhZGlvIiwibm9uY2UiOiIzY2M4YjYxMC02MDUyLTQ4NGItYjBiMi0yODUwY2YwZjlmYjEiLCJvaWQiOiI1ZDU1ZDMwNi0xM2Q2LTQ1ZGQtOWJjNy00ZTY3YjliNzA1ZDUiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjAwNzY0NzM4Ny0xODczMzYzOTg5LTM3NjM5MzQyNDMtMjcyOTIiLCJyaCI6IjAuQVE4QVNhZnRWbDY1ZEVxVDN2QWYxckZoek51ZnJNU24ycmxGdW95YzBidjA3RGdQQU4wLiIsInN1YiI6IlU5VWVZVWQ1QkhqZVM5OEJzZElGZkE4SF9KUEZnY1lyTGVyYXk4UF9CZUkiLCJ0aWQiOiI1NmVkYTc0OS1iOTVlLTRhNzQtOTNkZS1mMDFmZDZiMTYxY2MiLCJ1bmlxdWVfbmFtZSI6ImFuZHJlLmxlb2NhZGlvQHRvcmEuY29tLmJyIiwidXBuIjoiYW5kcmUubGVvY2FkaW9AdG9yYS5jb20uYnIiLCJ1dGkiOiJjNzNNWjNZaDEwaTJKMHZyaFpVbEFBIiwidmVyIjoiMS4wIn0.SEI5b_yM10presTFsEkP2LBi9K8CB50K52ojX76xsZOzlr29hV4SNGgkEZoWekYVKxwk9qduUx-fThQsqBP7Jv2r_Q6pD_p0v8f9NOaF94ai59X_HxqlTd1PA1H5uTdS0Sdc6lR9Ecb_r7Q2JIaoAemuyc7GhR93rQ_1GieLWuBzkYhldaE9vQP--iHEBElEmQaYdhBdcDae5HyWImfVhxtvDyxxwmlC-a14QOHv4tgwr53HvJtU_0xDa4KiChyCKDUVvCWVY-3QW18SKXTSnlSy2nbq1vMpetEBuRKr7ZNKzL8_5ICNc5sjhoeyoljEbRvct6mYKTfqlBpM-lLrAA";

class MockRepositoryAddProduto implements IRepositoryAddProduto {
  private items: IProduto[] = [];
  async getNextId(): Promise<number> {
    return 1;
  }
  async findByName(nome: string): Promise<IProduto | undefined> {
    return this.items.find((i) => i.nome === nome);
  }
  async create(produto: IProduto): Promise<any> {
    this.items.push(produto);
  }
}
describe("Add produto", () => {
  let useCase: UseCaseAddProduto;
  beforeEach(() => {
    useCase = new UseCaseAddProduto(new MockRepositoryAddProduto());
  });

  it("Não é possível cadastrar produtos em minusculo", async () => {
    const nameToInsert = "teste";
    const expected = "TESTE";

    const response = await useCase.run({
      nome: nameToInsert,
      usuario: jwtToken,
    });

    expect(response.nome).toMatch(expected);
  });

  it("Não é possivel cadastrar produtos com nome repetido", async () => {
    const nameToInsert = "teste";

    await useCase.run({
      nome: nameToInsert,
      usuario: jwtToken,
    });

    expect(() =>
      useCase.run({
        nome: nameToInsert,
        usuario: jwtToken,
      })
    ).rejects.toThrowError();
  });
});

class MockRepositoryUpdateProduto implements IRepositoryUpdadeProduto {
  private items: IProduto[] = [];
  async update(id: number, produto: IProduto): Promise<any> {
    this.items = this.items.map((i) =>
      String(i.id) === String(id) ? produto : i
    );
    return;
  }
  async index(id: string): Promise<IProduto | undefined> {
    return this.items.find((i) => String(i.id) === String(id));
  }
  async findByName(nome: string): Promise<IProduto | undefined> {
    return this.items.find((i) => i.nome === nome);
  }
  async create(produto: IProduto): Promise<any> {
    this.items.push(produto);
  }
}
describe("Update produto", () => {
  it("Não é possível atualizar produto para um nome em minusculo", async () => {
    const mockRepo = new MockRepositoryUpdateProduto();

    await mockRepo.create({
      usuario: jwtToken,
      nome: "TESTE",
      ativo: 1,
      id: 1,
    });

    const useCaseUpdate = new UseCaseUpdateProduto(mockRepo);
    const produto = await useCaseUpdate.run({
      usuario: jwtToken,
      nome: "teste",
      id: 1,
    });

    expect(produto.nome).toMatch("TESTE");
  });

  it("Não é possível atualizar produto para um nome que ja existe", async () => {
    const mockRepo = new MockRepositoryUpdateProduto();

    await mockRepo.create({
      usuario: jwtToken,
      nome: "TESTE",
      ativo: 1,
      id: 1,
    });

    await mockRepo.create({
      usuario: jwtToken,
      nome: "TESTE2",
      ativo: 1,
      id: 2,
    });

    const useCaseUpdate = new UseCaseUpdateProduto(mockRepo);

    expect(() => {
      return useCaseUpdate.run({
        usuario: jwtToken,
        nome: "teste2",
        id: 1,
      });
    }).rejects.toThrowError();
  });
});
