import { RotasPendentesRepository } from "../../repositories/RotasPendentesRepository";
import { ServiceDistanceLocations } from "../../services/ServiceDistanceLocations";

// RODA A CADA 10 MINUTOS
export default function run() {
  const TIME_TO_RUN = 1000 * 60 * 5;
  setInterval(async () => {
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
  }, TIME_TO_RUN);
}
