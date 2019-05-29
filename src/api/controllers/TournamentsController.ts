import * as express from "express";
import { injectable, inject } from "inversify";
import { DATABASE_TYPES } from './../../di/Types';
import { TournamentRepository } from "../../repositories/TournamentRepository";
import { getLimitAndOffset } from "../../utils";

@injectable()
export class TournamentsController {

    constructor(@inject(DATABASE_TYPES.TOURNAMENT) private tournamentsRepository: TournamentRepository) {

    }

    async get(req: express.Request, res: express.Response) {
        const { limit, offset } = getLimitAndOffset(req.query);
        let tournaments: Array<any>;
        if (req.query.search) {
            tournaments = await this.tournamentsRepository.findTournamentsByPartialName(req.query.search, limit, offset); 
        } else {
            tournaments = await this.tournamentsRepository.findTounaments(limit, offset);
        }
        res.send(tournaments);

    }

    async getOne(req: express.Request, res: express.Response) {
        const id = req.params.id;
        try {
            const tournament = await this.tournamentsRepository.findTournamentById(id);
            res.send(tournament);
        } catch (err) {
            return res.status(404).send({ error: 'Tournament with such id was not found'});
        }
    }

}