import { MatchRepository } from "./MatchRepository";
import { PostgresRepository } from "./PostgresRepository";
import { injectable } from "inversify";

@injectable()
export class PostgresMatchRepository extends PostgresRepository implements MatchRepository {


    constructor() {
        super();
    }

    async findMatchById(matchId) {
        return this.database.one(`SELECT * FROM matches WHERE id = ${matchId}`);
    }

    async findMatchWithTournamentInfoById(matchId) {
        return this.database.one(`SELECT * FROM matches INNER JOIN tournaments 
        ON matches.tournamentid = tournaments.id WHERE matches.id = ${matchId}`);
    }

    async findUpcomingTeamMatches(teamId, limit = 10, offset = 0) {
        return this.database.query(`SELECT * FROM matches WHERE (team1Id = ${teamId} 
        OR team2Id = ${teamId}) AND beginat > now() LIMIT ${limit} OFFSET = ${offset}`);
    }

    async findUpcomingTournamentMatches(tournamentId, limit = 10, offset = 0) {
        return this.database.query(`SELECT * FROM matches WHERE tournamentId = ${tournamentId} 
        AND beginat > now() LIMIT ${limit} OFFSET ${offset}`);
    }

    async saveMatches(matches) {
        if (!matches || matches.length < 1) return;
        let columns = ['id', 'team1id', 'team2id', 'tournamentid', 'numberofgames', 'beginat'];
        return this.database.upsert(columns, 'matches', matches);
    }

    async findUpcomingMatches(limit: number = 10, offset: number = 0) {
        return this.database.query(`SELECT 
                m.*, to_json(t1.*) AS team1, to_json(t2.*) AS team2
                FROM matches AS m
                JOIN teams AS t1 ON m.team1id = t1.id
                JOIN teams AS t2 ON m.team2id = t2.id
                WHERE m.beginat > NOW() LIMIT ${limit} OFFSET ${offset}`);
    }


    async findLiveMatches(limit: number = 10, offset: number = 0) {
        return this.database.query(`SELECT m.*, to_json(t1.*) AS team1, to_json(t2.*) AS team2
                FROM matches AS m
                JOIN teams AS t1 ON m.team1id = t1.id
                JOIN teams AS t2 ON m.team2id = t2.id
                WHERE winner_id = -1 AND beginat < now() LIMIT ${limit} OFFSET ${offset}`);
    }

    async findPastMatches(limit: number = 10, offset: number = 0) {
        return this.database.query(`SELECT m.*, to_json(t1.*) AS team1, to_json(t2.*) AS team2
                FROM matches AS m
                JOIN teams AS t1 ON m.team1id = t1.id
                JOIN teams AS t2 ON m.team2id = t2.id
                WHERE winner_id != -1 LIMIT ${limit} OFFSET ${offset}`);
    }

    async findMatchesThatStartLessThanInHour() {
        return this.database.query(`SELECT * FROM matches WHERE beginat > NOW() AND beginat < NOW() + INTERVAL '1 HOUR'`);
    }
}