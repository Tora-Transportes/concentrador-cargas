import { Request, Response } from "express";
import { MotoristasRepository } from "../repositories/MotoristasRepository";

interface IMotoristasController {
  findByCpf(req: Request, res: Response): Promise<Response>;
}

class MotoristasController implements IMotoristasController {
  isValidCpf = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return false;
    }

    sum = 0;

    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    return remainder === parseInt(cpf.substring(10, 11));
  };

  findByCpf = async (req: Request, res: Response): Promise<Response> => {
    const { cpf } = req.params;
    if (!cpf) {
      return res
        .status(400)
        .json({ message: "CPF requerido", motorista: null });
    }

    if (!this.isValidCpf(cpf)) {
      return res.status(400).json({ message: "CPF inválido", motorista: null });
    }

    const motoristaRepository = new MotoristasRepository();
    const result = await motoristaRepository.findCategoryByCpf(
      cpf.replace(".", "").replace(".", "").replace("-", "")
    );
    return res
      .status(result.status)
      .json({ message: result.message, motorista: result.motoristas });
  };
}

export default new MotoristasController();
