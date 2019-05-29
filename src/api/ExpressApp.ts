import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { injectable } from 'inversify';
import { resolve } from 'path';
import { BaseRouter } from './routes/BaseRouter';

@injectable()
export class ExpressApp {
    
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
    }

    private initializeMiddlewares() {
        this.app.use(express.static('S:/ProgrammingProjects/NodeJs/dota2bot/dota2bot/src/frontend/dist'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors({
            exposedHeaders: 'x-auth-token'
        }));
        const routes = new BaseRouter();

        this.app.use('/api', routes.getRouter());

        this.app.get('*', (req, res) => {
            // const path = resolve('./../frontend/dist/index.html');
            const path = 'S:/ProgrammingProjects/NodeJs/dota2bot/dota2bot/src/frontend/dist/index.html';
            // console.log(path);
            res.sendFile(path);
        });
    }

    public use(path: string, router: express.Router) {
        this.app.use(path, router);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}