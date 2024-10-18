import { Request, Response } from "express";
import { SqedRepository } from "../../repositories/Sqed/SqedRepository";

interface ISqedController {
  getUsers(req: Request, res: Response): Promise<Response>;
  updateUsers(req: Request, res: Response): Promise<Response>;
  deleteUsers(req: Request, res: Response): Promise<Response>;
}

class SqedController implements ISqedController {
  async getUsers(req: Request, res: Response): Promise<Response> {
    const sqedRepository = new SqedRepository();
    try {
      const { limit, status } = req.query;

      if (!limit || !status) {
        return res
          .status(400)
          .json({ message: "Parâmetros 'limit' e 'status' são obrigatórios." });
      }

      const users = await sqedRepository.index(Number(limit), Number(status));
      return res.status(200).json({ users: users });
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return res.status(500).json({ message: "Erro ao buscar usuários." });
    }
  }
  async updateUsers(req: Request, res: Response): Promise<Response> {
    const sqedRepository = new SqedRepository();
    try {
      const { users } = req.body;

      if (!users || users.length === 0) {
        return res
          .status(400)
          .json({ message: "A lista de usuários é obrigatória." });
      }

      await sqedRepository.update(users);
      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao atualizar status dos usuários:", error);
      return res
        .status(500)
        .json({ message: "Erro ao atualizar status dos usuários." });
    }
  }

  async deleteUsers(req: Request, res: Response): Promise<Response> {
    const sqedRepository = new SqedRepository();
    try {
      const { users } = req.body;

      if (!users || users.length === 0) {
        return res
          .status(400)
          .json({ message: "A lista de CPFs de usuários é obrigatória." });
      }

      await sqedRepository.delete(users);
      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar usuários:", error);
      return res.status(500).json({ message: "Erro ao deletar usuários." });
    }
  }
}

export default new SqedController();
