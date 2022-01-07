import dotenv from "dotenv";
dotenv.config();
import verificarCadastro from "./rotas/verificarCadastro";
import popularCoordenadas from "./coordenadas/ServiceCoordinates";

if (Number(process.env.RUN_JOBS) === 1) {
  console.log(`Iniciando o job "Verificar cadastro de rotas"`);
  verificarCadastro();
  console.log(`Iniciando o job "Popular coordenadas veiculos"`);
  popularCoordenadas();
}
