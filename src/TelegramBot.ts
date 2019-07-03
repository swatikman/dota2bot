const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const Telegraf = require('telegraf');
const WizardScene = require('telegraf/scenes/wizard');
const Stage = require('telegraf/stage');
const session = require('telegraf/session');
const utils = require('./utils');
import { MatchRepository } from './repositories/MatchRepository';
import { TeamRepository } from './repositories/TeamRepository';
import { TournamentRepository } from './repositories/TournamentRepository';
import { SubscriptionRepository as subscriptionRepository } from './repositories/SubscriptionRepository';
import { UserRepository as userRepository } from './repositories/UserRepository';
import { DATABASE_TYPES } from './di/Types';
import { container } from './di/Container';
import Config = require('./Config');
const matchRepository = container.get<MatchRepository>(DATABASE_TYPES.MATCH);
const teamRepository = container.get<TeamRepository>(DATABASE_TYPES.TEAM);
const tournamentRepository = container.get<TournamentRepository>(DATABASE_TYPES.TOURNAMENT);
const subscriptionRepository = container.get<subscriptionRepository>(DATABASE_TYPES.SUBSCRIPTION);
const userRepository = container.get<userRepository>(DATABASE_TYPES.USER);
// TODO: use constants everywhere
const TEAM = '/team';
const TEAM_SUBSCRIBE = '/team_subscribe';
const TEAM_UNSUBSCRIBE = '/team_unsubscribe';
const TEAM_MATCHES_OLD = '/team_matches_old';
const TEAM_MATCHES = '/team_matches';
const TOURNAMENT_MATCHES = '/tournament_matches';


export class TelegramBot {

    private bot: any;
    private userIds: Map<number, number> = new Map();

    constructor() {
        
        this.bot = new Telegraf(Config.TELEGRAM_BOT_TOKEN);
        this.setup();
    }

    setup() {
        const searchStage = this.createSearchStage();
        this.bot.use(session());
        this.bot.use(searchStage.middleware());

        this.bot.start(async (ctx) => {
            return this.onStart(ctx);
        });

        this.bot.hears('/status', (ctx) => {
            ctx.reply('Status: Active');
        });

        this.bot.hears(/\/subscribe_\d+$/, async (ctx) => this.subscribe(ctx));

        this.bot.hears(/\/unsubscribe_\d+$/, async (ctx) => this.unsubscribe(ctx));

        this.bot.hears(/\/keyboard/, async (ctx) => {
            const keyboard = Markup.keyboard([
                ['🔍 Search', '😉 Subscriptions'],
                ['🏟 Tournaments', '📺 Live Games'],
            ]).resize(true);
            return ctx.reply('Hello', Extra.markup(keyboard));
        });


        this.bot.hears(/\/tournament_\d+$/, async (ctx) => {
            const tournamentId = ctx.message.text.split('_')[1];
            const tournament = await tournamentRepository.findTournamentById(tournamentId);
            ctx.reply(tournament);
        });

        this.bot.hears(/\/team_\d+$/, async (ctx) => {
            const teamId = ctx.message.text.split('_')[1];
            const team = await teamRepository.findTeamById(teamId);
            if (!team) {
                return ctx.reply('No team was found');
            }
            let reply = `<b>${team.name}</b>
Upcoming matches: /team_matches_${teamId}
Subscribe: /subscribe_${teamId}`;
            ctx.replyWithHTML(reply);
        });

        this.bot.hears(/\/team_matches_\d+$/, async (ctx) => {
            return this.teamMatches(ctx)
        });

        this.bot.hears(/\/matches_\d+$/, async (ctx) => {
            return this.match(ctx);
        });

        this.bot.hears(/\/tournament_matches_\d+$/, async (ctx) => {
            return this.tournamentMatches(ctx);
        });

        this.bot.command('subscriptions', async (ctx) => {
            return this.subscriptions(ctx);
        });
        this.bot.hears('😉 Subscriptions', async (ctx) => {
            return this.subscriptions(ctx);
        });

        this.bot.hears(/\/notifications_(\d+)$/, async (ctx) => {
            return this.notificationsDialog(ctx);
        });

        this.bot.action(/setNotificationTime_(\d+)_/, async (ctx) => {
            return this.setNotificationsTime(ctx);
        });

        this.bot.hears('🔍 Search', (ctx) => {
            ctx.scene.enter('search');
        });
    }


