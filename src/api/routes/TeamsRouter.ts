import { container } from '../../di/Container';
import { Response, Request } from "express";
import * as express from "express";
import { inject, injectable } from "inversify";
import { TeamsController } from './../controllers/TeamsController';
import { CONTROLLERS_TYPES, ROUTERS_TYPES } from './../../di/Types';

@injectable()
export class TeamsRouter {

    constructor(@inject(CONTROLLERS_TYPES.TEAM) private controller: TeamsController) {
    }

    private get = (req: Request, res: Response) => {
        this.controller.get(req, res);
    }
    
    private getOne = (req: Request, res: Response) => {
        this.controller.getOne(req, res);
    }

    private post = (req: Request, res: Response) => {
        this.controller.post(req, res);
    }

    private delete = (req: Request, res: Response) => {
        this.controller.delete(req, res);
    }
    

    static extractRouter() {
        const teamsRouter: TeamsRouter = container.get<TeamsRouter>(ROUTERS_TYPES.TEAM);
        const router: express.Router = express.Router();
        router.get('/', teamsRouter.get);
        router.get('/:id', teamsRouter.getOne);
        router.post('/', teamsRouter.post);
        router.delete('/', teamsRouter.delete);
        return router; 
    }
}