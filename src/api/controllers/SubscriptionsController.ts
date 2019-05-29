import * as express from "express";
import { injectable, inject } from "inversify";
import { DATABASE_TYPES } from './../../di/Types';
import { SubscriptionRepository } from "../../repositories/SubscriptionRepository";
import { getLimitAndOffset } from "../../utils";

@injectable()
export class SubscriptionsController {

    constructor(@inject(DATABASE_TYPES.SUBSCRIPTION) private subscriptionsRepository: SubscriptionRepository) {

    }

    async get(req: express.Request, res: express.Response) {
        const userId = (<any>req).user.userId;
        const { limit, offset } = getLimitAndOffset(req.query)
        const userSubscriptions = await this.subscriptionsRepository.getUserSubscriptions(userId, limit, offset);
        res.send(userSubscriptions);
    }

    async getOne(req: express.Request, res: express.Response) {
        const userId = (<any>req).user.userId;
        try {
            const subscription = await this.subscriptionsRepository.findSubscriptionById(req.params.id);
            if (subscription.userid === userId) {
                res.send(subscription);
            } else {
                res.status(401).send({ error: 'User can see only his own subscriptions' });
            }
        } catch (err) {
            res.status(404).send({ error: 'No subscription with such id was found' });
        }
       
    }

    create(req: express.Request, res: express.Response) {
        throw new Error("Method not implemented.");
    }

    update(req: express.Request, res: express.Response) {
        throw new Error("Method not implemented.");
    }



}