    async onStart(ctx) {
        const messageUser = ctx.message.from;
        // console.log('privet', ctx.message.chat);
        try {
            // TODO: if user exists just update chatId
            await userRepository.save({
                telegramid: messageUser.id,
                chatid: ctx.message.chat.id,
                firstname: messageUser.first_name,
                lastname: messageUser.last_name,
                username: messageUser.username,
            });
        } catch (e) {
            console.debug('User already exist', e.message);
        }
        const keyboard = Markup.keyboard([
            ['🔍 Search', '😉 Subscriptions'],
            ['🏟 Tournaments', '📺 Live Games'],
        ]).resize(true);
        return ctx.reply('Hello', Extra.markup(keyboard));
    }

    async match(ctx) {
        const matchId = ctx.message.text.split('_')[1];
        const match = await matchRepository.findMatchWithTournamentInfoById(matchId);
        const teams = await teamRepository.findTeamsById([match.team1id, match.team2id]);
        if (match) {
            const date = utils.formatDate(new Date(match.beginat));
            const team1Name = teams[0] ? teams[0].name : 'TBD';
            const team2Name = teams[1] ? teams[1].name : 'TBD';
            let reply = `${match.full_name}\r\n ${date} \r\n <b>${team1Name} vs ${team2Name}</b>`;
            return ctx.replyWithHTML(reply);
        } else {
            return ctx.reply('There is no match with that Id');
        }
    }

    async tournamentMatches(ctx) {
        const tournamentId = ctx.message.text.split('_')[2];
        const tournament = await tournamentRepository.findTournamentById(tournamentId);
        const matches = await matchRepository.findUpcomingTournamentMatches(tournamentId, 10, 0);
        let reply = `<b>${tournament.fullName}</b> matches:\r\n`;
        for (const match of matches) {
            const date = utils.formatDate(new Date(match.beginAt));
            const team1 = match.team1[0];
            const team2 = match.team2[0];
            const team1Name = team1 ? team1.name : 'TBD';
            const team2Name = team2 ? team2.name : 'TBD';
            reply += `<b>${team1Name} vs ${team2Name}</b> on ${date}\r\n`;
            // console.log(team1);
        }
        if (!matches.length) {
            reply += 'No matches found';
        }
        ctx.replyWithHTML(reply);
    }

    async teamMatches(ctx) {
        const teamId = ctx.message.text.split('_')[2];
        const matches = await matchRepository.findUpcomingTeamMatches(teamId, 10, 0);
        let reply = '';
        for (const match of matches) {
            const date = new Date(match.beginAt);
            const team1 = match.team1[0];
            const team2 = match.team2[0];
            const team1Name = team1 ? team1.name : 'TBD';
            const team2Name = team2 ? team2.name : 'TBD';
            reply += `<b>${team1Name} vs ${team2Name}</b> - `;
            reply += utils.formatDate(date);
            reply += ` /matches_${match.matchId}\r\n`;
        }
        if (reply.length) {
            ctx.replyWithHTML(reply);
        } else {
            ctx.reply('Currently there are no upcoming games for this team');
        }
    }

    createSearchStage() {
        const searchWizard = new WizardScene('search',
            (ctx) => {
                ctx.reply('Enter team or tournament name:');
                return ctx.wizard.next()
            },
            async (ctx) => {
                try {
                    const teams = await teamRepository.findTeamsByPartialName(ctx.message.text);
                    const tournaments = await tournamentRepository.findTournamentsByPartialName(ctx.message.text, 10, 0);
                    // console.log(teams);
                    let text = '';
                    if (teams && teams.length) {
                        text += 'Found next teams: \r\n';
                        for (let team of teams) {
                            text += `${team.name}  /team_${team.id}\r\n`;
                        }
                    }
                    if (text.length > 0) text += '\r\n';
                    if (tournaments && tournaments.length) {
                        text += 'Found next tournaments: \r\n';
                        for (let tournament of tournaments) {
                            text += `${tournament.full_name}  /tournament_${tournament.id}\r\n`;
                        }
                    }
                    if (!text || text.length < 1) {
                        text += 'Nothing was found :(';
                    }

                    ctx.reply(text);
                } catch (err) {
                    console.log(err.message);
                    ctx.reply('Error occured. Try again later');
                }
                return ctx.scene.leave();
            }
        );
        const stage = new Stage([searchWizard], {});
        return stage;
    }

