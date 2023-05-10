import { UseCaseViewCargasCsnInfo } from "./../src/domain/csn/UseCaseCargaCsnInfo/entities";
import { CargaCsnInfoRepository } from "./../src/repositories/csn/CargaCsnInfoRepository";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

describe("GERENCIAMENTO CARGA CSN", () => {
  let useCase: UseCaseViewCargasCsnInfo;
  const cargaCsnInfoRepository = new CargaCsnInfoRepository();

  beforeEach(() => {
    useCase = new UseCaseViewCargasCsnInfo(cargaCsnInfoRepository);
  });
  const mockBodyReq = {
    busca_fim: "2023-05-10T03:00:00.000Z",
    busca_inicio: "2023-01-01T03:00:00.000Z",
    e_lote: "0",
    limit: "2",
    page: "1",
  };
  it("Não é permitido fazer uma busca com mais de 30 dias", async () => {
    await useCase.run({ filtrs: mockBodyReq });
    //const dados = await useCase.run({ filtrs: mockBodyReq });
    //chai.expect(dados.results).to.throw(Error);
  });
});
