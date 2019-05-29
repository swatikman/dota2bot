import * as express from "express";
import { injectable, inject } from "inversify";
import { DATABASE_TYPES } from './../../di/Types';
import { MatchRepository } from "../../repositories/MatchRepository";
import { getLimitAndOffset } from "../../utils";
import { TeamRepository } from "../../repositories/TeamRepository";
import * as _ from 'lodash';

@injectable()
export class MatchesController {

    constructor(@inject(DATABASE_TYPES.MATCH) private matchRepository: MatchRepository,
        @inject(DATABASE_TYPES.TEAM) private teamRepository: TeamRepository) {

    }

    async get(req: express.Request, res: express.Response) {
        const { limit, offset } = getLimitAndOffset(req.query);
        let matches = ''
        switch (req.query.type) {
            case 'live':
                matches = await this.getLive(limit, offset);
                break;
            case 'upcoming':
                matches = await this.getUpcoming(limit, offset);
                break;
            case 'past':
            case undefined:
                matches = await this.getPast(limit, offset);
                break;
            default:
                return res.status(400).send({ error: "Parameter 'type' is wrong. Possible params: 'live', 'past', 'upcoming' "});
        }
        res.send(_.map(matches, item => _.pick(item, [ 'id', 'tournamentid', 'numberofgames', 'beginat', 'team1', 'team2' ])));
    }

    async getPast(limit: number, offset: number) {
        return await this.matchRepository.findPastMatches(limit, offset);
    }
    
    async getUpcoming(limit: number, offset: number) {
        return await this.matchRepository.findUpcomingMatches(limit, offset);
    }
    
    async getLive(limit: number, offset: number) {
        return await this.matchRepository.findLiveMatches(limit, offset);
    }

    async getOne(req: express.Request, res: express.Response) {
        const id = req.params.id;
        console.log(id);
        const match =  await this.matchRepository.findMatchById(id);
        res.send(id);
    }

    post(req: express.Request, res: express.Response) {
        throw new Error("Method not implemented.");
    }

    delete(req: express.Request, res: express.Response) {
        throw new Error("Method not implemented.");
    }

}