import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

describe("GERENCIAMENTO DE HISTORICO DOS VEICULOS", () => {
  it("Deve retornar um array sem duplicidade ", async () => {
    //Deve atribuir um novo atributo ao array "DOWNTIME" e retirar as duplicidades em sequência.

    interface IarrayDuplicadoSequencia {
      ID: string;
      DISIMEI: string;
      LAT: string;
      LON: string;
      UF: string;
      DTINC: string;
      DOWNTIME?: number | string;
    }

    const arrayDuplicadoSequencia: IarrayDuplicadoSequencia[] = [
      {
        ID: "1044498116",
        DISIMEI: "1295189",
        LAT: "-22,52208800",
        LON: "-44,12481931",
        UF: "RJ",
        DTINC: "2023-04-13T10:35:55.267Z",
      },
      {
        ID: "1044498115",
        DISIMEI: "1295189",
        LAT: "-22,52208800",
        LON: "-44,12481931",
        UF: "RJ",
        DTINC: "2023-04-13T10:36:55.267Z",
      },
      {
        ID: "104449816",
        DISIMEI: "1295189",
        LAT: "-22,52208855",
        LON: "-44,12481931",
        UF: "RJ",
        DTINC: "2023-04-13T10:36:55.267Z",
      },
      {
        ID: "1044498113",
        DISIMEI: "1295189",
        LAT: "-22,52208800",
        LON: "-44,12481930",
        UF: "RJ",
        DTINC: "2023-04-13T10:44:55.267Z",
      },
      {
        ID: "1044498114",
        DISIMEI: "1295189",
        LAT: "-22,52208800",
        LON: "-44,12481930",
        UF: "RJ",
        DTINC: "2023-04-13T10:45:55.267Z",
      },
      {
        ID: "1044498115",
        DISIMEI: "1295189",
        LAT: "-22,52208800",
        LON: "-44,12481930",
        UF: "RJ",
        DTINC: "2023-04-13T10:55:55.267Z",
      },
      {
        ID: "1044498117",
        DISIMEI: "1295189",
        LAT: "-22,5220880",
        LON: "-44,12481935",
        UF: "RJ",
        DTINC: "2023-04-13T10:43:55.267Z",
      },
      {
        ID: "1044498118",
        DISIMEI: "1295189",
        LAT: "-25,52208801",
        LON: "-45,12481931",
        UF: "RJ",
        DTINC: "2023-04-13T10:40:50.267Z",
      },
      {
        ID: "1044498119",
        DISIMEI: "1295189",
        LAT: "-25,52208801",
        LON: "-45,12481931",
        UF: "RJ",
        DTINC: "2023-04-13T11:30:50.267Z",
      },
    ];

    let objAnterior: IarrayDuplicadoSequencia = arrayDuplicadoSequencia[0];
    let totalTime = 0;

    const historicosSemDuplicidade: IarrayDuplicadoSequencia[] = [];
    arrayDuplicadoSequencia.push({
      ID: "0",
      DISIMEI: "0",
      LAT: "-0",
      LON: "-0",
      UF: "0",
      DTINC: "2023-04-13T11:30:50.267Z",
    });

    arrayDuplicadoSequencia.forEach(
      (dadosPositionAtual, index, arrayHistorico) => {
        if (
          dadosPositionAtual.LAT !== objAnterior.LAT ||
          dadosPositionAtual.LON !== objAnterior.LON
        ) {
          const positionIndice = index > 0 ? index - 1 : index;
          const dataInicioParado = new Date(objAnterior.DTINC);
          const dataFinParado = new Date(arrayHistorico[positionIndice].DTINC);

          totalTime = dataFinParado.getTime() - dataInicioParado.getTime();
          objAnterior.DOWNTIME = Math.floor(totalTime / (1000 * 60));

          historicosSemDuplicidade.push(objAnterior);
          objAnterior = dadosPositionAtual;
          totalTime = 0;
        }
      }
    );

    expect(historicosSemDuplicidade[0].DOWNTIME).to.eq(1);
    expect(historicosSemDuplicidade[2].DOWNTIME).to.eq(11);
    expect(historicosSemDuplicidade[4].DOWNTIME).to.eq(50);
    expect(historicosSemDuplicidade.length).to.eq(5);
  });
});
