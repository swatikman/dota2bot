interface MatchRepository {

    findUpcomingMatches(limit: number, offset: number);

    findLiveMatches(limit: number, offset: number);

    findPastMatches(limit: number, offset: number);

    findMatchById(matchId: number);

    findUpcomingTeamMatches(teamId: number, limit: number, offset: number);

    findUpcomingTournamentMatches(tournamentId: number, limit: number, offset: number);

    saveMatches(matches: Array<any>);
    
    findMatchWithTournamentInfoById(matchId: number);

    findMatchesThatStartLessThanInHour();
}

export { MatchRepository }
