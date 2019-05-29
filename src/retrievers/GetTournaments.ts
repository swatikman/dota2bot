import { PandaApi } from "../PandaAPI";
import { DATABASE_TYPES, PANDA_API } from './../di/Types';
import { TournamentRepository } from "../repositories/TournamentRepository";
import { inject, injectable } from "inversify";

@injectable()
export class GetTournaments {
    
    constructor(@inject(DATABASE_TYPES.TOURNAMENT) private tournamentRepository: TournamentRepository,
                @inject(PANDA_API.PANDA) private pandaApi: PandaApi) {
    }

    async getTournamentsAndSaveToDb() {
        try {
            for (let i = 1; i <= 5; i++) {
                const res = await this.pandaApi.getSeries(i);
                const tournaments = res.data;
                if (tournaments.length === 0) {
                    console.log('No more tournaments found');
                    break;
                }
                const tournamentsToSave = [];
                for (let tournament of tournaments) {
                    let tournamentToSave = {
                        id: tournament.id,
                        full_name: tournament.slug.replace(/-/g, ' '),
                        begin_at: tournament.begin_at,
                        end_at: tournament.end_at,
                        winner_id: -1
                    };
                    if (tournament.winner_type === 'Team') {
                        tournamentToSave.winner_id = tournament.winner_id;
                    }
                    tournamentsToSave.push(tournamentToSave);
                }
                await this.tournamentRepository.saveTournaments(tournamentsToSave);
                console.log('Tournaments are saved. Page ' + i);
            }
        } catch (error) {
            console.log('Error while saving tournaments: ', error.message);
        }
    }
}
