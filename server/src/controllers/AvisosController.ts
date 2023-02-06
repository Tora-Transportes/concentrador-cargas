import { Request, Response } from "express";

interface IAvisosController {
  create(req: Request, res: Response): Promise<Response>;
  index(req: Request, res: Response): Promise<Response>;
  search(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
}

class AvisosController implements IAvisosController {
  async create(req: Request, res: Response): Promise<Response> {
    return res.json({ message: "Criado com sucesso !", result: req.body });
  }
  async index(req: Request, res: Response): Promise<Response> {
    return res.json({ mess: "este index ok", id: req.params.id });
  }
  async search(req: Request, res: Response): Promise<Response> {
    return res.json("search com  sucesso");
  }
  async update(req: Request, res: Response): Promise<Response> {
    console.log("aqui>>>>>>", req.params.id);

    return res.json({ mess: "UPDATE OK", id: req.params.id, result: req.body });
  }
  async delete(req: Request, res: Response): Promise<Response> {
    return res.json({ mess: "DELETE OK", id: req.params.id });
  }
}

export default new AvisosController();
