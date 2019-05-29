import { PandaApi } from "../PandaAPI";
import { inject, injectable } from "inversify";
import { DATABASE_TYPES, PANDA_API } from './../di/Types';
import { TeamRepository } from "../repositories/TeamRepository";

@injectable()
export class GetTeams {

    constructor(@inject(DATABASE_TYPES.TEAM) private teamRepository: TeamRepository,
                @inject(PANDA_API.PANDA) private pandaApi: PandaApi) {
    }

    async getTeamsAndSaveToDb() {
        try {
            console.log('Saving teams from past tournaments');
            await this.getTournamentsTeamsAndSaveToDb(this.pandaApi.getPastTournaments.bind(this.pandaApi));
            console.log('Saving teams from live tournaments');
            await this.getTournamentsTeamsAndSaveToDb(this.pandaApi.getRunningTournaments.bind(this.pandaApi));
            console.log('Saving teams from upcoming tournaments');
            await this.getTournamentsTeamsAndSaveToDb(this.pandaApi.getUpcomingTournaments.bind(this.pandaApi));
            console.log('All teams are saved');
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    async getTournamentsTeamsAndSaveToDb(pandaApiFunction: Function, pages: number = 5) {
        for (let i = 1; i <= pages; i++) {
            const res = await pandaApiFunction(i);
            if (res.data.length === 0) {
                break;
            }
            const teams = this.getTeamsFromTournaments(res.data);
            await this.teamRepository.saveTeams(teams);
            console.log(`${teams.length} teams saved. Page ${i}`);
        }
    }

    getTeamsFromTournaments(tournaments: Array<any>) {
        const teamsToSave = new Map();
        for (let tournament of tournaments) {
            const teams = tournament.teams;
            
            for (let team of teams) {
                if (!teamsToSave.has(team.id) && team.name) {
                    teamsToSave.set(team.id, {
                        id: team.id,
                        name: team.name,
                        image_url: team.image_url
                    });
                }
            }
        }
        return Array.from(teamsToSave.values());
    }
}

