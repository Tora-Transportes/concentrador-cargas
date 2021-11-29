import fs from "fs";
import path from "path";
import axios from "axios";

export class LocaisRepository {
  protected cachePath: string;

  constructor() {
    this.cachePath = path.resolve(__dirname, "..", "..", "cache");
    if (!fs.existsSync(this.cachePath)) {
      fs.mkdirSync(this.cachePath);
    }
  }
  async getPaisesEstados() {
    const filename = path.resolve(this.cachePath, "PAISES_ESTADOS.json");
    let allCountries;
    if (!fs.existsSync(filename)) {
      allCountries = (
        await axios.get("https://countriesnow.space/api/v0.1/countries/states")
      ).data.data;

      fs.writeFileSync(filename, JSON.stringify(allCountries));
    } else {
      allCountries = JSON.parse(fs.readFileSync(filename).toString());
    }

    return allCountries;
  }

  async getCidades(pais: string, estado: string) {
    const filename = path.resolve(
      this.cachePath,
      `PAISES_ESTADOS_${pais.toUpperCase()}_${estado.toUpperCase()}.json`
    );
    let cidades;
    if (!fs.existsSync(filename)) {
      cidades = (
        await axios.post(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          {
            country: pais,
            state: estado,
          }
        )
      ).data.data;

      fs.writeFileSync(filename, JSON.stringify(cidades));
    } else {
      cidades = JSON.parse(fs.readFileSync(filename).toString());
    }

    return cidades;
  }
}
// async function teste() {
//   console.log(
//     await new LocaisRepository().getCidades("BRAZIL", "MINAS GERAIS")
//   );
// }

// teste();
