import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

function BodyBalido() {
  return {
    id: 1,
    ativo: 1,
    e_lote: false,
    cliente: "ARCELLOR MITTAL - 0021308219380183 - BETIM/MG",
    origem_carga: "BRASIL/MG/BETIM",
    destino_carga: "BRASIL/MG/CONTAGEM",
    unidade_medida: "UN",
    quantidade: 12,
    canal_comunicacao: "manual",
    responsavel_cadastro: "Andre Alves Leocadio",
    placa_veiculo: "ABC1234",
    codigo_motorista: 12,
    fk_filial: 157,
  };
}

describe("GERENCIAMENTO DE CARGAS CSN", () => {
  it("Conferindo se todos os dados obrigatórios estão prenchidos corretamente", () => {
    console.log();
  });
});
