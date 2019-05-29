import { inject, injectable } from "inversify";
import { RETRIEVERS } from "./di/Types";
import { GetTeams } from "./retrievers/GetTeams";
import { GetTournaments } from "./retrievers/GetTournaments";
import { MatchesSaver } from "./retrievers/MatchesSaver";

const cron = require('node-cron');

@injectable()
export class ApiRetriever {

    constructor(@inject(RETRIEVERS.TOURNAMENTS) private getTournaments: GetTournaments,
            @inject(RETRIEVERS.TEAMS) private getTeams: GetTeams,
            @inject(RETRIEVERS.MATCHES) private getMatches: MatchesSaver) {
    }

    cronRetrieveAllData() {
        // this.getTournaments.getTournamentsAndSaveToDb();

        // this.getTeams.getTeamsAndSaveToDb();

        // this.getMatches.getAndSaveFutureMatches();
        cron.schedule('*/5 * * * *', async () => {
            await this.getTournaments.getTournamentsAndSaveToDb();

            await this.getTeams.getTeamsAndSaveToDb();

            await this.getMatches.getAndSaveFutureMatches();
            console.log('Updated teams and matches... ' + new Date().toLocaleString('de-DE'));
        });
    }
}

