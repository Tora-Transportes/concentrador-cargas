import cron from "node-cron";
import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import { UseCaseViewCoordenada } from "../../domain/UseCaseCoordenada";

class GerarPlanilha {
  async job() {
    console.log(">>>>>>> INICIANDO O PROCESSO DE GERAR PLANILHA <<<<<<<");
    const useCaseViewCoordenada = new UseCaseViewCoordenada();
    const data = await useCaseViewCoordenada.run({}, 9999999999);
    const pathExcel = process.env.PATH_EXCELL_COORDENADAS ?? "";
    const filename = path.resolve(
      pathExcel,
      "RELATORIO_COORDENADAS_ATUAL.xlsx"
    );

    const workbook = xlsx.utils.book_new();
    for (const i of data.results) {
      if (!i.categoria_veiculo) continue;
      switch (i.categoria_veiculo) {
        case "A":
          i.categoria_veiculo = "Agregado";
          break;
        case "C":
          i.categoria_veiculo = "Carreteiro";
          break;
        case "F":
          i.categoria_veiculo = "Frota";
          break;
      }
    }
    const sheet = xlsx.utils.json_to_sheet(data.results);
    xlsx.utils.book_append_sheet(workbook, sheet);

    const criarPlanilha = () => {
      xlsx.writeFile(workbook, filename, {
        bookType: "xlsx",
        type: "binary",
      });
    };

    if (fs.existsSync(filename)) {
      try {
        //conferir se a planilha está em uso.
        const planilhaEmUso = fs.openSync(filename, "w");
        fs.closeSync(planilhaEmUso);
        fs.unlinkSync(filename);
        criarPlanilha();
      } catch (error) {
        console.log(
          "JOB PLANILHA COORDENADAS, A planilha não pode ser criada pois o arquivo está em uso!"
        );
      }
    } else {
      criarPlanilha();
    }
    console.log(">>>>>>> PROCESSO DE GERAR PLANILHA FINALIZADO <<<<<<<");
  }
}

export default function atualizaCidadesCoordenadas() {
  const gerarPlanilha = new GerarPlanilha();
  cron.schedule("15 * * * *", gerarPlanilha.job);
  //cron.schedule("32 * * * * *", gerarPlanilha.job);
  //gerarPlanilha.job();
}