    async subscribe(ctx) {
        const userTelegramId = ctx.message.from.id;
        const userId = await this.getUserId(userTelegramId);
        const teamPandaId = ctx.message.text.split('_')[1];
        const team = await teamRepository.findTeamById(teamPandaId);
        try {
            const subscription = await subscriptionRepository.findSubscription(userId, teamPandaId);
            console.log(subscription);
            if (subscription.length > 0) {
                ctx.reply(`You are already subscribed to ${team.name}`);
                return;
            }
            const result = await subscriptionRepository.subscribe(userId, teamPandaId)
            console.log(result);
            ctx.reply(`You are now subscribed to ${team.name}`);
        } catch (e) {
            console.log('Error while subscribing', e);
            ctx.reply('Error occurred while subscribing. Try again later...');
        }
    }

    async subscriptions(ctx) {
        const userTelegramId = ctx.message.from.id;
        const userId = await this.getUserId(userTelegramId);
        // const userSubscriptions = await Subscription.find({userTelegramId: userId}).select('teamPandaId -_id');
        const teams = await subscriptionRepository.getUserSubscriptionsTeams(userId, 10, 0);

        let text = 'Your subscriptions: \r\n\r\n';
        for (let team of teams) {
            text += `<b>${team.name}</b> \r\n`;
            text += 'Unsubscribe: \r\n';
            text += '/unsubscribe_' + team.id + '\r\n';
            text += 'Manage notifications: \r\n';
            text += '/notifications_' + team.id + '\r\n\r\n';
        }
        return ctx.replyWithHTML(text);
    }

    async notificationsDialog(ctx) {
        const teamId = ctx.match[1];
        ctx.reply('How much minutes before match should I notify you?', Markup.inlineKeyboard([
            [Markup.callbackButton('🕒 0 minutes', `setNotificationTime_0_${teamId}`), Markup.callbackButton('🕒 15 minutes', `setNotificationTime_15_${teamId}`)],
            [Markup.callbackButton('🕒 30 minutes', `setNotificationTime_30_${teamId}`), Markup.callbackButton('🕒 60 minutes', `setNotificationTime_60_${teamId}`)],
        ]).extra());
    }

    async setNotificationsTime(ctx) {
        const userTelegramId = ctx.chat.id;
        const userId = await this.getUserId(userTelegramId);
        const [_, timeInMinutes, teamPandaId] = ctx.match.input.split('_');
        const team = await teamRepository.findTeamById(teamPandaId);
        try {
            await subscriptionRepository.updateNotificationTime(userId, teamPandaId, timeInMinutes);
            return ctx.reply(`Now when ${team.name} will play, you will be notified ${timeInMinutes} minutes before match start`);
        } catch (e) {
            console.log(e);
            return ctx.reply(`Error occurred while processing your request`);
        }
    }

    async unsubscribe(ctx) {
        const userTelegramId = ctx.message.from.id;
        const userId = await this.getUserId(userTelegramId);
        const teamId = ctx.message.text.split('_')[1];
        const team = await teamRepository.findTeamById(teamId);
        try {
            const deleteResult = await subscriptionRepository.unsubscribe(userId, teamId);
            console.log(deleteResult);
            if (deleteResult.length > 0) {
                ctx.reply(`You will no longer receive notifications about ${team.name}`);
            } else {
                ctx.reply(`You are not subscribed to ${team.name}`);
            }
        } catch (e) {
            console.log('Error while trying to unsubscribe', e);
            ctx.reply('Error occurred while trying to unsubscribe. Try again later...');
        }
    }

    launch() {
        this.bot.launch();
    }

    async sendMessage(chatId: number, message: string) {
        try {
            const result = await this.bot.telegram.sendMessage(chatId, message);
            return true;
        } catch (e) {
            return false;
        }
    }

    async sendHtmlMessage(chatId: number, message: string) {
        try {
            const result = await this.bot.telegram.sendMessage(chatId, message, { parse_mode: "HTML" });
            return true;
        } catch (e) {
            return false;
        }
    }

    async getUserId(userTelegramId: number) {
        if (this.userIds.has(userTelegramId)) {
            return this.userIds.get(userTelegramId);
        }
        const user = await userRepository.getUserId(userTelegramId);
        // console.log(user);
        return user.id;
    }


}
