import dotenv from "dotenv";
dotenv.config();
import verificarCadastro from "./rotas/verificarCadastro";
import popularCoordenadas from "./coordenadas/ServiceCoordinates";
import limparLotes from "./cargas/limparLotes";
import emViagemCargas from "./cargas/emViagemCargas";
import atualizaCidadesNullCoordenadas from "./coordenadas/AtualizaCidadesNull";
import finalizarCargaCsn from "./cargas/finalizarCargaCsn";

if (Number(process.env.RUN_JOBS) === 1) {
  console.log(`Iniciando o job "Verificar cadastro de rotas"`);
  verificarCadastro();
  console.log(`Iniciando o job "Popular coordenadas veiculos"`);
  popularCoordenadas();
  console.log(`Iniciando o job "Limpar lotes"`);
  limparLotes();
  console.log(`Iniciando o job "Em viagem cargas"`);
  emViagemCargas();
  console.log(
    "Iniciando o job 'Atualizar cidades valor null coordenadas veiculos'"
  );
  atualizaCidadesNullCoordenadas();
}
console.log("Inicio job finalização carga csn");
finalizarCargaCsn();
