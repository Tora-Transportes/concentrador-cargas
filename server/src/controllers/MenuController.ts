import { Request, Response } from "express";
import { MenuRepository } from "../repositories/MenuRepository";

interface IMenuController {
  index(req: Request, res: Response): Promise<Response>;
}

class MenuController implements IMenuController {
  async index(req: Request, res: Response): Promise<Response> {
    const menuRepository = new MenuRepository();
    const result = await menuRepository.index();
    return res.json(result);
  }
}

export default new MenuController();
