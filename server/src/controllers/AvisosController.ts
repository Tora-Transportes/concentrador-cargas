import { Request, Response } from "express";

interface IAvisosController {
    index(req: Request, res: Response): Promise<Response> ;
}


class AvisosController implements IAvisosController {
    async index(req: Request, res: Response): Promise<Response>  {

        return res.json("este index ok")
    }
}

export default new AvisosController();