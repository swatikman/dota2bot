import { inject, injectable } from "inversify";
import { DATABASE_TYPES, NOTIIFICATOR } from './di/Types';
import { SubscriptionRepository } from "./repositories/SubscriptionRepository";
import { MatchRepository } from "./repositories/MatchRepository";
import { TeamRepository } from "./repositories/TeamRepository";
import { UserRepository } from "./repositories/UserRepository";
import { container } from "./di/Container";

const cron = require('node-cron');

@injectable()
export class Notificator {

    private onNotificationReady: Function;

    constructor(@inject(DATABASE_TYPES.MATCH) private matchRepository: MatchRepository,
            @inject(DATABASE_TYPES.SUBSCRIPTION) private subscriptionRepository: SubscriptionRepository,
            @inject(DATABASE_TYPES.TEAM) private teamRepository: TeamRepository,
            @inject(DATABASE_TYPES.USER) private userRepository: UserRepository) {

    }

    static startNotificator(onNotificationReady: Function, secondsBetweenTicks) {
        const notificator = container.get<Notificator>(NOTIIFICATOR);
        notificator.subscribeOnNotifications(onNotificationReady);
        console.log(`Started notificator every ${secondsBetweenTicks} seconds`);
        cron.schedule(`*/${secondsBetweenTicks} * * * * *`, async () => {
            console.log('Notify if needed ' + new Date().toLocaleString('uk-UA'));
            await notificator.notify();
        });
    }

    private subscribeOnNotifications(onNotificationReady: Function) {
        this.onNotificationReady = onNotificationReady;
    }

    private async notify() {
        const matches = await this.findMatchesThatStartSoon();
        // console.log(matches);
        for (let match of matches) {
            const subscriptions = await this.findSubscriptionsForTeamsInMatch(match);
            await this.processSubscriptionsForTeam(match, subscriptions);
        }
    }

    private async findMatchesThatStartSoon() {
        // const HOUR = 1000 * 60 * 60;
        // const inOneHour = Date.now() + HOUR;
        const matches = await this.matchRepository.findMatchesThatStartLessThanInHour();
        for (let match of matches) {
            if (match.beginat > Date.now()) {
                console.log(`Match between ${match.team1id} and ${match.team2id} will start at ${new Date(match.beginat)}`);
            }
        }
        return matches;
    }

    private async findSubscriptionsForTeamsInMatch(match) {
        const subscriptions = await this.subscriptionRepository.findSubscriptionsShouldBeNotified(match.team1id, match.team2id, match.id);
        return subscriptions;
    }

    private async processSubscriptionsForTeam(match, subscriptions) {
        for (let subscription of subscriptions) {
            const userId = subscription.userid;
            const MINUTE = 1000 * 60;
            const team1 = await this.teamRepository.findTeamById(match.team1id);
            const team2 = await  this.teamRepository.findTeamById(match.team2id);
            const user = await this.userRepository.findUser(userId);
            if (match.beginat - Date.now() <= subscription.notify_before_match * MINUTE) {
                const minutesBeforeMatch = Math.floor((match.beginat - Date.now()) / 1000 / 60);
                console.log(match.beginat - Date.now());
                console.log(`Notifying user ${userId} that match of ${team1.name} and ${team2.name} will start in ${minutesBeforeMatch} minutes`);
                const notification = {
                    chatId: user.chatid,
                    team1Name: team1.name,
                    team2Name: team2.name,
                    startInMinutes: minutesBeforeMatch
                };
                const notificationSent = this.onNotificationReady(notification);
                if (notificationSent) {
                    console.log('notifcation sent hurrah');
                    subscription.last_notified_game_id = match.id;
                    await this.subscriptionRepository.updateSubscription(subscription);
                    // await subscription.save();
                }
            }
        }
    }

}
