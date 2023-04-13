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
        ID: "1044498113",
        DISIMEI: "1295189",
        LAT: "-22,52208800",
        LON: "-44,12481930",
        UF: "RJ",
        DTINC: "2023-04-13T10:44:55.267Z",
      },
      {
        ID: "1044499308",
        DISIMEI: "1295189",
        LAT: "-22,52208800",
        LON: "-44,12481930",
        UF: "RJ",
        DTINC: "2023-04-13T10:45:55.267Z",
      },
      {
        ID: "1044500985",
        DISIMEI: "1295189",
        LAT: "-22,52208800",
        LON: "-44,12481930",
        UF: "RJ",
        DTINC: "2023-04-13T10:55:55.267Z",
      },
      {
        ID: "1044495348",
        DISIMEI: "1295189",
        LAT: "-22,52208800",
        LON: "-44,12481931",
        UF: "RJ",
        DTINC: "2023-04-13T10:42:55.267Z",
      },
      {
        ID: "1044496575",
        DISIMEI: "1295189",
        LAT: "-22,5220880",
        LON: "-44,12481935",
        UF: "RJ",
        DTINC: "2023-04-13T10:43:55.267Z",
      },
      {
        ID: "1044501957",
        DISIMEI: "1295189",
        LAT: "-25,52208801",
        LON: "-45,12481931",
        UF: "RJ",
        DTINC: "2023-04-13T10:40:50.267Z",
      },
      {
        ID: "1044501953",
        DISIMEI: "1295189",
        LAT: "-25,52208801",
        LON: "-45,12481931",
        UF: "RJ",
        DTINC: "2023-04-13T11:30:50.267Z",
      },
      {
        ID: "1044495399",
        DISIMEI: "1295189",
        LAT: "-22,52208800",
        LON: "-44,12481931",
        UF: "RJ",
        DTINC: "2023-04-13T10:42:55.267Z",
      },
    ];

    const resultSemDuplicidade: IarrayDuplicadoSequencia[] = [];
    let objAnterior: IarrayDuplicadoSequencia = arrayDuplicadoSequencia[0];
    let totalTime = 0;

    for (const dadosAtual of arrayDuplicadoSequencia) {
      if (
        dadosAtual.LAT === objAnterior.LAT &&
        dadosAtual.LON === objAnterior.LON
      ) {
        //soma o tempo parado das posições repetidas(em via a soma em minutos)
        const diferencaEmMS = Math.abs(
          new Date(dadosAtual.DTINC).getTime() -
            new Date(objAnterior.DTINC).getTime()
        );
        totalTime += Math.floor(diferencaEmMS / 1000 / 60);
      } else {
        //adiciona o tempo parado nas posições
        objAnterior.DOWNTIME = totalTime;
        resultSemDuplicidade.push(objAnterior);
        objAnterior = dadosAtual;
        totalTime = 0;
      }
    }

    // Adicionar o último objeto que ficou fora do loop
    objAnterior.DOWNTIME = totalTime;
    resultSemDuplicidade.push(objAnterior);

    // Adicionar o atributo "DOWNTIME" aos objetos que não se repetem
    resultSemDuplicidade.forEach((obj: IarrayDuplicadoSequencia) => {
      if (!obj.DOWNTIME) obj.DOWNTIME = 0;
    });

    expect(resultSemDuplicidade[0].DOWNTIME).to.eq(12);
    expect(resultSemDuplicidade[3].DOWNTIME).to.eq(50);
    expect(resultSemDuplicidade.length).to.eq(5);
  });
});
