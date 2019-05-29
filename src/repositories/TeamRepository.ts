
interface TeamRepository {
    findTeamById(teamId: number);

    saveTeams(team);

    findTeams(limit: number, offset: number);
    
    findTeamsByPartialName(name: string, limit?: number, offset?: number);

    findTeamsById(teamsIds: Array<number>);

}

export { TeamRepository }

