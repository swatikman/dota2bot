import { PostgresRepository } from "./PostgresRepository";
import { SubscriptionRepository } from "./SubscriptionRepository";
import { injectable } from "inversify";

@injectable()
export class PostgresSubscriptionRepository extends PostgresRepository implements SubscriptionRepository {

    constructor() {
        super();
    }

    async subscribe(userId, teamId) {
        return this.database.query(`INSERT INTO subscriptions (userid, teamid) VALUES (${userId}, ${teamId})`);
    }

    async findSubscription(userId, teamId) {
        return this.database.query(`SELECT * FROM subscriptions WHERE userid = ${userId} AND teamid = ${teamId}`);
    }

    async findSubscriptionById(id: number) {
        return this.database.one(`SELECT * FROM subscriptions WHERE id = ${id}`);
    }

    async getUserSubscriptions(userId, limit = 10, offset = 0) {
        return this.database.query(`SELECT * FROM subscriptions WHERE userid = ${userId} LIMIT ${limit} OFFSET ${offset}`);
    }
    
    
    async getUserSubscriptionsTeams(userId, limit = 10, offset = 0) {
        return this.database.query(`SELECT teams.id, teams.name FROM subscriptions 
            INNER JOIN teams ON subscriptions.teamid = teams.id AND subscriptions.userid = ${userId} LIMIT ${limit} OFFSET ${offset}`);
    }

    async updateNotificationTime(userId, teamId, notificationTime) {
        return this.database.query(`UPDATE subscriptions SET notify_before_match = ${notificationTime} WHERE userid = ${userId} AND  teamid= ${teamId}`);
    }

    async unsubscribe(userId, teamId) {
        return this.database.query(`DELETE FROM subscriptions WHERE userid = ${userId} AND teamid = ${teamId} RETURNING id`);
    }

    async findSubscriptionsShouldBeNotified(team1id: number, team2id: number, newMatchId: number) {
        return this.database.query(`SELECT * FROM subscriptions WHERE (teamid = ${team1id} OR teamid = ${team2id}) AND last_notified_game_id < ${newMatchId}`)
    }

    async updateSubscription(subscription: any) {
        return this.database.query(`UPDATE subscriptions SET teamid = ${subscription.teamid}, userid = ${subscription.userid},
                notify_before_match = ${subscription.notify_before_match}, last_notified_game_id = ${subscription.last_notified_game_id} WHERE id = ${subscription.id}`);
    }
}