import { injectable } from "inversify";
import { TournamentRepository } from "./TournamentRepository";
import { PostgresRepository } from "./PostgresRepository";

@injectable()
class PostgresTournamentRepository extends PostgresRepository implements TournamentRepository {


    constructor() {
        super();
    }

    async findTournamentById(tournamentId: number) {
        return this.database.one(`SELECT * FROM tournaments WHERE id = ${tournamentId}`);
    }

    async saveTournaments(tournaments: Array<any>) {
        const columns = ['id', 'full_name', 'winner_id', 'begin_at', 'end_at'];
        return await this.database.upsert(columns, 'tournaments', tournaments);
    }

    async findTournamentsByPartialName(name: string, limit = 10, offset = 0) {
        return this.database.query(`SELECT * FROM tournaments WHERE lower(full_name) LIKE lower('%${name}%') LIMIT ${limit} OFFSET ${offset}`);
    }

    async findTounaments(limit: number = 10, offset: number = 0) {
        return this.database.query(`SELECT * FROM tournaments LIMIT ${limit} OFFSET ${offset}`);
    }
}

export { PostgresTournamentRepository }
