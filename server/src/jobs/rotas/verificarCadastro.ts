import { RotasPendentesRepository } from "../../repositories/RotasPendentesRepository";
import { ServiceDistanceLocations } from "../../services/ServiceDistanceLocations";
import cron from "node-cron";

// RODA A CADA 5 MINUTOS
export default function run() {
  cron.schedule("*/5 * * * *", async () => {
    console.log("--------------JOB ROTAS--------------");
    const rotasRepository = new RotasPendentesRepository();
    const serviceLocation = new ServiceDistanceLocations();
    let totalPages = 1;
    for (let page = 1; page <= totalPages; page++) {
      const rotasPendentes = await rotasRepository.search({}, page);
      totalPages = Number(rotasPendentes.total_pages);
      for (const rota of rotasPendentes.results) {
        const existe = await serviceLocation.find(rota);
        if (existe !== null) {
          await rotasRepository.delete(rota.id);
        }
      }
    }
    console.log("-----------FIM JOB ROTAS-------------");
  });
}
