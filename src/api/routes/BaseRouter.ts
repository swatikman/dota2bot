import * as express from "express";
import { TeamsRouter } from "./TeamsRouter";
import { MatchesRouter } from './MatchesRouter';
import { TournamentsRouter } from './TournamentsRouter';
import { UsersRouter } from "./UserRouter";
import { SubscriptionsRouter } from "./SubscriptionsRouter";
import { auth } from "../middleware/auth";

export class BaseRouter {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    getRouter() : express.Router {
        return this.router;
    }

    
    initializeRoutes() {
        this.router.use('/teams', TeamsRouter.extractRouter());
        this.router.use('/matches', MatchesRouter.extractRouter());
        this.router.use('/tournaments', TournamentsRouter.extractRouter());
        this.router.use('/', UsersRouter.extractRouter());
        this.router.use('/subscriptions', auth, SubscriptionsRouter.extractRouter());
        
    }
}