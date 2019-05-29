const options = {
    // Initialization Options
    // promiseLib: promise
};
const pgp = require('pg-promise')(options);

export class Database {
    private client: any;

    async connect() {

        const conString = "postgres://postgres:root@localhost:5432/dota2bot";
        this.client = await pgp(conString);
        // console.log(this.client);
        return this.client;
    }

    async query(query) {
        return this.client.query(query);
    }

    async one(query) {
        return this.client.one(query);
    }

    async none(query) {
        return this.client.none(query);
    }

    static onConflictString(columns) {
        let query = 'SET ';
        columns.forEach((column, i) => {
            query += `${column} = EXCLUDED.${column}`;
            if (i + 1 < columns.length) query += ', ';
        });
        return query;
    }

    async upsert(columns, table, values) {
        const cs = new pgp.helpers.ColumnSet(columns,
            {table: table});
        const query = pgp.helpers.insert(values, cs) + ' ON CONFLICT (id) DO UPDATE ' +
            Database.onConflictString(columns);
        return await this.client.none(query);
    }

}

export const database = new Database();
