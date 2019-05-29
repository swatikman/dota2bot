import { container } from '../../di/Container';
import { Response, Request } from "express";
import * as express from "express";
import { inject, injectable } from "inversify";
import { CONTROLLERS_TYPES, ROUTERS_TYPES } from './../../di/Types';
import { MatchesController } from './../controllers/MatchesController';
import { check } from 'express-validator/check';
import { validator } from '../middleware/validator';

@injectable()
export class MatchesRouter {

    private controller: MatchesController;

    constructor(@inject(CONTROLLERS_TYPES.MATCH) controller: MatchesController) {
        this.controller = controller;
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
        const matchesRouter: MatchesRouter = container.get<MatchesRouter>(ROUTERS_TYPES.MATCH);
        const router: express.Router = express.Router();
        router.get('/',
                [ check('limit').optional().isInt({ min: 1 }), 
                  check('offset').optional().isInt({ min: 1 }) ], validator, 
                matchesRouter.get);
        router.get('/:id', 
                check('id').isInt(), validator,
                matchesRouter.getOne)
        router.post('/', matchesRouter.post);
        router.delete('/', matchesRouter.delete);
        return router; 
    }
}