import { ServiceDistanceLocations } from "../services/ServiceDistanceLocations";
import { RotasPendentesRepository } from "../repositories/RotasPendentesRepository";
import AppError from "../models/AppError";

export class UseCaseGetDistanceBetween {
  async run(search: Record<string, any>) {
    const clone = { ...search };
    for (const i in clone) {
      clone[i] = clone[i]?.toUpperCase();
    }
    const { cidade_origem, cidade_destino, estado_origem, estado_destino } =
      clone;
    if (estado_origem.length !== 2 || estado_destino.length !== 2) {
      throw new AppError("Deve ser informado a sigla dos estados", 400);
    }
    const service = new ServiceDistanceLocations();
    const distance = await service.find({
      cidade_origem,
      cidade_destino,
      estado_origem,
      estado_destino,
    });

    if (distance === null) {
      const rotasRepository = new RotasPendentesRepository();
      const rota = await rotasRepository.findByNames({
        cidade_origem,
        cidade_destino,
        estado_origem,
        estado_destino,
      });

      if (!rota) {
        const id = await rotasRepository.getNextId();
        await rotasRepository.create({
          id,
          cidade_origem,
          cidade_destino,
          estado_origem,
          estado_destino,
        });
      }
      throw new AppError(
        "Não existe nenhuma rota cadastrada entre esses dois pontos",
        404
      );
    }

    return distance;
  }
}

export class UseCaseListPendentRoutes {
  async run(filter: Record<string, any>) {
    const rotasRepository = new RotasPendentesRepository();
    const { page } = filter;
    const clone = { ...filter };
    for (const i in clone) {
      if (clone[i] && isNaN(Number(clone[i]))) {
        clone[i] = String(clone[i]).toUpperCase();
      }
    }
    let currentPage = 1;
    if (!isNaN(Number(page))) {
      currentPage = Number(page);
    }
    const rotas = await rotasRepository.search(
      { ...filter, page: undefined },
      currentPage
    );
    return rotas;
  }
}
