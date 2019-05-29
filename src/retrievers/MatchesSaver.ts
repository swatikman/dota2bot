import { PandaApi } from "../PandaAPI";
import { inject, injectable } from "inversify";
import { DATABASE_TYPES, PANDA_API } from './../di/Types';
import { MatchRepository } from "../repositories/MatchRepository";

@injectable()
export class MatchesSaver {
    constructor(@inject(DATABASE_TYPES.MATCH) private matchRepository: MatchRepository,
                @inject(PANDA_API.PANDA) private pandaApi: PandaApi) {
    }

    async getAndSaveFutureMatches() {
        let matches = await this.getFutureMatches();
        await this.matchRepository.saveMatches(matches);
        console.log('Future Matches are saved')

        matches = await this.getPastMatches();
        await this.matchRepository.saveMatches(matches);
    }

    async getFutureMatches() {
        const res = await this.pandaApi.getUpcomingMatches();
        return this.parseMatches(res.data);
    }

    async getPastMatches() {
        const res = await this.pandaApi.getPastMatches();
        return this.parseMatches(res.data);
    }

    parseMatches(matches) {
        const parsedMatches = [];
        for (let match of matches) {
            const opponents = match.opponents;
            const beginAt = match.begin_at;

            const data = {
                id: match.id,
                numberofgames: match.number_of_games,
                tournamentid: match.serie_id,
                beginat: beginAt,
                team1id: -1,
                team2id: -1,
                winner_id: -1
            };
            if (opponents
                && opponents[0] && opponents[0].type === 'Team'
                && opponents[1] && opponents[1].type === 'Team') {
                data.team1id = opponents[0].opponent.id;
                data.team2id = opponents[1].opponent.id;
            }
            data.winner_id = (match.winner_id) ? match.winner_id : -1; 

            parsedMatches.push(data);
        }
        return parsedMatches;
    }
}