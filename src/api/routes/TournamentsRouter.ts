import { Response, Request } from "express";
import * as express from "express";
import { ROUTERS_TYPES, CONTROLLERS_TYPES } from "../../di/Types";
import { container } from "../../di/Container";
import { injectable, inject } from "inversify";
import { TournamentsController } from "../controllers/TournamentsController";

@injectable()
export class TournamentsRouter {

    constructor(@inject(CONTROLLERS_TYPES.TOURNAMENT) private controller: TournamentsController) {
    }

    private get = (req: Request, res: Response) => {
        this.controller.get(req, res)
    }

    private getOne = (req: Request, res: Response) => {
        this.controller.getOne(req, res)
    }

    private post = (req: Request, res: Response) => {
        res.send('Danke schon fur Deine request');
    }

    private delete = (req: Request, res: Response) => {
        res.send('Danke schon fur Deine request');
    }

    static extractRouter() {
        const tournamentsRouter: TournamentsRouter = container.get<TournamentsRouter>(ROUTERS_TYPES.TOURNAMENT);
        const router: express.Router = express.Router();
        router.get('/', tournamentsRouter.get);
        router.get('/:id', tournamentsRouter.getOne);
        router.post('/', tournamentsRouter.post);
        router.delete('/', tournamentsRouter.delete);
        return router; 
    }
}