import { PostgresRepository } from "./PostgresRepository";
import { TeamRepository } from "./TeamRepository";

const { injectable} = require("inversify");

@injectable()
class PostgresTeamsRepository extends PostgresRepository implements TeamRepository {

    constructor() {
        super();
    }

    async findTeamById(teamId: number) {
        return this.database.one(`SELECT * FROM teams WHERE id = ${teamId}`);
    }

    async findTeamsById(teamsIds) {
        var ids = '';
        for (let i = 0; i < teamsIds.length; i++){
            ids += teamsIds[i];
            if (i + 1 < teamsIds.length) {
                ids += ',';
            }
        }
        return this.database.query(`SELECT * FROM teams WHERE id in (${ids})`);
    }


    async saveTeams(teams) {
        const columns = ['id', 'name', 'image_url'];
        return await this.database.upsert(columns, 'teams', teams);
    }

    async findTeamsByPartialName(name: string, limit: number = 10, offset: number = 0) {
        return this.database.query(`SELECT * FROM teams WHERE lower(name) LIKE lower('%${name}%') LIMIT ${limit} OFFSET ${offset}`);
    }

    async findTeams(limit: number = 10, offset: number = 0) {
        return this.database.query(`SELECT * FROM teams LIMIT ${limit} OFFSET ${offset}`);
    }
    
}

export { PostgresTeamsRepository as PostgresTeamRepository };