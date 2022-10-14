import database from "../../database";
import axios from "axios";
import cron from "node-cron";
import TextUtils from "../../Utils/text";
//Para rodar este Jobs em desenvolvimento deve descomentar estas 2 linhas abaixo
// import https from "https";
// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false,
// });

interface IdataConcentrador {
  placa: string;
  mct: number;
  lat: number;
  lon: number;
  cidade_atual: string | null;
}

class AtualizaCidadesNull {
  async job() {
    console.log("<<<<<<<<INICIO JOB ATUALIZAR CIDADES COM VALOR NULL>>>>>>>");

    const searchInApi = async (latitude: number, longitude: number) => {
      console.log(
        "|--------------API NOMINATIN ATUALIZA_CIDADES_NULL *INICIOU*------------------|"
      );
      const data = (
        await axios.get("https://nominatim.openstreetmap.org/reverse", {
          params: {
            format: "json",
            lat: latitude,
            lon: longitude,
          },
          //Para rodar em desenvolvimento descomente esta linha abaixo...
          //httpsAgent,
        })
      ).data;

      let city = "";
      let state = "";
      let siglaEstado = "";

      if (data) {
        city = TextUtils.normalize(
          data.address.town ||
            data.address.city ||
            data.address.city_district ||
            data.address.village ||
            data.address.road ||
            data.address.industrial
        ).trim();
        state = TextUtils.normalize(data.address.state).trim();

        const tuple = await database("con_localizacoes")
          .first()
          .where("estado", state)
          .select("sigla_estado");

        siglaEstado = tuple ? tuple.sigla_estado : "NC";
      }
      console.log(
        "|-----API NOMINATIN ATUALIZA_CIDADES_NULL *FINALIZOU*-----|"
      );
      return `${city} - ${siglaEstado}`;
    };

    const dadosCoordenadas: IdataConcentrador[] = await database(
      "con_coordenadas_veiculos"
    )
      .select(["placa", "mct", "lat", "lon", "cidade_atual"])
      .where("cidade_atual", null)
      .andWhere("lat", "<>", 0)
      .andWhere("lon", "<>", 0);

    const getNomeCidadeNominatin = (lat: number, lon: number) =>
      new Promise((resolve) => {
        setTimeout(async () => {
          return resolve(await searchInApi(lat, lon));
        }, 6000);
      });

      // let HorasTotal = new Date();
      // let hora = HorasTotal.getHours();
      // let min = HorasTotal.getMinutes();
      // let seg = HorasTotal.getSeconds();

    if (dadosCoordenadas.length > 0) {
      for (const cidade of dadosCoordenadas) {
        try {
          let nomeCidade;
          await getNomeCidadeNominatin(cidade.lat, cidade.lon)
            .then((response) => {
              nomeCidade = response;
            })
            .catch((error) =>
              console.log("Erro ao Buscar cidade na api Nominatim...", error)
            );

          if (nomeCidade) {
            await database("con_coordenadas_veiculos")
              .where("placa", cidade.placa)
              .where("mct", cidade.mct)
              .update({
                cidade_atual: nomeCidade,
              });
          }
        } catch (error) {
          console.error("Erro no job atualizar cidades com valor null", error);
        }
      }
      console.log("<<<<<<<<FIM JOB ATUALIZAR CIDADES COM VALOR NULL>>>>>>>");
      // lembrar de retirar este else .......
    } else {
    
      //console.log("NÃO EXISTE CIDADES NULL>>>>>>>>", `${hora}:${min}:${seg}`);
      console.log("<<<<<<<<FIM JOB ATUALIZAR CIDADES COM VALOR NULL>>>>>>>");
    }
  }
}

export default function atualizaCidadesCoordenadas() {
  const verificarCidadesNull = new AtualizaCidadesNull();
  cron.schedule("*/30 * * * *", verificarCidadesNull.job);
}
