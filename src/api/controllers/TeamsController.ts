import * as express from "express";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { DATABASE_TYPES } from './../../di/Types';
import { TeamRepository } from './../../repositories/TeamRepository';
import { getLimitAndOffset } from "../../utils";
import * as xml from 'xml';
import * as js2xmlparser from 'js2xmlparser';
import { parseString } from 'xml2js';

@injectable()
export class TeamsController {

    constructor(@inject(DATABASE_TYPES.TEAM) private teamsRepository: TeamRepository) {

    }

    async get(request: express.Request, response: express.Response) {
        const { limit, offset } = getLimitAndOffset(request.query);
        let teams: Array<any>;
        if (request.query.search) {
            teams = await this.teamsRepository.findTeamsByPartialName(request.query.search, limit, offset);
        } else {
            teams = await this.teamsRepository.findTeams(limit, offset);
        }
        response.type('application/xml');
        response.send(js2xmlparser.parse("response", teams));
    }

    async getOne(req: express.Request, res: express.Response) {
        try {
            const team = await this.teamsRepository.findTeamById(req.params.id);
            res.send(team);
        } catch (err) {
            res.status(404).send({ error: 'No team with such id was found'});
        }
    }
    
    async post(req: express.Request, res: express.Response) {
        // res.send({ error: 'Not implemented'});
        try {
            await this.teamsRepository.saveTeams([{ id: 99999, name: 'TeamZNTU', image_url: 'image'}]);
            res.send('loaded');
        } catch (err) {
            res.status(400).send(err);
        }
    }
    
    async delete(req: express.Request, res: express.Response) {
        res.send({ error: 'Not implemented'});    
    }
}