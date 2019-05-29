import { Container } from 'inversify';
// require("reflect-metadata");

import { TeamsController } from '../api/controllers/TeamsController';

import { TeamsRouter } from '../api/routes/TeamsRouter';

import { PostgresTeamRepository } from '../repositories/PostgresTeamRepositoryTs';

import { CONTROLLERS_TYPES, ROUTERS_TYPES, DATABASE_TYPES, RETRIEVERS, NOTIIFICATOR, PANDA_API } from './Types';
import { TeamRepository } from '../repositories/TeamRepository';
import { TournamentRepository } from '../repositories/TournamentRepository';
import { MatchRepository } from '../repositories/MatchRepository';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { PostgresMatchRepository } from '../repositories/PostgresMatchRepository';
import { PostgresSubscriptionRepository } from '../repositories/PostgresSubscriptionRepository';
import { PostgresTournamentRepository } from '../repositories/PostgresTournamentRepository';
import { PostgresUserRepository } from '../repositories/PostgresUserRepository';
import { MatchesController } from '../api/controllers/MatchesController';
import { SubscriptionsController } from './../api/controllers/SubscriptionsController';
import { TournamentsController } from './../api/controllers/TournamentsController';
import { UsersController } from './../api/controllers/UsersController';
import { MatchesRouter } from './../api/routes/MatchesRouter';
import { GetTournaments } from '../retrievers/GetTournaments';
import { GetTeams } from './../retrievers/GetTeams';
import { MatchesSaver } from '../retrievers/MatchesSaver';
import { ApiRetriever } from './../ApiRetriever';
import { Notificator } from '../Notificator';
import { TournamentsRouter } from '../api/routes/TournamentsRouter';
import { UsersRouter } from './../api/routes/UserRouter';
import { SubscriptionsRouter } from '../api/routes/SubscriptionsRouter';
import { PandaApi } from './../PandaAPI';
import Config = require('../Config');

const container: Container = new Container();

container.bind<MatchRepository>(DATABASE_TYPES.MATCH).to(PostgresMatchRepository);
container.bind<SubscriptionRepository>(DATABASE_TYPES.SUBSCRIPTION).to(PostgresSubscriptionRepository);
container.bind<TeamRepository>(DATABASE_TYPES.TEAM).to(PostgresTeamRepository);
container.bind<TournamentRepository>(DATABASE_TYPES.TOURNAMENT).to(PostgresTournamentRepository);
container.bind<UserRepository>(DATABASE_TYPES.USER).to(PostgresUserRepository);

container.bind<MatchesController>(CONTROLLERS_TYPES.MATCH).to(MatchesController);
container.bind<SubscriptionsController>(CONTROLLERS_TYPES.SUBSCRIPTION).to(SubscriptionsController);
container.bind<TeamsController>(CONTROLLERS_TYPES.TEAM).to(TeamsController);
container.bind<TournamentsController>(CONTROLLERS_TYPES.TOURNAMENT).to(TournamentsController);
container.bind<UsersController>(CONTROLLERS_TYPES.USER).to(UsersController);

container.bind<MatchesRouter>(ROUTERS_TYPES.MATCH).to(MatchesRouter);
container.bind<TeamsRouter>(ROUTERS_TYPES.TEAM).to(TeamsRouter);
container.bind<SubscriptionsRouter>(ROUTERS_TYPES.SUBSCRIPTION).to(SubscriptionsRouter);
container.bind<TournamentsRouter>(ROUTERS_TYPES.TOURNAMENT).to(TournamentsRouter);
container.bind<UsersRouter>(ROUTERS_TYPES.USER).to(UsersRouter);

container.bind<ApiRetriever>(RETRIEVERS.API_RETRIEVER).to(ApiRetriever);
container.bind<GetTournaments>(RETRIEVERS.TOURNAMENTS).to(GetTournaments);
container.bind<GetTeams>(RETRIEVERS.TEAMS).to(GetTeams);
container.bind<MatchesSaver>(RETRIEVERS.MATCHES).to(MatchesSaver);

container.bind<Notificator>(NOTIIFICATOR).to(Notificator);

container.bind<PandaApi>(PANDA_API.PANDA).to(PandaApi);
container.bind<string>(PANDA_API.TOKEN).toConstantValue(Config.PANDA_API_TOKEN);


export { container };