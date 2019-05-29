
interface SubscriptionRepository {
    subscribe(userId: number, teamId: number);

    unsubscribe(userId: number, teamid: number); 

    getUserSubscriptions(userId: number, limit: number, offset: number); 

    getUserSubscriptionsTeams(userId: number, limit: number, offset: number);

    findSubscription(userId: number, teamid: number);
    
    findSubscriptionById(id: number);

    findSubscriptionsShouldBeNotified(team1id: number, team2id: number, newMatchId: number);

    updateNotificationTime(userId: number, teamId: number, notificationTime: number);

    updateSubscription(subscription: any);
}

export { SubscriptionRepository }