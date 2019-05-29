import { container } from '../../di/Container';
import { Response, Request } from "express";
import * as express from "express";
import { inject, injectable } from "inversify";
import { CONTROLLERS_TYPES, ROUTERS_TYPES } from './../../di/Types';
import { UsersController } from './../controllers/UsersController';

@injectable()
export class UsersRouter {

    constructor(@inject(CONTROLLERS_TYPES.USER) private controller: UsersController) {
    }

    private login = (req: Request, res: Response) => {
        this.controller.login(req, res);
    }

    static extractRouter() {
        const usersRouter: UsersRouter = container.get<UsersRouter>(ROUTERS_TYPES.USER);
        const router: express.Router = express.Router();
        router.post('/login', usersRouter.login);
        return router; 
    }
}