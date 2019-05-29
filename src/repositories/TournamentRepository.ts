
interface TournamentRepository {
    findTournamentById(tournamentId: number);

    saveTournaments(tournaments: Array<any>);

    findTournamentsByPartialName(name: string, limit: number, offset: number);

    findTounaments(limit: number, offset: number);
}

export { TournamentRepository }

