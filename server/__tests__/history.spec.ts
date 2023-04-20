import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { orderBy } from "lodash";
import lodash from "lodash";
chai.use(chaiAsPromised);

describe("GERENCIAMENTO DE HISTORICO DOS VEICULOS", () => {
  it("Deve retornar um array sem duplicidade ", async (done) => {
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
        ID: "1044498114",
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
        ID: "1044498112",
        DISIMEI: "1295189",
        LAT: "-22,52208800",
        LON: "-44,12481930",
        UF: "RJ",
        DTINC: "2023-04-13T10:45:55.267Z",
      },
      {
        ID: "1044498111",
        DISIMEI: "1295189",
        LAT: "-22,52208800",
        LON: "-44,12481930",
        UF: "RJ",
        DTINC: "2023-04-13T10:55:55.267Z",
      },
      {
        ID: "1044498110",
        DISIMEI: "1295189",
        LAT: "-22,5220880",
        LON: "-44,12481935",
        UF: "RJ",
        DTINC: "2023-04-13T10:43:55.267Z",
      },
      {
        ID: "1044498109",
        DISIMEI: "1295189",
        LAT: "-25,52208801",
        LON: "-45,12481931",
        UF: "RJ",
        DTINC: "2023-04-13T10:40:50.267Z",
      },
      {
        ID: "1044498108",
        DISIMEI: "1295189",
        LAT: "-25,52208801",
        LON: "-45,12481931",
        UF: "RJ",
        DTINC: "2023-04-13T11:30:50.267Z",
      },
    ];

    let objAnterior: IarrayDuplicadoSequencia = arrayDuplicadoSequencia[0];
    let totalTime = 0;

    const historicos: IarrayDuplicadoSequencia[] = [];
    arrayDuplicadoSequencia.push({
      ID: "0",
      DISIMEI: "00",
      LAT: "-0",
      LON: "-0",
      UF: "0",
      DTINC: "2023-04-13T11:30:50.267Z",
    });

    //A biblioteca lodash ajuda na performace de funções com grande volumes de dados.
    lodash.forEach(
      arrayDuplicadoSequencia,
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

          historicos.push(objAnterior);
          objAnterior = dadosPositionAtual;
          totalTime = 0;
        }
      }
    );

    // Remove duplicatas usando a função uniqWith da lodash
    const historicosSemDuplicidade: IarrayDuplicadoSequencia[] =
      lodash.uniqWith(historicos, lodash.isEqual);

    //ordenação de historyVeicle DESC;
    const historicosSemDuplicidadeOrdenado = orderBy(
      historicosSemDuplicidade,
      ["ID"],
      ["desc"]
    );

    expect(historicosSemDuplicidadeOrdenado[0].DOWNTIME).to.eq(1);
    expect(historicosSemDuplicidadeOrdenado[2].DOWNTIME).to.eq(11);
    expect(historicosSemDuplicidadeOrdenado[4].DOWNTIME).to.eq(50);
    expect(historicosSemDuplicidadeOrdenado.length).to.eq(5);
    done();
  });
});
