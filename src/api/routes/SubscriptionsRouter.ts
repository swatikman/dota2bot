import { Response, Request } from "express";
import * as express from "express";
import { ROUTERS_TYPES, CONTROLLERS_TYPES } from "../../di/Types";
import { container } from "../../di/Container";
import { injectable, inject } from "inversify";
import { SubscriptionsController } from "../controllers/SubscriptionsController";
import { check } from "express-validator/check";
import { validator } from "../middleware/validator";

@injectable()
export class SubscriptionsRouter {

    constructor(@inject(CONTROLLERS_TYPES.SUBSCRIPTION) private controller: SubscriptionsController) {
    }

    private get = (req: Request, res: Response) => {
        this.controller.get(req, res)
    }

    private getOne = (req: Request, res: Response) => {
        this.controller.getOne(req, res)
    }

    private create = (req: Request, res: Response) => {
        this.controller.create(req, res);
    }

    private update = (req: Request, res: Response) => {
        this.controller.update(req, res);
    }

    private delete = (req: Request, res: Response) => {
        res.send('Danke schon fur Deine request');
    }

    static extractRouter() {
        const subscriptionsRouter: SubscriptionsRouter = container.get<SubscriptionsRouter>(ROUTERS_TYPES.SUBSCRIPTION);
        const router: express.Router = express.Router();
        router.get('/', subscriptionsRouter.get);
        router.get('/:id', [check('id').isInt()], validator, subscriptionsRouter.getOne);
        router.post('/', [check('userId').isInt(), check('teamId').isInt()], subscriptionsRouter.create);
        router.put('/:id', subscriptionsRouter.update);
        router.delete('/', subscriptionsRouter.delete);
        return router;
    }
}