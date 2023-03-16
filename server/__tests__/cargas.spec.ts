import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import {
  CargaValidationOperation,
  IHasPermissions,
} from "../src/validations/CargaValidationOperation";
chai.use(chaiAsPromised);

describe("Gerenciamento da carga", () => {
  function makeSut() {
    class MockPermission implements IHasPermissions {
      public permissions: string[] = [];
      has(permission: string): boolean {
        return this.permissions.includes(permission);
      }
    }
    const mockPermission = new MockPermission();
    const validator = new CargaValidationOperation(mockPermission);

    return { validator, mockPermission };
  }

  function gerarCargaValida() {
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
  it("Não é possível atualizar um lote para virar uma carga.", () => {
    const { validator } = makeSut();
    const cargaValida = { ...gerarCargaValida(), e_lote: true };
    expect(() =>
      validator.validate(cargaValida, { ...cargaValida, e_lote: false })
    ).to.throws("Lote não pode ser convertido para carga");
  });

  it('Não é possível atualizar a situacao da carga para qualquer valor tirando "AGUARDANDO ALOCACAO DO VEICULO" sem atribuir uma placa a carga.', () => {
    const { validator } = makeSut();
    const cargaValida = {
      ...gerarCargaValida(),
      codigo_motorista: undefined,
      placa_veiculo: undefined,
    };

    expect(
      validator.validate(cargaValida, { ...cargaValida, fk_situacao: 2 })
        .fk_situacao
    ).to.eq(1);
  });

  it('Ao modificar o campo placa do veiculo a situacao deve ser resetada para "AGUARDANDO ALOCACAO DO VEICULO" se não tiver placa e "AGUARDANDO APROVACAO DO GR" caso tenha placa.', () => {
    const { validator, mockPermission } = makeSut();
    mockPermission.permissions = ["VINCULAR_PLACA"];
    const cargaValida = gerarCargaValida();
    const carga = validator.validate(cargaValida, {
      ...cargaValida,
      placa_veiculo: "ABC0000",
    });
    expect(carga.placa_veiculo).to.eq("ABC0000");
    expect(carga.fk_situacao).to.eq(2);
  });

  it('Não é possível atualizar a situacao para "VEICULO APROVADO" sem preencher a filial.', () => {
    const { validator } = makeSut();
    const cargaValida = {
      ...gerarCargaValida(),
      fk_situacao: 2,
      fk_filial: undefined,
    };
    expect(() =>
      validator.validate(cargaValida, { ...cargaValida, fk_situacao: 3 })
    ).to.throws("Não é possível aprovar veículo sem preencher a filial");
  });

  it('Não é possível atualizar a situacao para "DOCUMENTO EMITIDO" sem a permissao "APROVAR_VIAGEM".', () => {
    const { validator, mockPermission } = makeSut();
    mockPermission.permissions = [];
    const cargaValida = {
      ...gerarCargaValida(),
      fk_situacao: 3,
    };
    expect(() =>
      validator.validate(cargaValida, { ...cargaValida, fk_situacao: 6 })
    ).to.throws(
      "Não é possível mudar o status da carga para DOCUMENTO EMITIDO sem a permissão 'APROVAR_VIAGEM'"
    );
  });

  it('Não é possível atualizar para "VEICULO APROVADO" ou "VEICULO REPROVADO" sem preencher observacao_gr.', () => {
    const { validator } = makeSut();
    const cargaValida = {
      ...gerarCargaValida(),
      fk_situacao: 2,
      observacao_gr: undefined,
    };
    expect(() =>
      validator.validate(cargaValida, { ...cargaValida, fk_situacao: 3 })
    ).to.throws("Não é possível aprovar veículo sem preencher a observacao_gr");
  });

  it('Não é possível atualizar a situacao da carga para "VEICULO_APROVADO" se a origem e/ou destino da carga nao estiver no formato "PAIS/UF/CIDADE".', () => {
    const { validator } = makeSut();
    const cargaValida = {
      ...gerarCargaValida(),
      fk_situacao: 2,
      observacao_gr: undefined,
    };
    expect(() =>
      validator.validate(cargaValida, {
        ...cargaValida,
        fk_situacao: 3,
        observacao_gr: "Observacao",
        origem_carga: "asdkjhashdkjas",
        destino_carga: "asjdkjsalkdj",
      })
    ).to.throws(
      "Não é possível aprovar veículo sem preencher origem e destino da carga corretamente"
    );
  });

  it('Não é possível atualizar a situacao da carga para "VEICULO_APROVADO" se o cliente nao estiver no formato correto "NOME - CNPJ - UF/CIDADE".', () => {
    const { validator } = makeSut();
    const cargaValida = {
      ...gerarCargaValida(),
      fk_situacao: 2,
      observacao_gr: undefined,
      cliente: "adsadsadsa",
    };
    expect(() =>
      validator.validate(cargaValida, {
        ...cargaValida,
        fk_situacao: 3,
        observacao_gr: "Observacao",
      })
    ).to.throws(
      "Não é possível aprovar veículo sem preencher o cliente da carga corretamente"
    );
  });

  it("Não é possivel registrar uma placa sem motorista vinculado.", () => {
    const { validator, mockPermission } = makeSut();
    mockPermission.permissions = ["VINCULAR_PLACA"];
    const cargaInvalida = {
      ...gerarCargaValida(),
      placa_veiculo: "ABC1234",
      codigo_motorista: undefined,
    };
    expect(() => validator.validate(null, cargaInvalida)).to.throws(
      "Não é possível ter uma placa vinculada sem motorista"
    );
  });

  it("Os unicos movimentos que a carga pode fazer apos ser aprovada pelo gr é ser cancelada ou ter o documento emitido.", () => {
    const { validator, mockPermission } = makeSut();
    const cargaValida = {
      ...gerarCargaValida(),
      placa_veiculo: "ABC1234",
      codigo_motorista: 123,
      fk_situacao: 3,
      observacao_gr: "aprovado",
    };
    mockPermission.permissions = ["DELETAR_CARGAS"];

    expect(() =>
      validator.validate(cargaValida, {
        ...cargaValida,
        origem_carga: "BRASIL/MG/PITOM",
      })
    ).to.throws("A carga não pode ter seus dados alterados após ser aprovada");
    expect(() =>
      validator.validate(cargaValida, { ...cargaValida, fk_situacao: 1 })
    ).to.throws("A carga não pode ter seus dados alterados após ser aprovada");
    expect(
      validator.validate(cargaValida, { ...cargaValida, fk_situacao: 5 })
        .fk_situacao
    ).to.be.eq(5);
  });

  it('Não é possível atualizar a situacao para "AGUARDANDO ALOCACAO DO VEICULO" com uma placa de veículo cadastrado.', () => {
    const { validator } = makeSut();
    const cargaValida = {
      ...gerarCargaValida(),
      placa_veiculo: "ABC1234",
      codigo_motorista: 123,
      fk_situacao: 2,
    };

    expect(
      validator.validate(cargaValida, { ...cargaValida, fk_situacao: 1 })
        .fk_situacao
    ).to.be.eq(2);
  });

  it("Não é possível registrar uma carga com quantidade vazia ou negativa.", () => {
    const { validator, mockPermission } = makeSut();
    mockPermission.permissions = ["VINCULAR_PLACA"];
    const cargaValida = {
      ...gerarCargaValida(),
      placa_veiculo: "ABC1234",
      codigo_motorista: 123,
      fk_situacao: 2,
      quantidade: -1,
    };

    expect(() => validator.validate(null, cargaValida)).to.throws(
      "Não é possível registrar uma carga com quantidade vazia ou negativa."
    );
  });

  // GERAL
  it("Carga nao pode ser movimentada apos ser cancelada.", () => {
    const { validator } = makeSut();
    const cargaValida = {
      ...gerarCargaValida(),
      placa_veiculo: "ABC1234",
      codigo_motorista: 123,
      fk_situacao: 5,
      quantidade: 12,
      observacao_cancelamento: "teste",
    };

    expect(() => validator.validate(cargaValida, cargaValida)).to.throws(
      "Não é possível movimentar a carga após o cancelamento da mesma"
    );
  });

  it("Carga nao pode ser movimentada apos ter seu documento emitido.", () => {
    const { validator } = makeSut();
    const cargaValida = {
      ...gerarCargaValida(),
      placa_veiculo: "ABC1234",
      codigo_motorista: 123,
      fk_situacao: 6,
      quantidade: 12,
    };

    expect(() => validator.validate(cargaValida, cargaValida)).to.throws(
      "Não é possível movimentar a carga após o documento ser emitido"
    );
  });

  it("Não é possível atualizar quantidade e unidade de medida de um lote.", () => {
    const { validator } = makeSut();
    const cargaValida = {
      ...gerarCargaValida(),
      e_lote: true,
      quantidade: 12,
      quantidade_atual: 12,
      unidade_medida: "UN",
    };
    expect(() =>
      validator.validate(cargaValida, { ...cargaValida, unidade_medida: "KG" })
    ).to.throws("Não é possível modificar a unidade de medida de um lote");
    expect(() =>
      validator.validate(cargaValida, { ...cargaValida, quantidade: 14 })
    ).to.throws("Não é possível modificar a quantidade total de um lote");
    expect(
      validator.validate(cargaValida, cargaValida).unidade_medida
    ).to.be.eq("UN");
    expect(validator.validate(cargaValida, cargaValida).quantidade).to.be.eq(
      12
    );
  });

  it("Não é possível excluir carga sem a permissao DELETAR_CARGAS.", () => {
    const { validator, mockPermission } = makeSut();
    mockPermission.permissions = [];
    const cargaValida = {
      ...gerarCargaValida(),
      quantidade: 12,
      quantidade_atual: 12,
      unidade_medida: "UN",
    };
    expect(() =>
      validator.validate(cargaValida, { ...cargaValida, ativo: 0 })
    ).to.throws(
      "Não é possível excluir uma carga sem a permissão DELETAR_CARGAS"
    );
    mockPermission.permissions = ["DELETAR_CARGAS"];
    expect(
      validator.validate(cargaValida, { ...cargaValida, ativo: 0 }).ativo
    ).to.be.eq(0);
  });

  it('Não é possível atualizar a situacao para "VEICULO APROVADO" ou "VEICULO REPROVADO" sem a permissao de "APROVAR_VEICULOS".', () => {
    const { validator, mockPermission } = makeSut();
    mockPermission.permissions = [];
    const cargaValida = {
      ...gerarCargaValida(),
      quantidade: 12,
      quantidade_atual: 12,
      unidade_medida: "UN",
      fk_situacao: 2,
    };
    expect(() =>
      validator.validate(cargaValida, {
        ...cargaValida,
        fk_situacao: 3,
        observacao_gr: "aprovado",
      })
    ).to.throws(
      'Não é possível aprovar ou reprovar uma carga sem a permissão "APROVAR_VEICULOS"'
    );
    expect(() =>
      validator.validate(cargaValida, {
        ...cargaValida,
        fk_situacao: 4,
        observacao_gr: "reprovado",
      })
    ).to.throws(
      'Não é possível aprovar ou reprovar uma carga sem a permissão "APROVAR_VEICULOS"'
    );
    mockPermission.permissions = ["APROVAR_VEICULOS"];
    expect(
      validator.validate(cargaValida, {
        ...cargaValida,
        fk_situacao: 3,
        observacao_gr: "aprovado",
      }).fk_situacao
    ).to.be.eq(3);
  });

  it("Ao salvar uma carga com status de VEICULO_REPROVADO a o status da carga deve ser movida para AGUARDANDO APROVACAO DA GR", () => {
    const { validator, mockPermission } = makeSut();
    mockPermission.permissions = [];
    const cargaValida = {
      ...gerarCargaValida(),
      quantidade: 12,
      quantidade_atual: 12,
      unidade_medida: "UN",
      fk_situacao: 4,
      placa_veiculo: "ABC1234",
      codigo_motorista: 12,
    };
    mockPermission.permissions = ["VINCULAR_PLACA"];
    expect(validator.validate(cargaValida, cargaValida).fk_situacao).to.be.eq(
      2
    );
  });

  it("O usuário deve possuir a permissao DELETAR_CARGAS para realizar o cancelamento da carga.", () => {
    const { validator, mockPermission } = makeSut();
    mockPermission.permissions = [];
    const cargaValida = {
      ...gerarCargaValida(),
      quantidade: 12,
      quantidade_atual: 12,
      unidade_medida: "UN",
      fk_situacao: 3,
    };
    expect(() =>
      validator.validate(cargaValida, {
        ...cargaValida,
        fk_situacao: 5,
        observacao_cancelamento: "cancelada",
      })
    ).to.throws(
      'Não é possível cancelar uma carga sem a permissão "DELETAR_CARGAS"'
    );
    mockPermission.permissions = ["DELETAR_CARGAS"];
    expect(
      validator.validate(cargaValida, {
        ...cargaValida,
        fk_situacao: 5,
        observacao_cancelamento: "cancelada",
      }).fk_situacao
    ).to.be.eq(5);
  });

  it("Não é possível cadastrar carga sem campos obrigatorios");

  // SITUACAO VEICULO
  it(
    "Ao cadastrar carga que não possui rota entre origem_carga e destino_carga deve ser colocado na tela de pendencias para ser revisado."
  );

  // LOTE
  it(
    "Ao gerar uma carga derivada de um lote a quantidade do lote deve ser subtraida."
  );

  // CARGA DERIVADA
  it(
    "Não é possível alterar a unidade de medida de uma carga derivada em relação ao lote pai."
  );
  it(
    "Não é possível cadastrar uma carga derivada com mais quantidade que a quantidade atual do lote."
  );

  // PERMISSOES
  it("O usuário não deve possuir a permissao VINCULAR_PLACA para vincular a placa na carga.", () => {
    const { validator, mockPermission } = makeSut();
    mockPermission.permissions = [];
    const cargaValida = {
      ...gerarCargaValida(),
      quantidade: 12,
      quantidade_atual: 12,
      unidade_medida: "UN",
      fk_situacao: 1,
    };
    expect(() =>
      validator.validate(cargaValida, {
        ...cargaValida,
        placa_veiculo: "1234ABC",
        codigo_motorista: 12,
        observacao_cancelamento: "cancelada",
      })
    ).to.not.throws();

    expect(
      validator.validate(
        { ...cargaValida, placa_veiculo: null },
        {
          ...cargaValida,
          placa_veiculo: "",
        }
      ).placa_veiculo
    ).to.be.eq("");

    mockPermission.permissions = ["VINCULAR_PLACA"];
    expect(
      validator.validate(cargaValida, {
        ...cargaValida,
        placa_veiculo: "1234ABC",
        codigo_motorista: 12,
        observacao_cancelamento: "cancelada",
      }).placa_veiculo
    ).to.be.eq("1234ABC");
  });
  //edição patch carga
  // type TBody = {
  //   ativo: number;
  //   usuario: string;
  //   fk_situacao: number;
  // };
  // it("Deve retornar mensagem de erro caso o usuário não exista", async () => {
  //   const { mokUseCaseUpdateCargaPatch } = makeSut();
  //   const request: Partial<TBody> = {
  //     ativo: 2,
  //     usuario: "moisess spec.ts",
  //   };
  //   const id = 22;
  //   const expected = "A carga seleionada não existe";
  //   const response = await mokUseCaseUpdateCargaPatch.run(id, request);

  //   expect(response.mensagem).to.be(expected);
  // });
});
