import { UserRepository } from "./UserRepository";
import { PostgresRepository } from "./PostgresRepository";
import { injectable } from "inversify";

@injectable()
class PostgresUserRepository extends PostgresRepository implements UserRepository {

    constructor() {
        super();
    }

    async save(user) {
        // this.database.query('INSERT ')
        if (!user.lastname) user.lastname = 'NULL';
        if (!user.firstname) user.lastname = 'NULL';
        if (!user.username) user.lastname = 'NULL';

        return this.database.query(`INSERT INTO users(telegramid, chatid, firstname, lastname, username)
             VALUES (${user.telegramid}, ${user.chatid}, '${user.firstname}', '${user.lastname}', '${user.username}')`);
    }

    async findUser(id: number) {
        return this.database.one(`SELECT * FROM users WHERE id = ${id}`)
    }

    async getUserId(userTelegramId: number) {
        return await this.database.one(`SELECT id FROM users WHERE telegramid = ${userTelegramId}`);
    }
}

export { PostgresUserRepository }