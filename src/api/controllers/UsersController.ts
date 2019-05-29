import * as express from "express";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { DATABASE_TYPES } from './../../di/Types';
import { UserRepository } from "../../repositories/UserRepository";
import { generateToken } from "../../utils";

@injectable()
export class UsersController {

    constructor(@inject(DATABASE_TYPES.USER) private usersRepository: UserRepository) {

    }

    login(req: express.Request, res: express.Response) {
        console.log(req.body);
        if (req.body.login === '123' && req.body.password === 'password') {
            const token = generateToken(1)
            res.header('x-auth-token', token).send({ play: 'list' });
        } else {
            res.status(401).send({ error: 'Wrong login or password' });
        }
    }
}