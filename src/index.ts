import 'reflect-metadata';
// need to import container at start of project bc sometimes injection is not working
import './di/Container';
import * as Config from './Config'
import { ApiRetriever } from './ApiRetriever';
import { container } from './di/Container';
import { RETRIEVERS } from './di/Types';
import { Notificator } from './Notificator';
import { ExpressApp } from './api/ExpressApp';
import { database } from './PostgreSqlDatabase';
import { TelegramBot } from './TelegramBot';
database.connect();

const bot = new TelegramBot();
bot.launch();
// bot.bot.hears('test', (ctx) => {
    // ctx.reply('123');
// });

const apiRetriever = container.get<ApiRetriever>(RETRIEVERS.API_RETRIEVER);
apiRetriever.cronRetrieveAllData();

Notificator.startNotificator(async (notification) => {
    // console.log(notification);
    let message = `Match <b>'${notification.team1Name} vs ${notification.team2Name}'</b> will start in ${notification.startInMinutes} minutes`;
    return await bot.sendHtmlMessage(notification.chatId, message);
}, 30);

const app = new ExpressApp(1234);

app.listen();





