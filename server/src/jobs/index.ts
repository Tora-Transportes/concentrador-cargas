import dotenv from "dotenv";
dotenv.config();
import verificarCadastro from "./rotas/verificarCadastro";

if (Number(process.env.RUN_JOBS) === 1) {
  console.log(`Iniciando o job "Verificar cadastro de rotas"`);
  verificarCadastro();
}
